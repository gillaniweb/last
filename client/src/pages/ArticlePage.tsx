import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import Header from "@/components/Header";
import BreakingNewsBanner from "@/components/BreakingNewsBanner";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import CategoryToolbar from "@/components/CategoryToolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { Article, Category, Author } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { Facebook, Twitter, Linkedin, Mail, Bookmark, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const ArticlePage = () => {
  const [match, params] = useRoute<{ slug: string }>("/article/:slug");
  
  // Get article details
  const { data: article, isLoading: isLoadingArticle } = useQuery<Article>({
    queryKey: [params?.slug ? `/api/articles/${params.slug}` : null],
    enabled: !!params?.slug,
  });
  
  // Get category details
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  // Get author details
  const { data: authors } = useQuery<Author[]>({
    queryKey: ["/api/authors"],
  });
  
  // Get related articles
  const { data: relatedArticles, isLoading: isLoadingRelated } = useQuery<Article[]>({
    queryKey: [article ? `/api/articles/${article.id}/related` : null],
    enabled: !!article,
  });
  
  if (!match) {
    return <div>Article not found</div>;
  }
  
  const category = categories?.find(c => article && c.id === article.categoryId);
  const author = authors?.find(a => article && a.id === article.authorId);
  
  return (
    <>
      <Header />
      <CategoryToolbar />
      <BreakingNewsBanner />
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {isLoadingArticle ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : article ? (
              <article>
                {/* Category */}
                {category && (
                  <Link href={`/category/${category.slug}`}>
                    <a className="inline-block bg-[#B80000] text-white px-2 py-1 text-xs font-semibold rounded mb-3">
                      {category.name}
                    </a>
                  </Link>
                )}
                
                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold mb-3 text-[#222222]">{article.title}</h1>
                
                {/* Metadata */}
                <div className="flex flex-wrap items-center text-sm text-gray-600 mb-4">
                  <span>{formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}</span>
                  <span className="mx-2">•</span>
                  <span>By {author ? author.name : `Author ${article.authorId}`}</span>
                </div>
                
                {/* Social Share */}
                <div className="flex space-x-2 mb-6">
                  <Button variant="outline" size="icon" className="rounded-full h-8 w-8">
                    <Facebook size={16} className="text-[#1877F2]" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full h-8 w-8">
                    <Twitter size={16} className="text-[#1DA1F2]" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full h-8 w-8">
                    <Linkedin size={16} className="text-[#0A66C2]" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full h-8 w-8">
                    <Mail size={16} className="text-gray-600" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full h-8 w-8">
                    <Bookmark size={16} className="text-gray-600" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full h-8 w-8">
                    <Share2 size={16} className="text-gray-600" />
                  </Button>
                </div>
                
                {/* Featured Image */}
                <div className="relative mb-6">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-auto rounded-lg"
                  />
                </div>
                
                {/* Summary */}
                <div className="bg-gray-100 p-4 rounded-lg mb-6">
                  <p className="text-gray-800 italic font-medium">{article.summary}</p>
                </div>
                
                {/* Content */}
                <div className="prose max-w-none mb-8">
                  <p>{article.content}</p>
                  
                  {/* For demonstration, generate some paragraphs */}
                  {[...Array(5)].map((_, index) => (
                    <p key={index}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, 
                      nunc nec aliquam ultricies, nunc nisl aliquam nunc, nec aliquam nunc nisl 
                      nec nunc. Nullam auctor, nunc nec aliquam ultricies, nunc nisl aliquam nunc, 
                      nec aliquam nunc nisl nec nunc.
                    </p>
                  ))}
                </div>
                
                {/* Author Bio */}
                {author && (
                  <div className="border-t border-b border-gray-200 py-6 mb-8">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-4">
                        <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-600 font-bold">{author.name.charAt(0)}</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{author.name}</h3>
                        <p className="text-sm text-gray-600">{author.bio || "Journalist at Global News Network"}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Related Articles */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-[#222222]">Related Stories</h2>
                  {isLoadingRelated ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[...Array(2)].map((_, index) => (
                        <Skeleton key={index} className="h-48" />
                      ))}
                    </div>
                  ) : relatedArticles && relatedArticles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {relatedArticles.map((relatedArticle) => (
                        <ArticleCard key={relatedArticle.id} article={relatedArticle} />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Show other articles from the same category if no related articles */}
                      {[...Array(2)].map((_, index) => (
                        <ArticleCard 
                          key={index} 
                          article={{
                            ...article,
                            id: article.id + 100 + index,
                            title: `Related Article ${index + 1} - ${article.title}`,
                            slug: `related-${article.slug}-${index + 1}`
                          }} 
                        />
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ) : (
              <div className="bg-red-50 border border-red-200 p-8 rounded-lg text-center">
                <p className="text-red-800">Article not found or has been removed.</p>
                <Link href="/">
                  <a className="text-[#B80000] hover:underline font-medium mt-2 inline-block">
                    Return to homepage
                  </a>
                </Link>
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

export default ArticlePage;
