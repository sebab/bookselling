import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';

export type CompanyDocument = Company & Document;

@ObjectType()
@Schema({ timestamps: true })
export class Company {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true, unique: true })
  name: string;

  @Field()
  @Prop({ required: true })
  slug: string;

  @Field({ nullable: true })
  @Prop()
  description?: string;

  @Field({ nullable: true })
  @Prop()
  logo?: string;

  @Field()
  @Prop({ default: true })
  isActive: boolean;

  @Field()
  @Prop({ default: Date.now })
  createdAt: Date;

  @Field()
  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const CompanySchema = SchemaFactory.createForClass(Company);

// Create indexes
CompanySchema.index({ name: 1 });
CompanySchema.index({ slug: 1 });