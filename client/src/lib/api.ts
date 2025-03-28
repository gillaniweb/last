import { apiRequest } from "./queryClient";
import { Article, BreakingNews, Category } from "@shared/schema";

// Articles API
export const fetchArticles = async (limit = 10, offset = 0): Promise<Article[]> => {
  const res = await apiRequest("GET", `/api/articles?limit=${limit}&offset=${offset}`, undefined);
  return res.json();
};

export const fetchFeaturedArticles = async (limit = 4): Promise<Article[]> => {
  const res = await apiRequest("GET", `/api/articles/featured?limit=${limit}`, undefined);
  return res.json();
};

export const fetchLatestArticles = async (limit = 5): Promise<Article[]> => {
  const res = await apiRequest("GET", `/api/articles/latest?limit=${limit}`, undefined);
  return res.json();
};

export const fetchMostReadArticles = async (limit = 5): Promise<Article[]> => {
  const res = await apiRequest("GET", `/api/articles/most-read?limit=${limit}`, undefined);
  return res.json();
};

export const fetchArticlesByCategory = async (category: Category, limit = 10, offset = 0): Promise<Article[]> => {
  const res = await apiRequest("GET", `/api/articles/category/${category}?limit=${limit}&offset=${offset}`, undefined);
  return res.json();
};

export const fetchArticleBySlug = async (slug: string): Promise<Article> => {
  const res = await apiRequest("GET", `/api/articles/${slug}`, undefined);
  return res.json();
};

export const searchArticles = async (query: string, limit = 10, offset = 0): Promise<Article[]> => {
  const res = await apiRequest("GET", `/api/articles/search?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`, undefined);
  return res.json();
};

// Breaking News API
export const fetchBreakingNews = async (): Promise<BreakingNews[]> => {
  const res = await apiRequest("GET", `/api/breaking-news`, undefined);
  return res.json();
};

// Categories API
export const fetchCategories = async (): Promise<Category[]> => {
  const res = await apiRequest("GET", `/api/categories`, undefined);
  return res.json();
};
