import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';

export type UserDocument = User & Document;

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
}

registerEnumType(UserRole, {
  name: 'UserRole',
});

@ObjectType()
@Schema({ timestamps: true })
export class User {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true })
  firstName: string;

  @Field()
  @Prop({ required: true })
  lastName: string;

  @Field()
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Field(() => UserRole)
  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Field(() => ID)
  @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
  companyId: string;

  @Field()
  @Prop({ default: true })
  isActive: boolean;

  @Field({ nullable: true })
  @Prop()
  lastLoginAt?: Date;

  @Field()
  @Prop({ default: Date.now })
  createdAt: Date;

  @Field()
  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Create indexes
UserSchema.index({ email: 1 });
UserSchema.index({ companyId: 1 });
UserSchema.index({ role: 1 });