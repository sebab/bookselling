import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      access_token
      user {
        _id
        firstName
        lastName
        email
        role
        companyId
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($registerInput: RegisterInput!) {
    register(registerInput: $registerInput) {
      access_token
      user {
        _id
        firstName
        lastName
        email
        role
        companyId
      }
    }
  }
`;

export const GET_BOOKS_QUERY = gql`
  query GetBooks($search: String) {
    books(search: $search) {
      _id
      title
      author
      isbn
      publisher
      publishedYear
      language
      genre
      description
      images
      coverImage
      estimatedPrice
      condition
      createdAt
    }
  }
`;

export const GET_BOOK_QUERY = gql`
  query GetBook($id: ID!) {
    book(id: $id) {
      _id
      title
      author
      isbn
      publisher
      publishedYear
      language
      genre
      description
      images
      coverImage
      estimatedPrice
      condition
      createdAt
    }
  }
`;

export const CREATE_BOOK_MUTATION = gql`
  mutation CreateBook($createBookInput: CreateBookInput!) {
    createBook(createBookInput: $createBookInput) {
      _id
      title
      author
      isbn
      publisher
      publishedYear
      language
      genre
      description
      images
      coverImage
      estimatedPrice
      condition
      createdAt
    }
  }
`;

export const GET_CURRENT_USER_QUERY = gql`
  query GetCurrentUser {
    me {
      _id
      firstName
      lastName
      email
      role
      companyId
    }
  }
`;