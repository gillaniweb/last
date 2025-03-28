import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Category } from "@shared/schema";
import { useMediaQuery } from "@/lib/hooks";
import MobileMenu from "./MobileMenu";
import { Search, User, Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Header = () => {
  const [location] = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  useEffect(() => {
    // Close mobile menu when navigating to a new route
    setShowMobileMenu(false);
  }, [location]);
  
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4">
        {/* Top Nav Bar */}
        <div className="flex items-center justify-between py-3 border-b border-gray-200">
          <div className="flex items-center">
            <Link href="/" className="font-bold text-2xl text-[#B80000]">
              GNN
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/search" className="text-gray-800 hover:text-[#B80000]">
              <Search size={20} />
            </Link>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/notifications" 
                    className={`text-gray-800 hover:text-[#B80000] ${location === '/notifications' ? 'text-[#B80000]' : ''}`}
                  >
                    <Bell size={20} />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Notification settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button
              variant="ghost"
              className="text-gray-800 hover:text-[#B80000] p-0"
              size="icon"
            >
              <User size={20} />
            </Button>
            <Button
              className="bg-[#B80000] text-white px-3 py-1 rounded hover:bg-[#8B0000] text-sm"
            >
              Subscribe
            </Button>
          </div>
          {isMobile && (
            <Button
              variant="ghost"
              className="md:hidden text-gray-800"
              onClick={() => setShowMobileMenu(true)}
              size="icon"
            >
              <Menu size={24} />
            </Button>
          )}
        </div>
        
        {/* Main Navigation */}
        <nav className="hidden md:flex py-2 overflow-x-auto">
          <ul className="flex space-x-6">
            <li>
              <Link 
                href="/" 
                className={`${location === '/' ? 'text-[#B80000]' : 'text-gray-800 hover:text-[#B80000]'} font-medium`}
              >
                Home
              </Link>
            </li>
            {!isLoading && categories?.map((category) => (
              <li key={category.id}>
                <Link 
                  href={`/category/${category.slug}`}
                  className={`${location === `/category/${category.slug}` ? 'text-[#B80000]' : 'text-gray-800 hover:text-[#B80000]'}`}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      {/* Mobile Menu */}
      <MobileMenu isOpen={showMobileMenu} onClose={() => setShowMobileMenu(false)} categories={categories || []} />
    </header>
  );
};

export default Header;
