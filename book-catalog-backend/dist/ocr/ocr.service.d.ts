import { ConfigService } from '@nestjs/config';
export declare class OcrService {
    private configService;
    private supportedLanguages;
    constructor(configService: ConfigService);
    extractTextFromImage(imagePath: string, language?: string): Promise<any>;
    private preprocessImage;
    private detectLanguage;
    extractTextFromMultipleImages(imagePaths: string[], language?: string): Promise<any[]>;
    getSupportedLanguages(): string[];
}
