import { UserRole } from '../schemas/user.schema';
export declare class CreateUserInput {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: UserRole;
    companyId: string;
}
