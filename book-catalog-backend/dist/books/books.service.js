"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooksService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const book_schema_1 = require("./schemas/book.schema");
const ocr_service_1 = require("../ocr/ocr.service");
const scraping_service_1 = require("../scraping/scraping.service");
let BooksService = class BooksService {
    constructor(bookModel, ocrService, scrapingService) {
        this.bookModel = bookModel;
        this.ocrService = ocrService;
        this.scrapingService = scrapingService;
    }
    async create(createBookInput, userId) {
        const book = new this.bookModel({
            ...createBookInput,
            createdBy: userId,
        });
        return book.save();
    }
    async processBookImages(files, companyId, userId) {
        const ocrResults = await Promise.all(files.map(file => this.ocrService.extractTextFromImage(file.path)));
        const bookInfo = this.parseBookInformation(ocrResults);
        let estimatedPrice;
        if (bookInfo.isbn || (bookInfo.title && bookInfo.author)) {
            try {
                estimatedPrice = await this.scrapingService.getBookPrice(bookInfo.isbn || `${bookInfo.title} ${bookInfo.author}`);
            }
            catch (error) {
                console.warn('Failed to get price estimation:', error.message);
            }
        }
        const createBookInput = {
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
    async findAll(companyId, search) {
        const filter = { companyId };
        if (search) {
            filter.$text = { $search: search };
        }
        return this.bookModel.find(filter).exec();
    }
    async findById(id) {
        const book = await this.bookModel.findById(id).exec();
        if (!book) {
            throw new common_1.NotFoundException('Book not found');
        }
        return book;
    }
    parseBookInformation(ocrResults) {
        const allText = ocrResults.map(result => result.text).join('\n');
        const bookInfo = {};
        const isbnMatch = allText.match(/ISBN[:\s]*([0-9\-X]{10,17})/i);
        if (isbnMatch) {
            bookInfo.isbn = isbnMatch[1].replace(/[-\s]/g, '');
        }
        const lines = allText.split('\n').filter(line => line.trim().length > 0);
        if (lines.length > 0) {
            const titleLine = lines.find(line => line.trim().length > 3 && !line.match(/^(by|author|isbn|published)/i));
            if (titleLine) {
                bookInfo.title = titleLine.trim();
            }
        }
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
        if (!bookInfo.author && lines.length > 1) {
            const secondLine = lines[1].trim();
            if (secondLine.length > 2 && secondLine.length < 50 && !secondLine.match(/^[A-Z\s]+$/)) {
                bookInfo.author = secondLine;
            }
        }
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
        const yearMatch = allText.match(/(\d{4})/);
        if (yearMatch) {
            const year = parseInt(yearMatch[1]);
            if (year > 1800 && year <= new Date().getFullYear()) {
                bookInfo.publishedYear = year;
            }
        }
        if (ocrResults.length > 0 && ocrResults[0].language) {
            bookInfo.language = ocrResults[0].language;
        }
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
};
exports.BooksService = BooksService;
exports.BooksService = BooksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(book_schema_1.Book.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        ocr_service_1.OcrService,
        scraping_service_1.ScrapingService])
], BooksService);
//# sourceMappingURL=books.service.js.map