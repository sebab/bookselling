import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserInput } from './dto/create-user.input';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    create(createUserInput: CreateUserInput): Promise<User>;
    findAll(companyId?: string): Promise<User[]>;
    findById(id: string): Promise<User>;
    findByEmail(email: string): Promise<User>;
    updateLastLogin(userId: string): Promise<void>;
    validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
}
