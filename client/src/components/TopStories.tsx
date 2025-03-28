import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Article } from "@shared/schema";
import ArticleCard from "./ArticleCard";
import SkeletonLoading from "./SkeletonLoading";

const TopStories = () => {
  const { data: articles, isLoading, isError } = useQuery<Article[]>({
    queryKey: ["/api/articles", { limit: 6 }],
  });
  
  if (isLoading) {
    return (
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#222222]">Top Stories</h2>
          <Link href="/category/all">
            <a className="text-[#B80000] hover:underline text-sm font-medium">View All</a>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <SkeletonLoading key={index} />
          ))}
        </div>
      </section>
    );
  }
  
  if (isError || !articles || articles.length === 0) {
    return (
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#222222]">Top Stories</h2>
        </div>
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-center">
          <p className="text-red-800">Unable to load top stories. Please try again later.</p>
        </div>
      </section>
    );
  }
  
  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#222222]">Top Stories</h2>
        <Link href="/category/all">
          <a className="text-[#B80000] hover:underline text-sm font-medium">View All</a>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
};

export default TopStories;
