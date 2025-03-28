import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Article, Category } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

const Sidebar = () => {
  const [location, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: latestArticles, isLoading: isLoadingLatest } = useQuery<Article[]>({
    queryKey: ["/api/articles/latest"],
  });
  
  const { data: mostReadArticles, isLoading: isLoadingMostRead } = useQuery<Article[]>({
    queryKey: ["/api/articles/most-read"],
  });
  
  const { data: categories, isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  
  return (
    <div className="lg:col-span-1">
      {/* Search Box */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h3 className="text-lg font-bold mb-3 text-[#222222]">Search News</h3>
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

      {/* Latest News */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h3 className="text-lg font-bold mb-4 text-[#222222]">Latest Updates</h3>
        <div className="space-y-4">
          {isLoadingLatest ? (
            [...Array(5)].map((_, index) => (
              <div key={index} className="flex items-start space-x-3 pb-3 border-b border-gray-200">
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-5 w-full" />
              </div>
            ))
          ) : latestArticles && latestArticles.length > 0 ? (
            <>
              {latestArticles.map((article, index) => (
                <div key={article.id} className={`flex items-start space-x-3 ${index < latestArticles.length - 1 ? 'pb-3 border-b border-gray-200' : ''}`}>
                  <span className="text-[#B80000] font-bold text-sm mt-1">
                    {new Date(article.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <Link href={`/article/${article.slug}`} className="text-sm hover:text-[#B80000]">
                    {article.title}
                  </Link>
                </div>
              ))}
            </>
          ) : (
            <p className="text-sm text-gray-500">No latest updates available</p>
          )}
        </div>
        <Link href="/category/latest" className="text-[#B80000] hover:underline text-sm font-medium block mt-3 text-right">
          View All Updates
        </Link>
      </div>

      {/* Most Read */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h3 className="text-lg font-bold mb-4 text-[#222222]">Most Read</h3>
        <div className="space-y-4">
          {isLoadingMostRead ? (
            [...Array(5)].map((_, index) => (
              <div key={index} className="flex items-start">
                <Skeleton className="h-8 w-8 mr-3" />
                <Skeleton className="h-5 w-full" />
              </div>
            ))
          ) : mostReadArticles && mostReadArticles.length > 0 ? (
            <>
              {mostReadArticles.map((article, index) => (
                <div key={article.id} className="flex items-start">
                  <span className="text-2xl font-bold text-gray-400 mr-3">{index + 1}</span>
                  <Link href={`/article/${article.slug}`} className="text-sm font-medium hover:text-[#B80000]">
                    {article.title}
                  </Link>
                </div>
              ))}
            </>
          ) : (
            <p className="text-sm text-gray-500">No trending articles available</p>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h3 className="text-lg font-bold mb-4 text-[#222222]">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {isLoadingCategories ? (
            [...Array(10)].map((_, index) => (
              <Skeleton key={index} className="h-8 w-16 rounded-full" />
            ))
          ) : categories && categories.length > 0 ? (
            <>
              {categories.map((category) => (
                <Link 
                  key={category.id} 
                  href={`/category/${category.slug}`} 
                  className="px-3 py-1 bg-gray-200 rounded-full text-sm text-gray-800 hover:bg-[#B80000] hover:text-white transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </>
          ) : (
            <p className="text-sm text-gray-500">No categories available</p>
          )}
        </div>
      </div>

      {/* Ad Space */}
      <div className="bg-gray-200 p-4 rounded-lg text-center mb-6">
        <p className="text-sm text-gray-700 mb-2">Advertisement</p>
        <div className="bg-white h-64 flex items-center justify-center">
          <p className="text-gray-400">Ad Content</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
