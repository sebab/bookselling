'use client';

import { useState } from 'react';
import { Calendar, DollarSign, Globe, Tag, User, BookOpen, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';

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

interface BookCardProps {
  book: Book;
  onView?: (book: Book) => void;
  onEdit?: (book: Book) => void;
  onDelete?: (book: Book) => void;
}

export function BookCard({ book, onView, onEdit, onDelete }: BookCardProps) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const formatPrice = (price?: number) => {
    if (!price) return null;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getConditionColor = (condition?: string) => {
    switch (condition?.toLowerCase()) {
      case 'new':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'like-new':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'very-good':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'good':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'acceptable':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'poor':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {book.title}
            </h3>
            <div className="flex items-center mt-1 text-sm text-muted-foreground">
              <User className="h-3 w-3 mr-1" />
              <span className="truncate">{book.author}</span>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onView && (
                <DropdownMenuItem onClick={() => onView(book)}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(book)}>
                  Edit
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem 
                  onClick={() => onDelete(book)}
                  className="text-red-600 focus:text-red-600"
                >
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        {/* Book Cover */}
        <div className="relative mb-4 aspect-[3/4] overflow-hidden rounded-lg bg-muted">
          {book.coverImage && !imageError ? (
            <img
              src={`http://localhost:4000/uploads/${book.coverImage}`}
              alt={book.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
              onError={handleImageError}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2 text-xs text-muted-foreground">No Cover</p>
              </div>
            </div>
          )}
        </div>

        {/* Book Details */}
        <div className="space-y-2">
          {book.isbn && (
            <div className="flex items-center text-xs text-muted-foreground">
              <span className="font-medium">ISBN:</span>
              <span className="ml-1 font-mono">{book.isbn}</span>
            </div>
          )}

          {book.publisher && (
            <div className="flex items-center text-xs text-muted-foreground">
              <span className="font-medium">Publisher:</span>
              <span className="ml-1 truncate">{book.publisher}</span>
            </div>
          )}

          {book.publishedYear && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{book.publishedYear}</span>
            </div>
          )}

          {book.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {book.description}
            </p>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-3">
          {book.genre && (
            <Badge variant="secondary" className="text-xs">
              <Tag className="h-2 w-2 mr-1" />
              {book.genre}
            </Badge>
          )}
          
          {book.language && (
            <Badge variant="outline" className="text-xs">
              <Globe className="h-2 w-2 mr-1" />
              {book.language.toUpperCase()}
            </Badge>
          )}
          
          {book.condition && (
            <Badge 
              variant="outline" 
              className={`text-xs border ${getConditionColor(book.condition)}`}
            >
              {book.condition.charAt(0).toUpperCase() + book.condition.slice(1).replace('-', ' ')}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{format(new Date(book.createdAt), 'MMM d, yyyy')}</span>
          </div>
          
          {book.estimatedPrice && (
            <div className="flex items-center text-sm font-medium text-green-600">
              <DollarSign className="h-3 w-3 mr-1" />
              <span>{formatPrice(book.estimatedPrice)}</span>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}