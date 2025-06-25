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
exports.CompaniesResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const companies_service_1 = require("./companies.service");
const company_schema_1 = require("./schemas/company.schema");
const create_company_input_1 = require("./dto/create-company.input");
const gql_auth_guard_1 = require("../common/guards/gql-auth.guard");
let CompaniesResolver = class CompaniesResolver {
    constructor(companiesService) {
        this.companiesService = companiesService;
    }
    createCompany(createCompanyInput) {
        return this.companiesService.create(createCompanyInput);
    }
    findAll() {
        return this.companiesService.findAll();
    }
    findOne(id) {
        return this.companiesService.findById(id);
    }
    findBySlug(slug) {
        return this.companiesService.findBySlug(slug);
    }
};
exports.CompaniesResolver = CompaniesResolver;
__decorate([
    (0, graphql_1.Mutation)(() => company_schema_1.Company),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('createCompanyInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_company_input_1.CreateCompanyInput]),
    __metadata("design:returntype", void 0)
], CompaniesResolver.prototype, "createCompany", null);
__decorate([
    (0, graphql_1.Query)(() => [company_schema_1.Company], { name: 'companies' }),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CompaniesResolver.prototype, "findAll", null);
__decorate([
    (0, graphql_1.Query)(() => company_schema_1.Company, { name: 'company' }),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CompaniesResolver.prototype, "findOne", null);
__decorate([
    (0, graphql_1.Query)(() => company_schema_1.Company, { name: 'companyBySlug' }),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CompaniesResolver.prototype, "findBySlug", null);
exports.CompaniesResolver = CompaniesResolver = __decorate([
    (0, graphql_1.Resolver)(() => company_schema_1.Company),
    __metadata("design:paramtypes", [companies_service_1.CompaniesService])
], CompaniesResolver);
//# sourceMappingURL=companies.resolver.js.map