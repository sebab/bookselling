import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class ScrapingService {
  private readonly userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

  async getBookPrice(query: string): Promise<number | null> {
    try {
      // Try multiple sources for price information
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
        } catch (error) {
          console.warn('Price scraping failed for source:', error.message);
        }
      }

      return null;
    } catch (error) {
      console.error('Price scraping failed:', error);
      return null;
    }
  }

  private async scrapeAmazon(query: string): Promise<number | null> {
    try {
      const searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(query)}&i=stripbooks`;
      
      const response = await axios.get(searchUrl, {
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
      
      // Look for price in various Amazon price selectors
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
    } catch (error) {
      console.warn('Amazon scraping failed:', error.message);
      return null;
    }
  }

  private async scrapeGoodreads(query: string): Promise<number | null> {
    try {
      // Goodreads doesn't typically show prices, but we can try to get book info
      // and then search for it elsewhere
      return null;
    } catch (error) {
      console.warn('Goodreads scraping failed:', error.message);
      return null;
    }
  }

  private async scrapeOpenLibrary(query: string): Promise<number | null> {
    try {
      // Open Library API for book information
      const searchUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=1`;
      
      const response = await axios.get(searchUrl, {
        timeout: 5000,
      });

      if (response.data.docs && response.data.docs.length > 0) {
        const book = response.data.docs[0];
        // Open Library doesn't provide prices, but we could use this data
        // to search other price sources
        return null;
      }

      return null;
    } catch (error) {
      console.warn('Open Library scraping failed:', error.message);
      return null;
    }
  }

  async getBookMetadata(isbn: string): Promise<any> {
    try {
      // Try Google Books API first
      const googleBooksUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
      
      const response = await axios.get(googleBooksUrl, {
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
    } catch (error) {
      console.warn('Metadata scraping failed:', error.message);
      return null;
    }
  }
}