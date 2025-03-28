import { useRef, useEffect } from "react";
import { Link } from "wouter";
import { Category } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { X, Bell, Search, User } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
}

const MobileMenu = ({ isOpen, onClose, categories }: MobileMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed inset-y-0 right-0 h-full w-3/4 max-w-sm p-4 bg-white shadow-lg rounded-none">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-xl text-[#B80000]">GNN</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-6 w-6" />
            </Button>
          </div>
          
          <nav className="mb-6 flex-grow overflow-y-auto">
            <div className="flex space-x-4 justify-between px-2 py-3 border-b border-gray-200 mb-2">
              <Link href="/search" className="flex items-center text-gray-800" onClick={onClose}>
                <Search size={18} className="mr-1" />
                <span>Search</span>
              </Link>
              <Link href="/notifications" className="flex items-center text-gray-800" onClick={onClose}>
                <Bell size={18} className="mr-1" />
                <span>Notifications</span>
              </Link>
              <button className="flex items-center text-gray-800">
                <User size={18} className="mr-1" />
                <span>Account</span>
              </button>
            </div>
            <ul className="space-y-0">
              <li>
                <Link 
                  href="/" 
                  className="block p-2 text-[#B80000] font-medium border-b border-gray-200" 
                  onClick={onClose}
                >
                  Home
                </Link>
              </li>
              {categories.map((category) => (
                <li key={category.id}>
                  <Link 
                    href={`/category/${category.slug}`}
                    className="block p-2 text-gray-800 hover:text-[#B80000] border-b border-gray-200" 
                    onClick={onClose}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="space-y-4 mt-auto">
            <Button className="w-full bg-[#B80000] text-white p-3 rounded font-medium hover:bg-[#8B0000]">
              Subscribe
            </Button>
            <Button variant="outline" className="w-full border border-gray-800 text-gray-800 p-3 rounded font-medium">
              Sign In
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MobileMenu;
