import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import BreakingNewsBanner from "@/components/BreakingNewsBanner";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import SkeletonLoading from "@/components/SkeletonLoading";
import { Article } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const SearchPage = () => {
  const [location, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Parse search query from URL
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1]);
    const q = params.get('q');
    if (q) {
      setSearchQuery(q);
    }
  }, [location]);
  
  // Search articles
  const { data: articles, isLoading, isError } = useQuery<Article[]>({
    queryKey: ['/api/articles/search', { q: searchQuery }],
    enabled: searchQuery.length > 0,
  });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  
  return (
    <>
      <Header />
      <BreakingNewsBanner />
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-6 text-[#222222]">Search Results</h1>
            
            {/* Search box */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <form className="relative" onSubmit={handleSearch}>
                <Input
                  type="text"
                  placeholder="Search for articles..."
                  className="w-full p-2 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#B80000] focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button
                  type="submit"
                  variant="ghost"
                  className="absolute right-3 top-2.5 text-gray-600 hover:text-[#B80000] p-0"
                  size="icon"
                >
                  <Search size={18} />
                </Button>
              </form>
            </div>
            
            {/* Search results */}
            {searchQuery && (
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">
                  {isLoading ? 
                    "Searching..." : 
                    `Results for "${searchQuery}" (${articles?.length || 0} ${articles?.length === 1 ? 'article' : 'articles'})`
                  }
                </h2>
              </div>
            )}
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, index) => (
                  <SkeletonLoading key={index} />
                ))}
              </div>
            ) : articles && articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : searchQuery ? (
              <div className="bg-gray-100 p-8 rounded-lg text-center">
                <p className="text-gray-600">No articles found matching "{searchQuery}".</p>
                <p className="text-gray-500 mt-2">Try different keywords or browse our categories.</p>
              </div>
            ) : (
              <div className="bg-gray-100 p-8 rounded-lg text-center">
                <p className="text-gray-600">Enter a search term to find articles.</p>
              </div>
            )}
            
            {/* Pagination (only show if we have results) */}
            {articles && articles.length > 0 && (
              <div className="flex justify-center my-8">
                <nav className="inline-flex rounded-md shadow">
                  <button className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-200">
                    Previous
                  </button>
                  <button className="px-3 py-2 border-t border-b border-gray-300 bg-[#B80000] text-sm font-medium text-white">
                    1
                  </button>
                  <button className="px-3 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-200">
                    2
                  </button>
                  <button className="px-3 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-200">
                    3
                  </button>
                  <button className="px-3 py-2 border border-l-0 rounded-r-md border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-200">
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
          
          <Sidebar />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default SearchPage;
