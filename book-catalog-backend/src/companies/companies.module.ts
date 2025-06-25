import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompaniesService } from './companies.service';
import { CompaniesResolver } from './companies.resolver';
import { Company, CompanySchema } from './schemas/company.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Company.name, schema: CompanySchema },
    ]),
  ],
  providers: [CompaniesService, CompaniesResolver],
  exports: [CompaniesService],
})
export class CompaniesModule {}