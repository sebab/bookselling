import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { AuthResponse } from './dto/auth-response.dto';
export declare class AuthResolver {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginInput: LoginInput): Promise<AuthResponse>;
    register(registerInput: RegisterInput): Promise<AuthResponse>;
}
