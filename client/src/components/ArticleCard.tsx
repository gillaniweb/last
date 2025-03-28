import { Link } from "wouter";
import { Article } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { Bookmark, Share2, Smartphone, Facebook, Twitter, Instagram } from "lucide-react";
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
  
  const getArticleUrl = () => {
    return `${window.location.origin}/article/${article.slug}`;
  };

  const handleShareWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(article.title + ' - ' + getArticleUrl())}`;
    window.open(whatsappUrl, '_blank');
  };
  
  const handleShareFacebook = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getArticleUrl())}`;
    window.open(url, '_blank', 'width=600,height=400');
  };
  
  const handleShareTwitter = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(getArticleUrl())}&text=${encodeURIComponent(article.title)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };
  
  const handleShareInstagram = (e: React.MouseEvent) => {
    e.preventDefault();
    // Instagram doesn't have a direct sharing API like others
    // Usually this would copy the link to clipboard and open Instagram
    alert('Instagram link copied! You can now share it in your Instagram story or post.');
    navigator.clipboard.writeText(getArticleUrl());
  };
  
  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    // This would typically save to user's bookmarks in a real application
    alert('Article bookmarked!');
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
              <Button variant="ghost" size="icon" className="h-6 w-6 hover:text-[#B80000]" onClick={handleBookmark}>
                <Bookmark className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 hover:text-[#B80000]">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuItem onClick={handleShareWhatsApp} className="cursor-pointer">
                    <Smartphone className="h-4 w-4 mr-2" />
                    WhatsApp
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleShareFacebook} className="cursor-pointer">
                    <Facebook className="h-4 w-4 mr-2 text-[#1877F2]" />
                    Facebook
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleShareTwitter} className="cursor-pointer">
                    <Twitter className="h-4 w-4 mr-2 text-[#1DA1F2]" />
                    Twitter
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleShareInstagram} className="cursor-pointer">
                    <Instagram className="h-4 w-4 mr-2 text-[#E4405F]" />
                    Instagram
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
