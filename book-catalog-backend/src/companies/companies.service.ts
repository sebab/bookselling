import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';
import { CreateCompanyInput } from './dto/create-company.input';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
  ) {}

  async create(createCompanyInput: CreateCompanyInput): Promise<Company> {
    const slug = this.generateSlug(createCompanyInput.name);
    
    // Check if company with same name or slug exists
    const existingCompany = await this.companyModel.findOne({
      $or: [{ name: createCompanyInput.name }, { slug }],
    });

    if (existingCompany) {
      throw new ConflictException('Company with this name already exists');
    }

    const company = new this.companyModel({
      ...createCompanyInput,
      slug,
    });

    return company.save();
  }

  async findAll(): Promise<Company[]> {
    return this.companyModel.find({ isActive: true }).exec();
  }

  async findById(id: string): Promise<Company> {
    const company = await this.companyModel.findById(id).exec();
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    return company;
  }

  async findBySlug(slug: string): Promise<Company> {
    const company = await this.companyModel.findOne({ slug, isActive: true }).exec();
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    return company;
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}