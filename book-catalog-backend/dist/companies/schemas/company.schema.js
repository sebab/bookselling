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
exports.CompanySchema = exports.Company = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const graphql_1 = require("@nestjs/graphql");
let Company = class Company {
};
exports.Company = Company;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], Company.prototype, "_id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Company.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Company.prototype, "slug", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Company.prototype, "description", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Company.prototype, "logo", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Company.prototype, "isActive", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Company.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Company.prototype, "updatedAt", void 0);
exports.Company = Company = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, mongoose_1.Schema)({ timestamps: true })
], Company);
exports.CompanySchema = mongoose_1.SchemaFactory.createForClass(Company);
exports.CompanySchema.index({ name: 1 });
exports.CompanySchema.index({ slug: 1 });
//# sourceMappingURL=company.schema.js.map