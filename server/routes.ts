import { Express, Request, Response, NextFunction } from "express";
import { Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertArticleSchema, insertAuthorSchema, insertCategorySchema, insertCommentSchema, insertRelatedStorySchema, insertUserSchema } from "../shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create an HTTP server instance but don't start listening yet
  // The parent index.ts will handle starting the server
  const httpServer = new Server(app);

  app.get("/api/categories", async (_req: Request, res: Response) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:slug", async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const category = await storage.getCategoryBySlug(slug);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  app.post("/api/categories", async (req: Request, res: Response) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid category data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  app.get("/api/articles", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const articles = await storage.getArticles(limit, offset);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  app.get("/api/articles/featured", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 4;
      const articles = await storage.getFeaturedArticles(limit);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured articles" });
    }
  });

  app.get("/api/articles/breaking", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
      const articles = await storage.getBreakingNews(limit);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch breaking news" });
    }
  });

  app.get("/api/articles/latest", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const articles = await storage.getLatestArticles(limit);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch latest articles" });
    }
  });

  app.get("/api/articles/most-read", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const articles = await storage.getMostReadArticles(limit);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch most read articles" });
    }
  });

  app.get("/api/articles/category/:categoryId", async (req: Request, res: Response) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const articles = await storage.getArticlesByCategory(categoryId, limit, offset);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch articles by category" });
    }
  });

  app.get("/api/articles/author/:authorId", async (req: Request, res: Response) => {
    try {
      const authorId = parseInt(req.params.authorId);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const articles = await storage.getArticlesByAuthor(authorId, limit, offset);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch articles by author" });
    }
  });

  app.get("/api/articles/search", async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const articles = await storage.searchArticles(query, limit);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to search articles" });
    }
  });

  app.get("/api/articles/:slug", async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const article = await storage.getArticleBySlug(slug);
      
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  app.post("/api/articles", async (req: Request, res: Response) => {
    try {
      const validatedData = insertArticleSchema.parse(req.body);
      const article = await storage.createArticle(validatedData);
      res.status(201).json(article);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid article data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create article" });
    }
  });

  app.put("/api/articles/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertArticleSchema.partial().parse(req.body);
      const article = await storage.updateArticle(id, validatedData);
      
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      res.json(article);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid article data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update article" });
    }
  });

  app.delete("/api/articles/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteArticle(id);
      
      if (!success) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete article" });
    }
  });

  app.get("/api/authors", async (_req: Request, res: Response) => {
    try {
      const authors = await storage.getAuthors();
      res.json(authors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch authors" });
    }
  });

  app.get("/api/authors/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const author = await storage.getAuthorById(id);
      
      if (!author) {
        return res.status(404).json({ message: "Author not found" });
      }
      
      res.json(author);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch author" });
    }
  });

  app.post("/api/authors", async (req: Request, res: Response) => {
    try {
      const validatedData = insertAuthorSchema.parse(req.body);
      const author = await storage.createAuthor(validatedData);
      res.status(201).json(author);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid author data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create author" });
    }
  });

  app.get("/api/articles/:id/related", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const articles = await storage.getRelatedStories(id);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch related stories" });
    }
  });

  app.post("/api/related-stories", async (req: Request, res: Response) => {
    try {
      const validatedData = insertRelatedStorySchema.parse(req.body);
      const relatedStory = await storage.addRelatedStory(validatedData);
      res.status(201).json(relatedStory);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid related story data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create related story" });
    }
  });

  app.post("/api/seed", async (_req: Request, res: Response) => {
    try {
      // Create categories
      const worldCategory = await storage.createCategory({ name: "World", slug: "world" });
      const politicsCategory = await storage.createCategory({ name: "Politics", slug: "politics" });
      const businessCategory = await storage.createCategory({ name: "Business", slug: "business" });
      const techCategory = await storage.createCategory({ name: "Technology", slug: "technology" });
      const sportsCategory = await storage.createCategory({ name: "Sports", slug: "sports" });
      const entertainmentCategory = await storage.createCategory({ name: "Entertainment", slug: "entertainment" });
      const healthCategory = await storage.createCategory({ name: "Health", slug: "health" });
      const scienceCategory = await storage.createCategory({ name: "Science", slug: "science" });
      
      // Create authors
      const johnDoe = await storage.createAuthor({ name: "John Doe", bio: "Senior Political Correspondent", imageUrl: "https://randomuser.me/api/portraits/men/1.jpg" });
      const janeSmith = await storage.createAuthor({ name: "Jane Smith", bio: "International Affairs Editor", imageUrl: "https://randomuser.me/api/portraits/women/2.jpg" });
      const michaelChen = await storage.createAuthor({ name: "Michael Chen", bio: "Technology Reporter", imageUrl: "https://randomuser.me/api/portraits/men/3.jpg" });
      const sarahJohnson = await storage.createAuthor({ name: "Sarah Johnson", bio: "Health & Science Correspondent", imageUrl: "https://randomuser.me/api/portraits/women/4.jpg" });
      const davidWong = await storage.createAuthor({ name: "David Wong", bio: "Business & Finance Editor", imageUrl: "https://randomuser.me/api/portraits/men/5.jpg" });
      const emmaRoberts = await storage.createAuthor({ name: "Emma Roberts", bio: "Sports Analyst", imageUrl: "https://randomuser.me/api/portraits/women/6.jpg" });
      const rebeccaLiu = await storage.createAuthor({ name: "Rebecca Liu", bio: "Entertainment Reporter", imageUrl: "https://randomuser.me/api/portraits/women/7.jpg" });
      const emilyWong = await storage.createAuthor({ name: "Emily Wong", bio: "Foreign Correspondent", imageUrl: "https://randomuser.me/api/portraits/women/8.jpg" });
      
      // Create articles
      const articles = [
        {
          title: "World Leaders Gather for Critical Climate Summit",
          slug: "world-leaders-climate-summit",
          summary: "Representatives from over 190 countries meet to discuss ambitious new targets for reducing carbon emissions",
          content: "In what experts are calling a make-or-break moment for global climate policy, world leaders from more than 190 nations have convened in Geneva this week for a high-stakes summit on climate change...",
          imageUrl: "https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg",
          authorId: janeSmith.id,
          categoryId: worldCategory.id,
          isFeatured: 1,
          isBreaking: 1,
          publishedAt: new Date(), // current time
        },
        {
          title: "Electoral Reform Bill Faces Strong Opposition in Parliament",
          slug: "electoral-reform-bill-opposition",
          summary: "The controversial legislation aimed at changing voting procedures has sparked heated debates among lawmakers and civil rights groups",
          content: "A contentious electoral reform bill introduced last month is facing mounting opposition from across the political spectrum...",
          imageUrl: "https://images.pexels.com/photos/8851096/pexels-photo-8851096.jpeg",
          authorId: michaelChen.id,
          categoryId: politicsCategory.id,
          isFeatured: 0,
          isBreaking: 0,
          publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
        },
        {
          title: "Markets Tumble on Inflation Fears and Central Bank Decisions",
          slug: "markets-tumble-inflation-central-bank",
          summary: "Global stocks experienced their worst day in months as investors reacted to higher-than-expected inflation data and interest rate concerns",
          content: "Stock markets around the world saw sharp declines today as investors responded to troubling inflation figures and anticipation of hawkish central bank policies...",
          imageUrl: "https://images.pexels.com/photos/7567444/pexels-photo-7567444.jpeg",
          authorId: davidWong.id,
          categoryId: businessCategory.id,
          isFeatured: 0,
          isBreaking: 0,
          publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        },
        {
          title: "Tech Giant Unveils Revolutionary AI System with Human-Like Reasoning",
          slug: "tech-giant-ai-system-reasoning",
          summary: "The breakthrough technology can solve complex problems and has passed sophisticated cognitive tests, raising both excitement and ethical concerns",
          content: "In a major advancement for artificial intelligence research, tech giant DeepMind has unveiled a system that demonstrates human-like reasoning capabilities...",
          imageUrl: "https://images.pexels.com/photos/5792901/pexels-photo-5792901.jpeg",
          authorId: michaelChen.id,
          categoryId: techCategory.id,
          isFeatured: 1,
          isBreaking: 0,
          publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        },
        {
          title: "Major Trade Deal Signed Between Asian and European Nations",
          slug: "trade-deal-asia-europe",
          summary: "The historic agreement eliminates tariffs on thousands of products and creates the world's largest free trade zone",
          content: "In a landmark agreement, representatives from major Asian and European nations have signed a comprehensive trade deal eliminating tariffs on thousands of goods and services...",
          imageUrl: "https://images.pexels.com/photos/164527/pexels-photo-164527.jpeg",
          authorId: emilyWong.id,
          categoryId: worldCategory.id,
          isFeatured: 0,
          isBreaking: 0,
          publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        }
      ];

      // Create articles
      for (const articleData of articles) {
        await storage.createArticle(articleData);
      }

      res.json({ message: "Demo data seeded successfully" });
    } catch (error) {
      console.error("Error seeding data:", error);
      res.status(500).json({ error: "Failed to seed data" });
    }
  });

  // Auth routes
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(validatedData.email);
      
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }
      
      const user = await storage.createUser(validatedData);
      res.status(201).json({ id: user.id, email: user.email, name: user.name });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to register user" });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      res.json({ id: user.id, email: user.email, name: user.name });
    } catch (error) {
      res.status(500).json({ message: "Failed to login" });
    }
  });

  // Comments routes
  app.get("/api/articles/:articleId/comments", async (req: Request, res: Response) => {
    try {
      const articleId = parseInt(req.params.articleId);
      const comments = await storage.getCommentsByArticle(articleId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post("/api/articles/:articleId/comments", async (req: Request, res: Response) => {
    try {
      const articleId = parseInt(req.params.articleId);
      const validatedData = insertCommentSchema.parse({ ...req.body, articleId });
      const comment = await storage.createComment(validatedData);
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid comment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  app.delete("/api/comments/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteComment(id);
      
      if (!success) {
        return res.status(404).json({ message: "Comment not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete comment" });
    }
  });

  // Image upload routes
  app.post("/api/articles/:articleId/images", async (req: Request, res: Response) => {
    try {
      const articleId = parseInt(req.params.articleId);
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ message: "Image URL is required" });
      }
      
      const image = await storage.createImage({ url, articleId });
      res.status(201).json(image);
    } catch (error) {
      res.status(500).json({ message: "Failed to upload image" });
    }
  });

  app.get("/api/articles/:articleId/images", async (req: Request, res: Response) => {
    try {
      const articleId = parseInt(req.params.articleId);
      const images = await storage.getImagesByArticle(articleId);
      res.json(images);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch images" });
    }
  });

  app.delete("/api/images/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteImage(id);
      
      if (!success) {
        return res.status(404).json({ message: "Image not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete image" });
    }
  });
  
  return httpServer;
}