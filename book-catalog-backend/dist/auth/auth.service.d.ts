import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CompaniesService } from '../companies/companies.service';
import { User } from '../users/schemas/user.schema';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { AuthResponse } from './dto/auth-response.dto';
export declare class AuthService {
    private usersService;
    private companiesService;
    private jwtService;
    constructor(usersService: UsersService, companiesService: CompaniesService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<User | null>;
    login(loginInput: LoginInput): Promise<AuthResponse>;
    register(registerInput: RegisterInput): Promise<AuthResponse>;
}
