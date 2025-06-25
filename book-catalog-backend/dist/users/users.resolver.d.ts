import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { CreateUserInput } from './dto/create-user.input';
export declare class UsersResolver {
    private readonly usersService;
    constructor(usersService: UsersService);
    createUser(createUserInput: CreateUserInput): Promise<User>;
    findAll(user: User): Promise<User[]>;
    findOne(id: string): Promise<User>;
    getCurrentUser(user: User): User;
}
