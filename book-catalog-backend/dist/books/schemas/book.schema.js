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
exports.BookSchema = exports.Book = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const graphql_1 = require("@nestjs/graphql");
let Book = class Book {
};
exports.Book = Book;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], Book.prototype, "_id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Book.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Book.prototype, "author", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Book.prototype, "isbn", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Book.prototype, "publisher", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Book.prototype, "publishedYear", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Book.prototype, "language", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Book.prototype, "genre", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Book.prototype, "description", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String]),
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Book.prototype, "images", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Book.prototype, "coverImage", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Book.prototype, "estimatedPrice", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Book.prototype, "condition", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Company', required: true }),
    __metadata("design:type", String)
], Book.prototype, "companyId", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", String)
], Book.prototype, "createdBy", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Book.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Book.prototype, "updatedAt", void 0);
exports.Book = Book = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, mongoose_1.Schema)({ timestamps: true })
], Book);
exports.BookSchema = mongoose_1.SchemaFactory.createForClass(Book);
exports.BookSchema.index({ title: 'text', author: 'text', isbn: 'text' });
exports.BookSchema.index({ companyId: 1 });
exports.BookSchema.index({ createdBy: 1 });
exports.BookSchema.index({ isbn: 1 });
//# sourceMappingURL=book.schema.js.map