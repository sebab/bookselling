"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyAccessGuard = void 0;
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
let CompanyAccessGuard = class CompanyAccessGuard {
    canActivate(context) {
        const ctx = graphql_1.GqlExecutionContext.create(context);
        const { user } = ctx.getContext().req;
        const args = ctx.getArgs();
        if (!user) {
            throw new common_1.ForbiddenException('User not authenticated');
        }
        const companyId = args.companyId || args.input?.companyId;
        if (companyId && user.companyId !== companyId) {
            throw new common_1.ForbiddenException('Access denied to this company');
        }
        return true;
    }
};
exports.CompanyAccessGuard = CompanyAccessGuard;
exports.CompanyAccessGuard = CompanyAccessGuard = __decorate([
    (0, common_1.Injectable)()
], CompanyAccessGuard);
//# sourceMappingURL=company-access.guard.js.map