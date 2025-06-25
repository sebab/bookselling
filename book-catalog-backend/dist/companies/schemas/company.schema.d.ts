import { Document } from 'mongoose';
export type CompanyDocument = Company & Document;
export declare class Company {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    logo?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const CompanySchema: import("mongoose").Schema<Company, import("mongoose").Model<Company, any, any, any, Document<unknown, any, Company, any> & Company & Required<{
    _id: string;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Company, Document<unknown, {}, import("mongoose").FlatRecord<Company>, {}> & import("mongoose").FlatRecord<Company> & Required<{
    _id: string;
}> & {
    __v: number;
}>;
