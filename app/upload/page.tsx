'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client';
import { ArrowLeft, Upload as UploadIcon, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { ImageUpload } from '@/components/upload/image-upload';
import { BookForm } from '@/components/upload/book-form';
import { useAuth } from '@/contexts/auth-context';
import { CREATE_BOOK_MUTATION } from '@/lib/graphql/queries';
import { isAuthenticated } from '@/lib/auth';
import { toast } from 'sonner';

export default function UploadPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated()) {
      router.push('/auth/login');
    }
  }, [authLoading, router]);

  const [createBook] = useMutation(CREATE_BOOK_MUTATION);

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles);
    setExtractedData(null);
  };

  const processImages = async () => {
    if (files.length === 0) {
      toast.error('Please select at least one image');
      return;
    }

    setIsProcessing(true);
    setUploadProgress(0);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`images`, file);
      });
      formData.append('companyId', user?.companyId || '');

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      // Upload and process images
      const response = await fetch('http://localhost:4000/books/process-images', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        throw new Error('Failed to process images');
      }

      const result = await response.json();
      
      // Set extracted data for the form
      setExtractedData({
        title: result.title || '',
        author: result.author || '',
        isbn: result.isbn || '',
        publisher: result.publisher || '',
        publishedYear: result.publishedYear,
        language: result.language || '',
        genre: result.genre || '',
        description: result.description || '',
        condition: result.condition || '',
        estimatedPrice: result.estimatedPrice,
      });

      toast.success('Images processed successfully!');
    } catch (error: any) {
      console.error('Processing error:', error);
      toast.error('Failed to process images. Please try again.');
      
      // Set default data so user can still fill the form manually
      setExtractedData({
        title: '',
        author: '',
        isbn: '',
        publisher: '',
        publishedYear: undefined,
        language: '',
        genre: '',
        description: '',
        condition: '',
        estimatedPrice: undefined,
      });
    } finally {
      setIsProcessing(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleBookSubmit = async (bookData: any) => {
    try {
      const { data } = await createBook({
        variables: {
          createBookInput: {
            ...bookData,
            companyId: user?.companyId,
          },
        },
      });

      if (data?.createBook) {
        toast.success('Book added to your catalog!');
        router.push('/dashboard');
      }
    } catch (error: any) {
      console.error('Create book error:', error);
      toast.error('Failed to save book. Please try again.');
    }
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 lg:pl-72">
          <div className="container py-8 max-w-4xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Add New Books</h1>
                <p className="text-muted-foreground">
                  Upload book images and let AI extract the details automatically
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            {uploadProgress > 0 && (
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Processing images...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-8">
              {/* Step 1: Image Upload */}
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                      1
                    </div>
                    <div>
                      <CardTitle>Upload Book Images</CardTitle>
                      <CardDescription>
                        Add photos of your book covers, back covers, and key pages
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ImageUpload onFilesChange={handleFilesChange} />
                  
                  {files.length > 0 && !extractedData && (
                    <div className="mt-6 flex justify-center">
                      <Button 
                        onClick={processImages}
                        disabled={isProcessing}
                        size="lg"
                        className="min-w-[200px]"
                      >
                        {isProcessing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Extract Book Info
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Step 2: Book Information Form */}
              {extractedData && (
                <div>
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                      2
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">Review Book Details</h2>
                      <p className="text-muted-foreground">
                        Verify and edit the extracted information
                      </p>
                    </div>
                  </div>
                  
                  <BookForm
                    initialData={extractedData}
                    onSubmit={handleBookSubmit}
                    isProcessing={isProcessing}
                  />
                </div>
              )}

              {/* Help Section */}
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-900">Tips for Best Results</CardTitle>
                </CardHeader>
                <CardContent className="text-blue-800">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="font-medium mr-2">📸</span>
                      Take clear, well-lit photos with good contrast
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium mr-2">📖</span>
                      Include front cover, back cover, and copyright page
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium mr-2">🔍</span>
                      Ensure text is readable and not blurry
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium mr-2">🌍</span>
                      Our AI supports multiple languages automatically
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium mr-2">💰</span>
                      Price estimation is fetched from online sources
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}