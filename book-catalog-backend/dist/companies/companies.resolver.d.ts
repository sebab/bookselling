import { CompaniesService } from './companies.service';
import { Company } from './schemas/company.schema';
import { CreateCompanyInput } from './dto/create-company.input';
export declare class CompaniesResolver {
    private readonly companiesService;
    constructor(companiesService: CompaniesService);
    createCompany(createCompanyInput: CreateCompanyInput): Promise<Company>;
    findAll(): Promise<Company[]>;
    findOne(id: string): Promise<Company>;
    findBySlug(slug: string): Promise<Company>;
}
