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
exports.UserSchema = exports.User = exports.UserRole = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const graphql_1 = require("@nestjs/graphql");
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["MANAGER"] = "manager";
    UserRole["USER"] = "user";
})(UserRole || (exports.UserRole = UserRole = {}));
(0, graphql_1.registerEnumType)(UserRole, {
    name: 'UserRole',
});
let User = class User {
};
exports.User = User;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], User.prototype, "_id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, graphql_1.Field)(() => UserRole),
    (0, mongoose_1.Prop)({ type: String, enum: UserRole, default: UserRole.USER }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Company', required: true }),
    __metadata("design:type", String)
], User.prototype, "companyId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "isActive", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], User.prototype, "lastLoginAt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
exports.User = User = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, mongoose_1.Schema)({ timestamps: true })
], User);
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);
exports.UserSchema.index({ email: 1 });
exports.UserSchema.index({ companyId: 1 });
exports.UserSchema.index({ role: 1 });
//# sourceMappingURL=user.schema.js.map