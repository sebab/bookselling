'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { Plus, Search, Filter, BookOpen, TrendingUp, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { BookGrid } from '@/components/books/book-grid';
import { useAuth } from '@/contexts/auth-context';
import { GET_BOOKS_QUERY } from '@/lib/graphql/queries';
import { isAuthenticated } from '@/lib/auth';

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated()) {
      router.push('/auth/login');
    }
  }, [authLoading, router]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, loading, error, refetch } = useQuery(GET_BOOKS_QUERY, {
    variables: { search: debouncedSearch || undefined },
    skip: !user,
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const books = data?.books || [];
  const totalBooks = books.length;
  const recentBooks = books.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 lg:pl-72">
          <div className="container py-8">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome back, {user.firstName}!
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage your book catalog and discover insights about your collection.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Books</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalBooks}</div>
                  <p className="text-xs text-muted-foreground">
                    Books in your catalog
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">This Month</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {books.filter(book => {
                      const bookDate = new Date(book.createdAt);
                      const now = new Date();
                      return bookDate.getMonth() === now.getMonth() && 
                             bookDate.getFullYear() === now.getFullYear();
                    }).length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Books added this month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Estimated Value</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${books.reduce((sum, book) => sum + (book.estimatedPrice || 0), 0).toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total estimated value
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Languages</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {new Set(books.map(book => book.language).filter(Boolean)).size}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Different languages
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button asChild size="lg" className="flex-1 sm:flex-none">
                <a href="/upload">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Books
                </a>
              </Button>
              
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search your library..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Recent Books or Search Results */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">
                    {searchQuery ? 'Search Results' : 'Your Library'}
                  </h2>
                  <p className="text-muted-foreground">
                    {searchQuery 
                      ? `Found ${books.length} book${books.length !== 1 ? 's' : ''} matching "${searchQuery}"`
                      : `${totalBooks} book${totalBooks !== 1 ? 's' : ''} in your collection`
                    }
                  </p>
                </div>
                
                {!searchQuery && totalBooks > 0 && (
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                )}
              </div>

              {loading ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {[...Array(8)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader>
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </CardHeader>
                      <CardContent>
                        <div className="aspect-[3/4] bg-muted rounded mb-4"></div>
                        <div className="space-y-2">
                          <div className="h-3 bg-muted rounded"></div>
                          <div className="h-3 bg-muted rounded w-2/3"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : error ? (
                <Card className="p-8 text-center">
                  <CardContent>
                    <p className="text-muted-foreground">
                      Failed to load books. Please try again.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => refetch()}
                      className="mt-4"
                    >
                      Retry
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <BookGrid 
                  books={books}
                  onView={(book) => router.push(`/books/${book._id}`)}
                />
              )}
            </div>

            {/* Empty State */}
            {!loading && !error && totalBooks === 0 && !searchQuery && (
              <Card className="p-12 text-center">
                <CardContent>
                  <div className="mx-auto h-24 w-24 text-muted-foreground/50 mb-4">
                    <BookOpen className="h-full w-full" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Start building your library</h3>
                  <p className="text-muted-foreground mb-6">
                    Upload book images and let our AI extract all the details automatically.
                  </p>
                  <Button asChild size="lg">
                    <a href="/upload">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Your First Book
                    </a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}