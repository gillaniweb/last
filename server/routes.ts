import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertArticleSchema, insertAuthorSchema, insertCategorySchema, insertRelatedStorySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Categories
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
  
  // Articles
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
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
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
  
  // Authors
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
  
  // Related stories
  app.get("/api/articles/:id/related", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const relatedArticles = await storage.getRelatedStories(id);
      res.json(relatedArticles);
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
      res.status(500).json({ message: "Failed to add related story" });
    }
  });
  
  // Seed some demo data
  app.post("/api/seed", async (_req: Request, res: Response) => {
    try {
      // Get categories
      const categories = await storage.getCategories();
      const worldCategory = categories.find(c => c.name === "World")!;
      const politicsCategory = categories.find(c => c.name === "Politics")!;
      const businessCategory = categories.find(c => c.name === "Business")!;
      const techCategory = categories.find(c => c.name === "Technology")!;
      const sportsCategory = categories.find(c => c.name === "Sports")!;
      
      // Get authors
      const authors = await storage.getAuthors();
      const sarahJohnson = authors.find(a => a.name === "Sarah Johnson")!;
      const michaelChen = authors.find(a => a.name === "Michael Chen")!;
      const rebeccaLiu = authors.find(a => a.name === "Rebecca Liu")!;
      const davidWong = authors.find(a => a.name === "David Wong")!;
      const emmaRoberts = authors.find(a => a.name === "Emma Roberts")!;
      
      // Create articles
      const articles = [
        {
          title: "World Leaders Gather for Critical Climate Summit in Geneva",
          slug: "world-leaders-climate-summit-geneva",
          summary: "Historic meeting aims to set ambitious targets for carbon reduction as scientists warn of point of no return",
          content: "World leaders from over 190 countries have gathered in Geneva this week for what experts are calling the most critical climate summit in a decade...",
          imageUrl: "https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg",
          authorId: sarahJohnson.id,
          categoryId: worldCategory.id,
          isFeatured: 1,
          isBreaking: 1,
          publishedAt: new Date(),
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
          content: "After years of negotiations, representatives from 15 Asian and European nations have signed a landmark trade agreement that analysts say will reshape global commerce...",
          imageUrl: "https://images.pexels.com/photos/6615076/pexels-photo-6615076.jpeg",
          authorId: rebeccaLiu.id,
          categoryId: businessCategory.id,
          isFeatured: 1,
          isBreaking: 0,
          publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        },
        {
          title: "Record Transfer Fee Shatters Previous Mark in Football World",
          slug: "record-transfer-fee-football",
          summary: "The staggering £200 million move has sent shockwaves through the sporting world as the young superstar heads to a new club",
          content: "The football world is reeling today after the announcement of a record-shattering transfer fee that eclipses all previous deals...",
          imageUrl: "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg",
          authorId: davidWong.id,
          categoryId: sportsCategory.id,
          isFeatured: 1,
          isBreaking: 0,
          publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
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
          title: "Cabinet Reshuffle Announced Following Minister's Resignation",
          slug: "cabinet-reshuffle-minister-resignation",
          summary: "The Prime Minister has announced key changes to senior government positions after the unexpected departure of the Treasury chief",
          content: "In a surprise announcement from Downing Street today, the Prime Minister revealed a significant cabinet reshuffle following the resignation...",
          imageUrl: "https://images.pexels.com/photos/4560084/pexels-photo-4560084.jpeg",
          authorId: rebeccaLiu.id,
          categoryId: politicsCategory.id,
          isFeatured: 0,
          isBreaking: 0,
          publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
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
          title: "Major Merger Creates New Industry Giant in Energy Sector",
          slug: "merger-energy-sector-giant",
          summary: "The $45 billion deal will combine two of the largest companies in renewable energy, creating a powerhouse in the green technology space",
          content: "In a move that surprised industry analysts, two leading renewable energy corporations announced a $45 billion merger agreement today...",
          imageUrl: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg",
          authorId: emmaRoberts.id,
          categoryId: businessCategory.id,
          isFeatured: 0,
          isBreaking: 0,
          publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        },
        {
          title: "New Virtual Reality Platform Aims to Revolutionize Remote Work",
          slug: "vr-platform-remote-work",
          summary: "The technology creates immersive office environments allowing teams to collaborate as if physically present, even from different continents",
          content: "As remote work becomes increasingly permanent for many global companies, a Silicon Valley startup has unveiled a groundbreaking virtual reality platform...",
          imageUrl: "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg",
          authorId: michaelChen.id,
          categoryId: techCategory.id,
          isFeatured: 0,
          isBreaking: 0,
          publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10 hours ago
        },
        {
          title: "Robotics Breakthrough Could Transform Healthcare Delivery",
          slug: "robotics-healthcare-delivery",
          summary: "The new generation of medical robots can perform delicate procedures with unprecedented precision, potentially reducing recovery times and improving outcomes",
          content: "Healthcare experts are hailing a major breakthrough in medical robotics that could fundamentally change how certain procedures are performed...",
          imageUrl: "https://images.pexels.com/photos/5082579/pexels-photo-5082579.jpeg",
          authorId: sarahJohnson.id,
          categoryId: techCategory.id,
          isFeatured: 0,
          isBreaking: 0,
          publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        },
      ];
      
      for (const article of articles) {
        await storage.createArticle(article);
      }
      
      res.status(200).json({ message: "Demo data seeded successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to seed demo data" });
    }
  });
  
  return httpServer;
}
