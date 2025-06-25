'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  className?: string;
}

export function ImageUpload({ onFilesChange, maxFiles = 5, className }: ImageUploadProps) {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles);
    setFiles(newFiles);
    onFilesChange(newFiles);
  }, [files, maxFiles, onFilesChange]);

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesChange(newFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: maxFiles - files.length,
    disabled: files.length >= maxFiles
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      <Card className={cn(
        "border-2 border-dashed transition-colors",
        isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
        files.length >= maxFiles && "opacity-50 cursor-not-allowed"
      )}>
        <CardContent className="p-8">
          <div
            {...getRootProps()}
            className={cn(
              "flex flex-col items-center justify-center text-center cursor-pointer",
              files.length >= maxFiles && "cursor-not-allowed"
            )}
          >
            <input {...getInputProps()} />
            
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            
            <div className="mt-4 space-y-2">
              <h3 className="text-lg font-semibold">
                {files.length >= maxFiles 
                  ? `Maximum ${maxFiles} files reached`
                  : isDragActive 
                    ? "Drop your book images here"
                    : "Upload book images"
                }
              </h3>
              
              {files.length < maxFiles && (
                <p className="text-sm text-muted-foreground">
                  Drag and drop your book images, or{" "}
                  <span className="font-medium text-primary">browse</span>
                </p>
              )}
              
              <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
                <Badge variant="secondary">Cover</Badge>
                <Badge variant="secondary">Back Cover</Badge>
                <Badge variant="secondary">First Pages</Badge>
                <Badge variant="secondary">ISBN Page</Badge>
              </div>
              
              <p className="text-xs text-muted-foreground">
                PNG, JPG, WEBP up to 10MB each • Max {maxFiles} files
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium">
            Uploaded Files ({files.length}/{maxFiles})
          </h4>
          
          <div className="grid gap-3 sm:grid-cols-2">
            {files.map((file, index) => (
              <Card key={index} className="relative">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <ImageIcon className="h-5 w-5 text-primary" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                      
                      {/* File preview */}
                      <div className="mt-2">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="h-16 w-16 rounded object-cover"
                          onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
                        />
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Upload Tips */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Tips for better results</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Include the front cover for title and author recognition</li>
                <li>• Add the back cover or spine for ISBN and publisher info</li>
                <li>• Include copyright/title pages for complete metadata</li>
                <li>• Ensure images are clear and well-lit</li>
                <li>• Multiple angles help improve text recognition accuracy</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}