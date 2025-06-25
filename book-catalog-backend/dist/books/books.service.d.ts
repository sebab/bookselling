import { Model } from 'mongoose';
import { Book, BookDocument } from './schemas/book.schema';
import { CreateBookInput } from './dto/create-book.input';
import { OcrService } from '../ocr/ocr.service';
import { ScrapingService } from '../scraping/scraping.service';
export declare class BooksService {
    private bookModel;
    private ocrService;
    private scrapingService;
    constructor(bookModel: Model<BookDocument>, ocrService: OcrService, scrapingService: ScrapingService);
    create(createBookInput: CreateBookInput, userId: string): Promise<Book>;
    processBookImages(files: Express.Multer.File[], companyId: string, userId: string): Promise<Book>;
    findAll(companyId: string, search?: string): Promise<Book[]>;
    findById(id: string): Promise<Book>;
    private parseBookInformation;
}
