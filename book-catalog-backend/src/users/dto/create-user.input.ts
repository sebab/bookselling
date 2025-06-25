import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsEmail, IsNotEmpty, MinLength, IsEnum, IsMongoId } from 'class-validator';
import { UserRole } from '../schemas/user.schema';

@InputType()
export class CreateUserInput {
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

  @Field(() => UserRole, { defaultValue: UserRole.USER })
  @IsEnum(UserRole)
  role: UserRole;

  @Field(() => ID)
  @IsMongoId()
  companyId: string;
}