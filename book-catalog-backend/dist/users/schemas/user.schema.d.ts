import { Document } from 'mongoose';
export type UserDocument = User & Document;
export declare enum UserRole {
    ADMIN = "admin",
    MANAGER = "manager",
    USER = "user"
}
export declare class User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: UserRole;
    companyId: string;
    isActive: boolean;
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User, any> & User & Required<{
    _id: string;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>, {}> & import("mongoose").FlatRecord<User> & Required<{
    _id: string;
}> & {
    __v: number;
}>;
