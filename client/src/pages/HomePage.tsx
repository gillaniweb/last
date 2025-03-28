import Header from "@/components/Header";
import BreakingNewsBanner from "@/components/BreakingNewsBanner";
import FeaturedNewsCarousel from "@/components/FeaturedNewsCarousel";
import TopStories from "@/components/TopStories";
import CategorySection from "@/components/CategorySection";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";

const HomePage = () => {
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  // Get Politics, Business, and Technology categories
  const politicsCategory = categories?.find(c => c.name === "Politics");
  const businessCategory = categories?.find(c => c.name === "Business");
  const techCategory = categories?.find(c => c.name === "Technology");
  
  return (
    <>
      <Header />
      <BreakingNewsBanner />
      <main className="container mx-auto px-4 py-6">
        <FeaturedNewsCarousel />
        <TopStories />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {politicsCategory && (
              <CategorySection 
                categoryId={politicsCategory.id} 
                categoryName={politicsCategory.name} 
              />
            )}
            
            {businessCategory && (
              <CategorySection 
                categoryId={businessCategory.id} 
                categoryName={businessCategory.name} 
              />
            )}
            
            {techCategory && (
              <CategorySection 
                categoryId={techCategory.id} 
                categoryName={techCategory.name} 
              />
            )}
            
            {/* Pagination */}
            <div className="flex justify-center my-8">
              <nav className="inline-flex rounded-md shadow">
                <button className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-200">
                  Previous
                </button>
                <button className="px-3 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-200">
                  1
                </button>
                <button className="px-3 py-2 border-t border-b border-gray-300 bg-[#B80000] text-sm font-medium text-white">
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
          </div>
          
          <Sidebar />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default HomePage;
