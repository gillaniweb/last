import { Article, Category, Author } from "@shared/schema";

// Define additional types as needed for the frontend
export interface SearchResults {
  articles: Article[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CategoryWithArticles extends Category {
  articles: Article[];
}

export interface AuthorWithArticles extends Author {
  articles: Article[];
}

// Define context types if needed
export interface NewsContextType {
  selectedCategory: Category | null;
  setSelectedCategory: (category: Category | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}
