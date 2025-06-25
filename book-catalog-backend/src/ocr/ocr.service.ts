import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createWorker } from 'tesseract.js';
import * as sharp from 'sharp';

@Injectable()
export class OcrService {
  private supportedLanguages: string[];

  constructor(private configService: ConfigService) {
    this.supportedLanguages = this.configService
      .get<string>('OCR_LANGUAGES', 'eng')
      .split(',');
  }

  async extractTextFromImage(imagePath: string, language?: string): Promise<any> {
    try {
      // Preprocess image for better OCR accuracy
      const processedImagePath = await this.preprocessImage(imagePath);
      
      // Detect language if not provided
      const detectedLanguage = language || await this.detectLanguage(processedImagePath);
      
      // Create Tesseract worker
      const worker = await createWorker(detectedLanguage);
      
      // Extract text
      const { data } = await worker.recognize(processedImagePath);
      
      await worker.terminate();
      
      return {
        text: data.text,
        confidence: data.confidence,
        language: detectedLanguage,
        words: data.words,
        lines: data.lines,
        paragraphs: data.paragraphs,
      };
    } catch (error) {
      console.error('OCR processing failed:', error);
      throw new Error(`OCR processing failed: ${error.message}`);
    }
  }

  private async preprocessImage(imagePath: string): Promise<string> {
    const outputPath = imagePath.replace(/\.[^/.]+$/, '_processed.jpg');
    
    try {
      await sharp(imagePath)
        .resize(2000, 2000, { 
          fit: 'inside',
          withoutEnlargement: true 
        })
        .greyscale()
        .normalize()
        .sharpen()
        .jpeg({ quality: 95 })
        .toFile(outputPath);
      
      return outputPath;
    } catch (error) {
      console.warn('Image preprocessing failed, using original:', error.message);
      return imagePath;
    }
  }

  private async detectLanguage(imagePath: string): Promise<string> {
    try {
      // Try with multiple languages to detect the best match
      const testLanguages = ['eng', 'spa', 'fra', 'deu', 'ita', 'por'];
      let bestLanguage = 'eng';
      let bestConfidence = 0;

      for (const lang of testLanguages) {
        if (this.supportedLanguages.includes(lang)) {
          try {
            const worker = await createWorker(lang);
            const { data } = await worker.recognize(imagePath);
            await worker.terminate();

            if (data.confidence > bestConfidence) {
              bestConfidence = data.confidence;
              bestLanguage = lang;
            }
          } catch (error) {
            console.warn(`Language detection failed for ${lang}:`, error.message);
          }
        }
      }

      return bestLanguage;
    } catch (error) {
      console.warn('Language detection failed, defaulting to English:', error.message);
      return 'eng';
    }
  }

  async extractTextFromMultipleImages(imagePaths: string[], language?: string): Promise<any[]> {
    return Promise.all(
      imagePaths.map(path => this.extractTextFromImage(path, language))
    );
  }

  getSupportedLanguages(): string[] {
    return this.supportedLanguages;
  }
}