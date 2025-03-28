import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import Header from "@/components/Header";
import BreakingNewsBanner from "@/components/BreakingNewsBanner";
import ArticleCard from "@/components/ArticleCard";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import SkeletonLoading from "@/components/SkeletonLoading";
import CategoryToolbar from "@/components/CategoryToolbar";
import { Category, Article } from "@shared/schema";

const CategoryPage = () => {
  const [match, params] = useRoute<{ slug: string }>("/category/:slug");
  
  // Get category details
  const { data: categories, isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  const category = categories?.find(c => c.slug === params?.slug);
  
  // Get articles for the category
  const { data: articles, isLoading: isLoadingArticles, refetch } = useQuery<Article[]>({
    queryKey: [category ? `/api/articles/category/${category.id}` : null, { limit: 10 }],
    enabled: !!category,
  });
  
  // Refetch articles when category changes
  useEffect(() => {
    if (category) {
      refetch();
    }
  }, [category, refetch]);
  
  if (!match) {
    return <div>Category not found</div>;
  }
  
  return (
    <>
      <Header />
      <CategoryToolbar />
      <BreakingNewsBanner />
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-6 text-[#222222]">
              {isLoadingCategories ? (
                <span className="inline-block">
                  <SkeletonLoading />
                </span>
              ) : category ? (
                category.name
              ) : (
                "Category Not Found"
              )}
            </h1>
            
            {isLoadingArticles ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, index) => (
                  <SkeletonLoading key={index} />
                ))}
              </div>
            ) : articles && articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} showCategory={false} />
                ))}
              </div>
            ) : (
              <div className="bg-gray-100 p-8 rounded-lg text-center">
                <p className="text-gray-600">No articles found in this category.</p>
              </div>
            )}
            
            {/* Pagination */}
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

export default CategoryPage;
