import { Document } from 'mongoose';
export type BookDocument = Book & Document;
export declare class Book {
    _id: string;
    title: string;
    author: string;
    isbn?: string;
    publisher?: string;
    publishedYear?: number;
    language?: string;
    genre?: string;
    description?: string;
    images: string[];
    coverImage?: string;
    estimatedPrice?: number;
    condition?: string;
    companyId: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const BookSchema: import("mongoose").Schema<Book, import("mongoose").Model<Book, any, any, any, Document<unknown, any, Book, any> & Book & Required<{
    _id: string;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Book, Document<unknown, {}, import("mongoose").FlatRecord<Book>, {}> & import("mongoose").FlatRecord<Book> & Required<{
    _id: string;
}> & {
    __v: number;
}>;
