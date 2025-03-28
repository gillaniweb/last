import { pgTable, text, serial, integer, timestamp, varchar, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Categories for news articles
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
});

// News articles
export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url").notNull(),
  authorId: integer("author_id").notNull(),
  categoryId: integer("category_id").notNull(),
  isFeatured: integer("is_featured").default(0).notNull(),
  isBreaking: integer("is_breaking").default(0).notNull(),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
});

// Authors of news articles
export const authors = pgTable("authors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  imageUrl: text("image_url"),
  bio: text("bio"),
});

// Related stories for articles
export const relatedStories = pgTable("related_stories", {
  id: serial("id").primaryKey(),
  articleId: integer("article_id").notNull(),
  relatedArticleId: integer("related_article_id").notNull(),
});

// Insert schemas
export const insertCategorySchema = createInsertSchema(categories).omit({ id: true });
export const insertArticleSchema = createInsertSchema(articles).omit({ id: true });
export const insertAuthorSchema = createInsertSchema(authors).omit({ id: true });
export const insertRelatedStorySchema = createInsertSchema(relatedStories).omit({ id: true });

// Types
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Article = typeof articles.$inferSelect;
export type InsertArticle = z.infer<typeof insertArticleSchema>;

export type Author = typeof authors.$inferSelect;
export type InsertAuthor = z.infer<typeof insertAuthorSchema>;

export type RelatedStory = typeof relatedStories.$inferSelect;
export type InsertRelatedStory = z.infer<typeof insertRelatedStorySchema>;

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Comments table
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  userId: integer("user_id").notNull(),
  articleId: integer("article_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Image uploads table
export const images = pgTable("images", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  articleId: integer("article_id").notNull(),
  uploadedAt: timestamp("uploaded_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertCommentSchema = createInsertSchema(comments).omit({ id: true, createdAt: true });
export const insertImageSchema = createInsertSchema(images).omit({ id: true, uploadedAt: true });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;

export type Image = typeof images.$inferSelect;
export type InsertImage = z.infer<typeof insertImageSchema>;

