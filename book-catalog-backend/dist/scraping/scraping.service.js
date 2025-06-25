"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrapingService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const cheerio = require("cheerio");
let ScrapingService = class ScrapingService {
    constructor() {
        this.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
    }
    async getBookPrice(query) {
        try {
            const sources = [
                () => this.scrapeAmazon(query),
                () => this.scrapeGoodreads(query),
                () => this.scrapeOpenLibrary(query),
            ];
            for (const source of sources) {
                try {
                    const price = await source();
                    if (price && price > 0) {
                        return price;
                    }
                }
                catch (error) {
                    console.warn('Price scraping failed for source:', error.message);
                }
            }
            return null;
        }
        catch (error) {
            console.error('Price scraping failed:', error);
            return null;
        }
    }
    async scrapeAmazon(query) {
        try {
            const searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(query)}&i=stripbooks`;
            const response = await axios_1.default.get(searchUrl, {
                headers: {
                    'User-Agent': this.userAgent,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Accept-Encoding': 'gzip, deflate',
                    'Connection': 'keep-alive',
                },
                timeout: 10000,
            });
            const $ = cheerio.load(response.data);
            const priceSelectors = [
                '.a-price-whole',
                '.a-offscreen',
                '.a-price .a-offscreen',
                '.a-price-range .a-offscreen',
            ];
            for (const selector of priceSelectors) {
                const priceElement = $(selector).first();
                if (priceElement.length) {
                    const priceText = priceElement.text().replace(/[^0-9.]/g, '');
                    const price = parseFloat(priceText);
                    if (!isNaN(price) && price > 0) {
                        return price;
                    }
                }
            }
            return null;
        }
        catch (error) {
            console.warn('Amazon scraping failed:', error.message);
            return null;
        }
    }
    async scrapeGoodreads(query) {
        try {
            return null;
        }
        catch (error) {
            console.warn('Goodreads scraping failed:', error.message);
            return null;
        }
    }
    async scrapeOpenLibrary(query) {
        try {
            const searchUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=1`;
            const response = await axios_1.default.get(searchUrl, {
                timeout: 5000,
            });
            if (response.data.docs && response.data.docs.length > 0) {
                const book = response.data.docs[0];
                return null;
            }
            return null;
        }
        catch (error) {
            console.warn('Open Library scraping failed:', error.message);
            return null;
        }
    }
    async getBookMetadata(isbn) {
        try {
            const googleBooksUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
            const response = await axios_1.default.get(googleBooksUrl, {
                timeout: 5000,
            });
            if (response.data.items && response.data.items.length > 0) {
                const book = response.data.items[0].volumeInfo;
                return {
                    title: book.title,
                    authors: book.authors,
                    publisher: book.publisher,
                    publishedDate: book.publishedDate,
                    description: book.description,
                    categories: book.categories,
                    language: book.language,
                    pageCount: book.pageCount,
                    imageLinks: book.imageLinks,
                };
            }
            return null;
        }
        catch (error) {
            console.warn('Metadata scraping failed:', error.message);
            return null;
        }
    }
};
exports.ScrapingService = ScrapingService;
exports.ScrapingService = ScrapingService = __decorate([
    (0, common_1.Injectable)()
], ScrapingService);
//# sourceMappingURL=scraping.service.js.map