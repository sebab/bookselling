'use client';

import { BookCard } from './book-card';

interface Book {
  _id: string;
  title: string;
  author: string;
  isbn?: string;
  publisher?: string;
  publishedYear?: number;
  language?: string;
  genre?: string;
  description?: string;
  images: string[];
  coverImage?: string;
  estimatedPrice?: number;
  condition?: string;
  createdAt: string;
}

interface BookGridProps {
  books: Book[];
  onView?: (book: Book) => void;
  onEdit?: (book: Book) => void;
  onDelete?: (book: Book) => void;
}

export function BookGrid({ books, onView, onEdit, onDelete }: BookGridProps) {
  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-24 w-24 text-muted-foreground/50">
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            className="h-full w-full"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-semibold">No books found</h3>
        <p className="mt-2 text-muted-foreground">
          Start by uploading some book images to build your catalog.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {books.map((book) => (
        <BookCard
          key={book._id}
          book={book}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}