import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  password: string;
}