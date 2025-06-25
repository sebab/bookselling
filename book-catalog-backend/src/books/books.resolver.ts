import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from './schemas/book.schema';
import { CreateBookInput } from './dto/create-book.input';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';
import { CompanyAccessGuard } from '../common/guards/company-access.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/schemas/user.schema';

@Resolver(() => Book)
export class BooksResolver {
  constructor(private readonly booksService: BooksService) {}

  @Mutation(() => Book)
  @UseGuards(GqlAuthGuard, CompanyAccessGuard)
  createBook(
    @Args('createBookInput') createBookInput: CreateBookInput,
    @CurrentUser() user: User,
  ) {
    return this.booksService.create(createBookInput, user._id);
  }

  @Query(() => [Book], { name: 'books' })
  @UseGuards(GqlAuthGuard)
  findAll(
    @CurrentUser() user: User,
    @Args('search', { nullable: true }) search?: string,
  ) {
    return this.booksService.findAll(user.companyId, search);
  }

  @Query(() => Book, { name: 'book' })
  @UseGuards(GqlAuthGuard)
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.booksService.findById(id);
  }
}