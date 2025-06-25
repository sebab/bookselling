import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

@InputType()
export class CreateCompanyInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  logo?: string;
}