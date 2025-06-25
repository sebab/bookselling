import { Model } from 'mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';
import { CreateCompanyInput } from './dto/create-company.input';
export declare class CompaniesService {
    private companyModel;
    constructor(companyModel: Model<CompanyDocument>);
    create(createCompanyInput: CreateCompanyInput): Promise<Company>;
    findAll(): Promise<Company[]>;
    findById(id: string): Promise<Company>;
    findBySlug(slug: string): Promise<Company>;
    private generateSlug;
}
