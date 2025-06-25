import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from './schemas/book.schema';
import { CreateBookInput } from './dto/create-book.input';
import { OcrService } from '../ocr/ocr.service';
import { ScrapingService } from '../scraping/scraping.service';

@Injectable()
export class BooksService {
  constructor(
      @InjectModel(Book.name) private bookModel: Model<BookDocument>,
      private ocrService: OcrService,
      private scrapingService: ScrapingService,
  ) {}

  async create(createBookInput: CreateBookInput, userId: string): Promise<Book> {
    const book = new this.bookModel({
      ...createBookInput,
      createdBy: userId,
    });

    return book.save();
  }

  async processBookImages(files: Express.Multer.File[], companyId: string, userId: string): Promise<Book> {
    // Extract text from images using OCR
    const ocrResults = await Promise.all(
        files.map(file => this.ocrService.extractTextFromImage(file.path))
    );

    // Parse book information from OCR results
    const bookInfo = this.parseBookInformation(ocrResults);

    // Get price estimation
    let estimatedPrice: number | undefined;
    if (bookInfo.isbn || (bookInfo.title && bookInfo.author)) {
      try {
        estimatedPrice = await this.scrapingService.getBookPrice(
            bookInfo.isbn || `${bookInfo.title} ${bookInfo.author}`
        );
      } catch (error) {
        console.warn('Failed to get price estimation:', error.message);
      }
    }

    // Create book record with fallback values for required fields
    const createBookInput: CreateBookInput = {
      title: bookInfo.title || 'Unknown Title',
      author: bookInfo.author || 'Unknown Author',
      isbn: bookInfo.isbn,
      publisher: bookInfo.publisher,
      publishedYear: bookInfo.publishedYear,
      language: bookInfo.language,
      genre: bookInfo.genre,
      description: bookInfo.description,
      images: files.map(file => file.filename),
      coverImage: files[0]?.filename,
      estimatedPrice,
      condition: bookInfo.condition,
      companyId,
    };

    return this.create(createBookInput, userId);
  }

  async findAll(companyId: string, search?: string): Promise<Book[]> {
    const filter: any = { companyId };

    if (search) {
      filter.$text = { $search: search };
    }

    return this.bookModel.find(filter).exec();
  }

  async findById(id: string): Promise<Book> {
    const book = await this.bookModel.findById(id).exec();
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }

  private parseBookInformation(ocrResults: any[]): Partial<CreateBookInput> {
    // Combine all OCR text
    const allText = ocrResults.map(result => result.text).join('\n');

    // Basic parsing logic - this can be enhanced with more sophisticated NLP
    const bookInfo: Partial<CreateBookInput> = {};

    // Extract ISBN
    const isbnMatch = allText.match(/ISBN[:\s]*([0-9\-X]{10,17})/i);
    if (isbnMatch) {
      bookInfo.isbn = isbnMatch[1].replace(/[-\s]/g, '');
    }

    // Extract title (usually the largest text or first line)
    const lines = allText.split('\n').filter(line => line.trim().length > 0);
    if (lines.length > 0) {
      // Look for title patterns - often the first substantial line
      const titleLine = lines.find(line => line.trim().length > 3 && !line.match(/^(by|author|isbn|published)/i));
      if (titleLine) {
        bookInfo.title = titleLine.trim();
      }
    }

    // Extract author (look for "by" keyword or common author patterns)
    const authorPatterns = [
      /by\s+([^\n]+)/i,
      /author[:\s]+([^\n]+)/i,
      /written\s+by\s+([^\n]+)/i,
    ];

    for (const pattern of authorPatterns) {
      const match = allText.match(pattern);
      if (match) {
        bookInfo.author = match[1].trim();
        break;
      }
    }

    // If no author found with patterns, try second line if it looks like an author
    if (!bookInfo.author && lines.length > 1) {
      const secondLine = lines[1].trim();
      // Check if second line looks like an author (not too long, not all caps, etc.)
      if (secondLine.length > 2 && secondLine.length < 50 && !secondLine.match(/^[A-Z\s]+$/)) {
        bookInfo.author = secondLine;
      }
    }

    // Extract publisher
    const publisherPatterns = [
      /published\s+by\s+([^\n]+)/i,
      /publisher[:\s]+([^\n]+)/i,
      /imprint[:\s]+([^\n]+)/i,
    ];

    for (const pattern of publisherPatterns) {
      const match = allText.match(pattern);
      if (match) {
        bookInfo.publisher = match[1].trim();
        break;
      }
    }

    // Extract year
    const yearMatch = allText.match(/(\d{4})/);
    if (yearMatch) {
      const year = parseInt(yearMatch[1]);
      if (year > 1800 && year <= new Date().getFullYear()) {
        bookInfo.publishedYear = year;
      }
    }

    // Detect language from OCR results
    if (ocrResults.length > 0 && ocrResults[0].language) {
      bookInfo.language = ocrResults[0].language;
    }

    // Extract genre/category if mentioned
    const genrePatterns = [
      /genre[:\s]+([^\n]+)/i,
      /category[:\s]+([^\n]+)/i,
      /subject[:\s]+([^\n]+)/i,
    ];

    for (const pattern of genrePatterns) {
      const match = allText.match(pattern);
      if (match) {
        bookInfo.genre = match[1].trim();
        break;
      }
    }

    // Extract description if present
    const descriptionPatterns = [
      /description[:\s]+([^\n]{20,})/i,
      /summary[:\s]+([^\n]{20,})/i,
      /about[:\s]+([^\n]{20,})/i,
    ];

    for (const pattern of descriptionPatterns) {
      const match = allText.match(pattern);
      if (match) {
        bookInfo.description = match[1].trim();
        break;
      }
    }

    return bookInfo;
  }
}