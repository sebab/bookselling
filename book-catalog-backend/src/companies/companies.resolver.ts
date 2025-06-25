import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { Company } from './schemas/company.schema';
import { CreateCompanyInput } from './dto/create-company.input';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';

@Resolver(() => Company)
export class CompaniesResolver {
  constructor(private readonly companiesService: CompaniesService) {}

  @Mutation(() => Company)
  @UseGuards(GqlAuthGuard)
  createCompany(@Args('createCompanyInput') createCompanyInput: CreateCompanyInput) {
    return this.companiesService.create(createCompanyInput);
  }

  @Query(() => [Company], { name: 'companies' })
  @UseGuards(GqlAuthGuard)
  findAll() {
    return this.companiesService.findAll();
  }

  @Query(() => Company, { name: 'company' })
  @UseGuards(GqlAuthGuard)
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.companiesService.findById(id);
  }

  @Query(() => Company, { name: 'companyBySlug' })
  @UseGuards(GqlAuthGuard)
  findBySlug(@Args('slug') slug: string) {
    return this.companiesService.findBySlug(slug);
  }
}