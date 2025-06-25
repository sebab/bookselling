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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OcrService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const tesseract_js_1 = require("tesseract.js");
const sharp = require("sharp");
let OcrService = class OcrService {
    constructor(configService) {
        this.configService = configService;
        this.supportedLanguages = this.configService
            .get('OCR_LANGUAGES', 'eng')
            .split(',');
    }
    async extractTextFromImage(imagePath, language) {
        try {
            const processedImagePath = await this.preprocessImage(imagePath);
            const detectedLanguage = language || await this.detectLanguage(processedImagePath);
            const worker = await (0, tesseract_js_1.createWorker)(detectedLanguage);
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
        }
        catch (error) {
            console.error('OCR processing failed:', error);
            throw new Error(`OCR processing failed: ${error.message}`);
        }
    }
    async preprocessImage(imagePath) {
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
        }
        catch (error) {
            console.warn('Image preprocessing failed, using original:', error.message);
            return imagePath;
        }
    }
    async detectLanguage(imagePath) {
        try {
            const testLanguages = ['eng', 'spa', 'fra', 'deu', 'ita', 'por'];
            let bestLanguage = 'eng';
            let bestConfidence = 0;
            for (const lang of testLanguages) {
                if (this.supportedLanguages.includes(lang)) {
                    try {
                        const worker = await (0, tesseract_js_1.createWorker)(lang);
                        const { data } = await worker.recognize(imagePath);
                        await worker.terminate();
                        if (data.confidence > bestConfidence) {
                            bestConfidence = data.confidence;
                            bestLanguage = lang;
                        }
                    }
                    catch (error) {
                        console.warn(`Language detection failed for ${lang}:`, error.message);
                    }
                }
            }
            return bestLanguage;
        }
        catch (error) {
            console.warn('Language detection failed, defaulting to English:', error.message);
            return 'eng';
        }
    }
    async extractTextFromMultipleImages(imagePaths, language) {
        return Promise.all(imagePaths.map(path => this.extractTextFromImage(path, language)));
    }
    getSupportedLanguages() {
        return this.supportedLanguages;
    }
};
exports.OcrService = OcrService;
exports.OcrService = OcrService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], OcrService);
//# sourceMappingURL=ocr.service.js.map