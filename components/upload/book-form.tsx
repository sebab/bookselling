'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, BookOpen, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const bookFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  isbn: z.string().optional(),
  publisher: z.string().optional(),
  publishedYear: z.number().optional(),
  language: z.string().optional(),
  genre: z.string().optional(),
  description: z.string().optional(),
  condition: z.string().optional(),
  estimatedPrice: z.number().optional(),
});

type BookFormData = z.infer<typeof bookFormSchema>;

interface BookFormProps {
  initialData?: Partial<BookFormData>;
  onSubmit: (data: BookFormData) => Promise<void>;
  isLoading?: boolean;
  isProcessing?: boolean;
}

const conditions = [
  { value: 'new', label: 'New' },
  { value: 'like-new', label: 'Like New' },
  { value: 'very-good', label: 'Very Good' },
  { value: 'good', label: 'Good' },
  { value: 'acceptable', label: 'Acceptable' },
  { value: 'poor', label: 'Poor' },
];

const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ru', label: 'Russian' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
];

export function BookForm({ initialData, onSubmit, isLoading, isProcessing }: BookFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BookFormData>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      author: initialData?.author || '',
      isbn: initialData?.isbn || '',
      publisher: initialData?.publisher || '',
      publishedYear: initialData?.publishedYear,
      language: initialData?.language || '',
      genre: initialData?.genre || '',
      description: initialData?.description || '',
      condition: initialData?.condition || '',
      estimatedPrice: initialData?.estimatedPrice,
    },
  });

  const handleSubmit = async (data: BookFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormDisabled = isLoading || isProcessing || isSubmitting;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <BookOpen className="h-5 w-5" />
          <CardTitle>Book Information</CardTitle>
        </div>
        <CardDescription>
          {isProcessing 
            ? "Processing images and extracting book information..." 
            : "Review and edit the book details before saving"
          }
        </CardDescription>
        
        {isProcessing && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Analyzing images with OCR...</span>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter book title" 
                        disabled={isFormDisabled}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter author name" 
                        disabled={isFormDisabled}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* ISBN and Publisher */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="isbn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ISBN</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="978-0-123456-78-9" 
                        disabled={isFormDisabled}
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      International Standard Book Number
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="publisher"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Publisher</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter publisher name" 
                        disabled={isFormDisabled}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Year and Language */}
            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="publishedYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Published Year</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="2024" 
                        disabled={isFormDisabled}
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={isFormDisabled}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condition</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={isFormDisabled}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {conditions.map((condition) => (
                          <SelectItem key={condition.value} value={condition.value}>
                            {condition.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Genre and Price */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="genre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Genre</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Fiction, Non-fiction, Science, etc." 
                        disabled={isFormDisabled}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="estimatedPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Price</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="0.00" 
                        disabled={isFormDisabled}
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormDescription>
                      Automatically estimated from web sources
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter book description or summary..." 
                      className="min-h-[100px]"
                      disabled={isFormDisabled}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button 
                type="submit" 
                disabled={isFormDisabled}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Book
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}