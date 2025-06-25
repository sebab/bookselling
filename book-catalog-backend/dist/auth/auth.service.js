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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const companies_service_1 = require("../companies/companies.service");
let AuthService = class AuthService {
    constructor(usersService, companiesService, jwtService) {
        this.usersService = usersService;
        this.companiesService = companiesService;
        this.jwtService = jwtService;
    }
    async validateUser(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (user && await this.usersService.validatePassword(password, user.password)) {
            return user;
        }
        return null;
    }
    async login(loginInput) {
        const user = await this.validateUser(loginInput.email, loginInput.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
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
    async register(registerInput) {
        const company = await this.companiesService.create({
            name: registerInput.companyName,
            description: registerInput.companyDescription,
        });
        const user = await this.usersService.create({
            firstName: registerInput.firstName,
            lastName: registerInput.lastName,
            email: registerInput.email,
            password: registerInput.password,
            role: 'admin',
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        companies_service_1.CompaniesService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map