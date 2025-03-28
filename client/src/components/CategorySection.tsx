import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Article } from "@shared/schema";
import ArticleCard from "./ArticleCard";
import SkeletonLoading from "./SkeletonLoading";

interface CategorySectionProps {
  categoryId: number;
  categoryName: string;
  limit?: number;
}

const CategorySection = ({ categoryId, categoryName, limit = 2 }: CategorySectionProps) => {
  const { data: articles, isLoading, isError } = useQuery<Article[]>({
    queryKey: [`/api/articles/category/${categoryId}`, { limit }],
  });
  
  if (isLoading) {
    return (
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[#222222] mb-6">{categoryName}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(limit)].map((_, index) => (
            <SkeletonLoading key={index} />
          ))}
        </div>
      </section>
    );
  }
  
  if (isError || !articles || articles.length === 0) {
    return (
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[#222222] mb-6">{categoryName}</h2>
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-center">
          <p className="text-red-800">Unable to load {categoryName.toLowerCase()} articles. Please try again later.</p>
        </div>
      </section>
    );
  }
  
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-[#222222] mb-6">{categoryName}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((article) => (
          <ArticleCard 
            key={article.id} 
            article={article} 
            showCategory={false}
            showBookmarkShare={false}
          />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
