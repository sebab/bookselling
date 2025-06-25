import { BooksService } from './books.service';
import { Book } from './schemas/book.schema';
import { CreateBookInput } from './dto/create-book.input';
import { User } from '../users/schemas/user.schema';
export declare class BooksResolver {
    private readonly booksService;
    constructor(booksService: BooksService);
    createBook(createBookInput: CreateBookInput, user: User): Promise<Book>;
    findAll(user: User, search?: string): Promise<Book[]>;
    findOne(id: string): Promise<Book>;
}
