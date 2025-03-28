import { useQuery } from "@tanstack/react-query";
import { Article } from "@shared/schema";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

const BreakingNewsBanner = () => {
  const [breakingNewsText, setBreakingNewsText] = useState("");
  
  const { data: breakingNews, isLoading, isError } = useQuery<Article[]>({
    queryKey: ["/api/articles/breaking"],
  });
  
  useEffect(() => {
    if (breakingNews && breakingNews.length > 0) {
      const newsTexts = breakingNews.map(article => article.title);
      setBreakingNewsText(newsTexts.join(" • "));
    }
  }, [breakingNews]);
  
  if (isLoading) {
    return (
      <div className="bg-[#B80000] text-white py-2">
        <div className="flex items-center">
          <div className="flex-shrink-0 px-4 font-bold">BREAKING</div>
          <Skeleton className="h-4 w-3/4 bg-white/30" />
        </div>
      </div>
    );
  }
  
  if (isError || !breakingNews || breakingNews.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-[#B80000] text-white py-2 overflow-hidden">
      <div className="flex items-center">
        <div className="flex-shrink-0 px-4 font-bold">BREAKING</div>
        <div className="overflow-hidden whitespace-nowrap">
          <p className="animate-[scroll-left_20s_linear_infinite] inline-block">
            {breakingNewsText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BreakingNewsBanner;

// Add animation keyframe to index.css
const scrollLeftKeyframe = `
@keyframes scroll-left {
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}
`;

// Inject the keyframe if it doesn't exist
if (!document.getElementById('scroll-left-keyframe')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'scroll-left-keyframe';
  styleSheet.textContent = scrollLeftKeyframe;
  document.head.appendChild(styleSheet);
}
