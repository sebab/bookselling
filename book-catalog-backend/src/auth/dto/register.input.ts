import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

@InputType()
export class RegisterInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @MinLength(6)
  password: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  companyDescription?: string;
}