import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

export type BookDocument = Book & Document;

@ObjectType()
@Schema({ timestamps: true })
export class Book {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true })
  title: string;

  @Field()
  @Prop({ required: true })
  author: string;

  @Field({ nullable: true })
  @Prop()
  isbn?: string;

  @Field({ nullable: true })
  @Prop()
  publisher?: string;

  @Field({ nullable: true })
  @Prop()
  publishedYear?: number;

  @Field({ nullable: true })
  @Prop()
  language?: string;

  @Field({ nullable: true })
  @Prop()
  genre?: string;

  @Field({ nullable: true })
  @Prop()
  description?: string;

  @Field(() => [String])
  @Prop({ type: [String], default: [] })
  images: string[];

  @Field({ nullable: true })
  @Prop()
  coverImage?: string;

  @Field(() => Float, { nullable: true })
  @Prop()
  estimatedPrice?: number;

  @Field({ nullable: true })
  @Prop()
  condition?: string;

  @Field(() => ID)
  @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
  companyId: string;

  @Field(() => ID)
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: string;

  @Field()
  @Prop({ default: Date.now })
  createdAt: Date;

  @Field()
  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const BookSchema = SchemaFactory.createForClass(Book);

// Create indexes
BookSchema.index({ title: 'text', author: 'text', isbn: 'text' });
BookSchema.index({ companyId: 1 });
BookSchema.index({ createdBy: 1 });
BookSchema.index({ isbn: 1 });