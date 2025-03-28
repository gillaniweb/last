import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Category } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

const CategoryToolbar = () => {
  const [location] = useLocation();
  
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  // Function to check if a category is currently active
  const isCategoryActive = (slug: string) => {
    return location === `/category/${slug}`;
  };
  
  return (
    <div className="bg-[#222222] py-2 sticky top-[72px] z-40 shadow-md">
      <div className="container mx-auto px-4">
        <div className="overflow-x-auto scrollbar-hide category-scroll">
          <div className="flex space-x-2 md:space-x-4 py-1 min-w-max">
            {isLoading ? (
              // Skeleton loading UI
              <>
                {[...Array(8)].map((_, index) => (
                  <Skeleton key={index} className="h-8 w-16 md:w-24 rounded-full" />
                ))}
              </>
            ) : (
              <>
                {/* All News Link */}
                <Link href="/" 
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap
                    ${location === '/' 
                      ? 'bg-[#B80000] text-white' 
                      : 'bg-gray-700 text-white hover:bg-gray-600'}`}>
                  All News
                </Link>
                
                {/* Categories */}
                {categories?.map((category) => (
                  <Link 
                    key={category.id} 
                    href={`/category/${category.slug}`}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap
                      ${isCategoryActive(category.slug) 
                        ? 'bg-[#B80000] text-white' 
                        : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                  >
                    {category.name}
                  </Link>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryToolbar;