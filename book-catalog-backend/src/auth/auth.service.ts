import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CompaniesService } from '../companies/companies.service';
import { User } from '../users/schemas/user.schema';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { AuthResponse } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private companiesService: CompaniesService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && await this.usersService.validatePassword(password, user.password)) {
      return user;
    }
    return null;
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const user = await this.validateUser(loginInput.email, loginInput.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.usersService.updateLastLogin(user._id);

    const payload = {
      sub: user._id,
      email: user.email,
      companyId: user.companyId,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async register(registerInput: RegisterInput): Promise<AuthResponse> {
    // Create company first
    const company = await this.companiesService.create({
      name: registerInput.companyName,
      description: registerInput.companyDescription,
    });

    // Create user with admin role for new company
    const user = await this.usersService.create({
      firstName: registerInput.firstName,
      lastName: registerInput.lastName,
      email: registerInput.email,
      password: registerInput.password,
      role: 'admin' as any,
      companyId: company._id,
    });

    const payload = {
      sub: user._id,
      email: user.email,
      companyId: user.companyId,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}