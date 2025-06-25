import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ApolloWrapper } from '@/components/apollo-wrapper';
import { AuthProvider } from '@/contexts/auth-context';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BookCatalog - Smart Book Management System',
  description: 'AI-powered book cataloging system with OCR and multi-language support',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ApolloWrapper>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ApolloWrapper>
      </body>
    </html>
  );
}