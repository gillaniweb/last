import { 
  articles, type Article, type InsertArticle,
  categories, type Category, type InsertCategory,
  authors, type Author, type InsertAuthor,
  relatedStories, type RelatedStory, type InsertRelatedStory,
  users, type User, type InsertUser,
  comments, type Comment, type InsertComment,
  images, type Image, type InsertImage,
  pushSubscriptions, type PushSubscription, type InsertPushSubscription,
  type PushNotification
} from "@shared/schema";

export interface IStorage {
  // Category methods
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Article methods
  getArticles(limit?: number, offset?: number): Promise<Article[]>;
  getArticlesByCategory(categoryId: number, limit?: number, offset?: number): Promise<Article[]>;
  getArticlesByAuthor(authorId: number, limit?: number, offset?: number): Promise<Article[]>;
  getFeaturedArticles(limit?: number): Promise<Article[]>;
  getBreakingNews(limit?: number): Promise<Article[]>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  getArticleById(id: number): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: number, article: Partial<InsertArticle>): Promise<Article | undefined>;
  deleteArticle(id: number): Promise<boolean>;
  searchArticles(query: string, limit?: number): Promise<Article[]>;
  getLatestArticles(limit?: number): Promise<Article[]>;
  getMostReadArticles(limit?: number): Promise<Article[]>;
  
  // User methods
  createUser(user: InsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserById(id: number): Promise<User | undefined>;
  
  // Comment methods
  createComment(comment: InsertComment): Promise<Comment>;
  getCommentsByArticle(articleId: number): Promise<Comment[]>;
  deleteComment(id: number): Promise<boolean>;
  
  // Image methods
  createImage(image: InsertImage): Promise<Image>;
  getImagesByArticle(articleId: number): Promise<Image[]>;
  deleteImage(id: number): Promise<boolean>;
  
  // Author methods
  getAuthors(): Promise<Author[]>;
  getAuthorById(id: number): Promise<Author | undefined>;
  createAuthor(author: InsertAuthor): Promise<Author>;
  
  // Related stories methods
  getRelatedStories(articleId: number): Promise<Article[]>;
  addRelatedStory(relatedStory: InsertRelatedStory): Promise<RelatedStory>;
  
  // Push notification methods
  createPushSubscription(subscription: InsertPushSubscription): Promise<PushSubscription>;
  getPushSubscriptionByEndpoint(endpoint: string): Promise<PushSubscription | undefined>;
  getAllPushSubscriptions(): Promise<PushSubscription[]>;
  getPushSubscriptionsByCategory(category: string): Promise<PushSubscription[]>;
  deletePushSubscription(endpoint: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private categories: Map<number, Category>;
  private articles: Map<number, Article>;
  private authors: Map<number, Author>;
  private relatedStories: Map<number, RelatedStory>;
  private users: Map<number, User>;
  private comments: Map<number, Comment>;
  private images: Map<number, Image>;
  private pushSubscriptions: Map<number, PushSubscription>;
  
  private categoryId: number;
  private articleId: number;
  private authorId: number;
  private relatedStoryId: number;
  private userId: number;
  private commentId: number;
  private imageId: number;
  private pushSubscriptionId: number;
  
  constructor() {
    this.categories = new Map();
    this.articles = new Map();
    this.authors = new Map();
    this.relatedStories = new Map();
    this.users = new Map();
    this.comments = new Map();
    this.images = new Map();
    this.pushSubscriptions = new Map();
    
    this.categoryId = 1;
    this.articleId = 1;
    this.authorId = 1;
    this.relatedStoryId = 1;
    this.userId = 1;
    this.commentId = 1;
    this.imageId = 1;
    this.pushSubscriptionId = 1;
    
    // Initialize with default data
    this.initDefaultData();
  }
  
  private initDefaultData() {
    // Create default categories
    const categoryNames = ["World", "Politics", "Business", "Technology", "Sports", "Entertainment", "Health", "Science"];
    categoryNames.forEach(name => {
      this.createCategory({
        name,
        slug: name.toLowerCase(),
      });
    });
    
    // Create default authors
    const authorNames = ["Sarah Johnson", "Michael Chen", "Rebecca Liu", "David Wong", "Emma Roberts", "James Miller", "Sophia Patel"];
    authorNames.forEach(name => {
      this.createAuthor({
        name,
        bio: `Experienced journalist covering various topics`,
        imageUrl: null,
      });
    });
  }
  
  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      category => category.slug === slug
    );
  }
  
  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.categoryId++;
    const newCategory: Category = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }
  
  // Article methods
  async getArticles(limit = 10, offset = 0): Promise<Article[]> {
    return Array.from(this.articles.values())
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(offset, offset + limit);
  }
  
  async getArticlesByCategory(categoryId: number, limit = 10, offset = 0): Promise<Article[]> {
    return Array.from(this.articles.values())
      .filter(article => article.categoryId === categoryId)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(offset, offset + limit);
  }
  
  async getArticlesByAuthor(authorId: number, limit = 10, offset = 0): Promise<Article[]> {
    return Array.from(this.articles.values())
      .filter(article => article.authorId === authorId)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(offset, offset + limit);
  }
  
  async getFeaturedArticles(limit = 4): Promise<Article[]> {
    return Array.from(this.articles.values())
      .filter(article => article.isFeatured === 1)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit);
  }
  
  async getBreakingNews(limit = 3): Promise<Article[]> {
    return Array.from(this.articles.values())
      .filter(article => article.isBreaking === 1)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit);
  }
  
  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    return Array.from(this.articles.values()).find(
      article => article.slug === slug
    );
  }
  
  async getArticleById(id: number): Promise<Article | undefined> {
    return this.articles.get(id);
  }
  
  async createArticle(article: InsertArticle): Promise<Article> {
    const id = this.articleId++;
    // Ensure required fields have default values if not provided
    const newArticle: Article = { 
      ...article, 
      id,
      isFeatured: article.isFeatured ?? 0,
      isBreaking: article.isBreaking ?? 0,
      publishedAt: article.publishedAt ?? new Date()
    };
    this.articles.set(id, newArticle);
    return newArticle;
  }
  
  async updateArticle(id: number, article: Partial<InsertArticle>): Promise<Article | undefined> {
    const existingArticle = this.articles.get(id);
    if (!existingArticle) return undefined;
    
    const updatedArticle = { ...existingArticle, ...article };
    this.articles.set(id, updatedArticle);
    return updatedArticle;
  }
  
  async deleteArticle(id: number): Promise<boolean> {
    return this.articles.delete(id);
  }
  
  async searchArticles(query: string, limit = 10): Promise<Article[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.articles.values())
      .filter(article => {
        return (
          article.title.toLowerCase().includes(lowercaseQuery) ||
          article.summary.toLowerCase().includes(lowercaseQuery) ||
          article.content.toLowerCase().includes(lowercaseQuery)
        );
      })
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit);
  }
  
  async getLatestArticles(limit = 5): Promise<Article[]> {
    return Array.from(this.articles.values())
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit);
  }
  
  async getMostReadArticles(limit = 5): Promise<Article[]> {
    // In a real application, this would be based on read counts
    // For this demo, we'll just return the latest articles
    return this.getLatestArticles(limit);
  }
  
  // User methods
  async createUser(user: InsertUser): Promise<User> {
    const id = this.userId++;
    const newUser: User = { 
      ...user, 
      id, 
      createdAt: new Date(),
      isAdmin: user.isAdmin ?? false
    };
    this.users.set(id, newUser);
    return newUser;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }
  
  async getUserById(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  // Comment methods
  async createComment(comment: InsertComment): Promise<Comment> {
    const id = this.commentId++;
    const newComment: Comment = { ...comment, id, createdAt: new Date() };
    this.comments.set(id, newComment);
    return newComment;
  }
  
  async getCommentsByArticle(articleId: number): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter(comment => comment.articleId === articleId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async deleteComment(id: number): Promise<boolean> {
    return this.comments.delete(id);
  }
  
  // Image methods
  async createImage(image: InsertImage): Promise<Image> {
    const id = this.imageId++;
    const newImage: Image = { ...image, id, uploadedAt: new Date() };
    this.images.set(id, newImage);
    return newImage;
  }
  
  async getImagesByArticle(articleId: number): Promise<Image[]> {
    return Array.from(this.images.values())
      .filter(image => image.articleId === articleId);
  }
  
  async deleteImage(id: number): Promise<boolean> {
    return this.images.delete(id);
  }
  
  // Author methods
  async getAuthors(): Promise<Author[]> {
    return Array.from(this.authors.values());
  }
  
  async getAuthorById(id: number): Promise<Author | undefined> {
    return this.authors.get(id);
  }
  
  async createAuthor(author: InsertAuthor): Promise<Author> {
    const id = this.authorId++;
    const newAuthor: Author = { 
      ...author, 
      id,
      imageUrl: author.imageUrl ?? null,
      bio: author.bio ?? null
    };
    this.authors.set(id, newAuthor);
    return newAuthor;
  }
  
  // Related stories methods
  async getRelatedStories(articleId: number): Promise<Article[]> {
    const relatedStoryIds = Array.from(this.relatedStories.values())
      .filter(rs => rs.articleId === articleId)
      .map(rs => rs.relatedArticleId);
    
    return Array.from(this.articles.values())
      .filter(article => relatedStoryIds.includes(article.id));
  }
  
  async addRelatedStory(relatedStory: InsertRelatedStory): Promise<RelatedStory> {
    const id = this.relatedStoryId++;
    const newRelatedStory: RelatedStory = { ...relatedStory, id };
    this.relatedStories.set(id, newRelatedStory);
    return newRelatedStory;
  }

  // Push notification subscription methods
  async createPushSubscription(subscription: InsertPushSubscription): Promise<PushSubscription> {
    const id = this.pushSubscriptionId++;
    const newSubscription = {
      endpoint: subscription.endpoint,
      p256dh: subscription.p256dh,
      auth: subscription.auth,
      userId: subscription.userId || null,
      categories: subscription.categories || [],
      id,
      createdAt: new Date(),
    } as PushSubscription;
    
    this.pushSubscriptions.set(id, newSubscription);
    return newSubscription;
  }

  async getPushSubscriptionByEndpoint(endpoint: string): Promise<PushSubscription | undefined> {
    return Array.from(this.pushSubscriptions.values()).find(
      subscription => subscription.endpoint === endpoint
    );
  }

  async getAllPushSubscriptions(): Promise<PushSubscription[]> {
    return Array.from(this.pushSubscriptions.values());
  }

  async getPushSubscriptionsByCategory(category: string): Promise<PushSubscription[]> {
    return Array.from(this.pushSubscriptions.values())
      .filter(subscription => 
        !subscription.categories || 
        subscription.categories.length === 0 || 
        subscription.categories.includes(category)
      );
  }

  async deletePushSubscription(endpoint: string): Promise<boolean> {
    const subscription = await this.getPushSubscriptionByEndpoint(endpoint);
    if (!subscription) return false;
    
    return this.pushSubscriptions.delete(subscription.id);
  }
}

export const storage = new MemStorage();