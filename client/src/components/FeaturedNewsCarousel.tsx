import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Article } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

const FeaturedNewsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const { data: featuredArticles, isLoading, isError } = useQuery<Article[]>({
    queryKey: ["/api/articles/featured"],
  });
  
  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    if (!featuredArticles || featuredArticles.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredArticles.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [featuredArticles]);
  
  const handlePrevious = () => {
    if (!featuredArticles) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + featuredArticles.length) % featuredArticles.length);
  };
  
  const handleNext = () => {
    if (!featuredArticles) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredArticles.length);
  };
  
  if (isLoading) {
    return (
      <section className="mb-10">
        <h2 className="sr-only">Featured News</h2>
        <div className="relative rounded-lg overflow-hidden">
          <Skeleton className="h-96 md:h-[500px] w-full" />
        </div>
      </section>
    );
  }
  
  if (isError || !featuredArticles || featuredArticles.length === 0) {
    return null;
  }
  
  const currentArticle = featuredArticles[currentIndex];
  
  return (
    <section className="mb-10">
      <h2 className="sr-only">Featured News</h2>
      <div className="relative rounded-lg overflow-hidden">
        <div className="relative h-96 md:h-[500px] w-full bg-[#222222]">
          <img 
            src={currentArticle.imageUrl} 
            alt={currentArticle.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
            <Link href={`/category/${featuredArticles[currentIndex].categoryId}`}>
              <a className="inline-block bg-[#B80000] px-2 py-1 text-xs font-semibold rounded mb-2">
                {/* Get category name from API (would require an additional query) */}
                {/* For now, hardcoding based on categoryId */}
                {featuredArticles[currentIndex].categoryId === 1 ? "World" :
                 featuredArticles[currentIndex].categoryId === 2 ? "Politics" :
                 featuredArticles[currentIndex].categoryId === 3 ? "Business" :
                 featuredArticles[currentIndex].categoryId === 4 ? "Technology" :
                 featuredArticles[currentIndex].categoryId === 5 ? "Sports" : "News"}
              </a>
            </Link>
            <Link href={`/article/${currentArticle.slug}`}>
              <a>
                <h1 className="text-2xl md:text-4xl font-bold mb-2 leading-tight">
                  {currentArticle.title}
                </h1>
              </a>
            </Link>
            <p className="mb-2 text-sm md:text-base">{currentArticle.summary}</p>
            <div className="flex items-center text-sm">
              <span>{formatDistanceToNow(new Date(currentArticle.publishedAt), { addSuffix: true })}</span>
              <span className="mx-2">•</span>
              <span>By Author {currentArticle.authorId}</span>
            </div>
          </div>
        </div>
        
        {/* Navigation buttons */}
        <Button
          variant="ghost"
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-2 backdrop-blur-sm"
          onClick={handlePrevious}
          size="icon"
        >
          <ChevronLeft className="text-white text-2xl" />
        </Button>
        <Button
          variant="ghost"
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-2 backdrop-blur-sm"
          onClick={handleNext}
          size="icon"
        >
          <ChevronRight className="text-white text-2xl" />
        </Button>
        
        {/* Pagination dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {featuredArticles.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full ${index === currentIndex ? "bg-white" : "bg-white/50"}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedNewsCarousel;
