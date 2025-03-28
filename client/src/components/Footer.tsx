import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Category } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  return (
    <footer className="bg-[#222222] text-white pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="text-xl font-bold mb-4">GNN</h4>
            <p className="text-gray-400 mb-4">Bringing you the latest news and analysis from around the world, 24 hours a day.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Explore</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-gray-400 hover:text-white">Home</a>
                </Link>
              </li>
              {categories?.slice(0, 5).map((category) => (
                <li key={category.id}>
                  <Link href={`/category/${category.slug}`}>
                    <a className="text-gray-400 hover:text-white">{category.name}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Advertise</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Ethics Policy</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Subscribe</h4>
            <p className="text-gray-400 mb-4">Get the latest news delivered to your inbox daily.</p>
            <form className="flex">
              <Input
                type="email"
                placeholder="Your email"
                className="px-3 py-2 bg-gray-800 text-white rounded-l focus:outline-none w-full border-0"
              />
              <Button className="bg-[#B80000] hover:bg-[#8B0000] px-4 py-2 rounded-r font-medium">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">© 2023 Global News Network. All rights reserved.</p>
          <div className="flex space-x-4 text-sm text-gray-400">
            <a href="#" className="hover:text-white">Terms of Use</a>
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Cookie Policy</a>
            <a href="#" className="hover:text-white">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
