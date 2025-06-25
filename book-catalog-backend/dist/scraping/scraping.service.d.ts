export declare class ScrapingService {
    private readonly userAgent;
    getBookPrice(query: string): Promise<number | null>;
    private scrapeAmazon;
    private scrapeGoodreads;
    private scrapeOpenLibrary;
    getBookMetadata(isbn: string): Promise<any>;
}
