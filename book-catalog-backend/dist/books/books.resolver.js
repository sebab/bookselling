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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooksResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const books_service_1 = require("./books.service");
const book_schema_1 = require("./schemas/book.schema");
const create_book_input_1 = require("./dto/create-book.input");
const gql_auth_guard_1 = require("../common/guards/gql-auth.guard");
const company_access_guard_1 = require("../common/guards/company-access.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const user_schema_1 = require("../users/schemas/user.schema");
let BooksResolver = class BooksResolver {
    constructor(booksService) {
        this.booksService = booksService;
    }
    createBook(createBookInput, user) {
        return this.booksService.create(createBookInput, user._id);
    }
    findAll(user, search) {
        return this.booksService.findAll(user.companyId, search);
    }
    findOne(id) {
        return this.booksService.findById(id);
    }
};
exports.BooksResolver = BooksResolver;
__decorate([
    (0, graphql_1.Mutation)(() => book_schema_1.Book),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard, company_access_guard_1.CompanyAccessGuard),
    __param(0, (0, graphql_1.Args)('createBookInput')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_book_input_1.CreateBookInput,
        user_schema_1.User]),
    __metadata("design:returntype", void 0)
], BooksResolver.prototype, "createBook", null);
__decorate([
    (0, graphql_1.Query)(() => [book_schema_1.Book], { name: 'books' }),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('search', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String]),
    __metadata("design:returntype", void 0)
], BooksResolver.prototype, "findAll", null);
__decorate([
    (0, graphql_1.Query)(() => book_schema_1.Book, { name: 'book' }),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BooksResolver.prototype, "findOne", null);
exports.BooksResolver = BooksResolver = __decorate([
    (0, graphql_1.Resolver)(() => book_schema_1.Book),
    __metadata("design:paramtypes", [books_service_1.BooksService])
], BooksResolver);
//# sourceMappingURL=books.resolver.js.map