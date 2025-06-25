import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BooksService } from './books.service';
import { BooksResolver } from './books.resolver';
import { Book, BookSchema } from './schemas/book.schema';
import { OcrModule } from '../ocr/ocr.module';
import { ScrapingModule } from '../scraping/scraping.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Book.name, schema: BookSchema },
    ]),
    OcrModule,
    ScrapingModule,
  ],
  providers: [BooksService, BooksResolver],
  exports: [BooksService],
})
export class BooksModule {}