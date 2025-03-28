import { Link } from "wouter";
import { Article } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { Bookmark, Share2, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface ArticleCardProps {
  article: Article;
  showCategory?: boolean;
  showBookmarkShare?: boolean;
}

const ArticleCard = ({ article, showCategory = true, showBookmarkShare = true }: ArticleCardProps) => {
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  const getCategoryName = (categoryId: number) => {
    if (!categories) return "News";
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : "News";
  };
  
  const handleShareWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    // Construct article URL
    const articleUrl = `${window.location.origin}/article/${article.slug}`;
    // WhatsApp share URL
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(article.title + ' - ' + articleUrl)}`;
    window.open(whatsappUrl, '_blank');
  };
  
  return (
    <article className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <Link href={`/article/${article.slug}`} className="block">
          <img 
            src={article.imageUrl} 
            alt={article.title} 
            className="w-full h-full object-cover"
          />
        </Link>
        {showCategory && (
          <Link 
            href={`/category/${article.categoryId}`}
            className="absolute top-3 left-3 bg-[#B80000] text-white text-xs px-2 py-1 rounded"
          >
            {getCategoryName(article.categoryId)}
          </Link>
        )}
      </div>
      <div className="p-4">
        <Link href={`/article/${article.slug}`} className="block">
          <h3 className="font-bold text-lg mb-2 line-clamp-2 hover:text-[#B80000]">{article.title}</h3>
        </Link>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{article.summary}</p>
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>{formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}</span>
          {showBookmarkShare && (
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" className="h-6 w-6 hover:text-[#B80000]">
                <Bookmark className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 hover:text-[#B80000]">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={handleShareWhatsApp} className="cursor-pointer">
                    <Smartphone className="h-4 w-4 mr-2" />
                    WhatsApp
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
