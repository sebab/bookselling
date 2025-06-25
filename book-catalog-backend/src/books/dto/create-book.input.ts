import { InputType, Field, ID, Float } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, IsMongoId } from 'class-validator';

@InputType()
export class CreateBookInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  author: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  isbn?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  publisher?: string;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  publishedYear?: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  language?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  genre?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  images?: string[];

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  coverImage?: string;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  estimatedPrice?: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  condition?: string;

  @Field(() => ID)
  @IsMongoId()
  companyId: string;
}