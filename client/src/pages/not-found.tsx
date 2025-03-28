import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryToolbar from "@/components/CategoryToolbar";

export default function NotFound() {
  return (
    <>
      <Header />
      <CategoryToolbar />
      <div className="min-h-[70vh] w-full flex items-center justify-center bg-gray-50 py-16">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="flex mb-4 gap-2">
              <AlertCircle className="h-8 w-8 text-[#B80000]" />
              <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
            </div>

            <p className="mt-4 text-sm text-gray-600 mb-4">
              The page you're looking for doesn't exist or has been moved.
            </p>
            
            <Link href="/" className="inline-block mt-2 px-4 py-2 bg-[#B80000] text-white rounded hover:bg-[#8B0000] transition-colors duration-300 text-sm font-medium">
              Return to Homepage
            </Link>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
}
