import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json, decimal, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Vehicle models with reliability data
 */
export const vehicleModels = mysqlTable("vehicle_models", {
  id: int("id").autoincrement().primaryKey(),
  baseModel: varchar("baseModel", { length: 100 }).notNull().unique(),
  alsoKnownAs: varchar("alsoKnownAs", { length: 255 }),
  reliabilityScore: int("reliabilityScore").notNull().default(7),
  commonProblems: json("commonProblems").$type<Array<{
    issue: string;
    severity: string;
    description: string;
  }>>(),
  fuelEfficiency: json("fuelEfficiency").$type<{
    city_kmpl: string;
    highway_kmpl: string;
    hybrid_kmpl: string;
  }>(),
  safetyRating: json("safetyRating").$type<{
    euro_ncap?: string;
    jncap?: string;
    asean_ncap?: string;
    global_ncap?: string;
    notes: string;
  }>(),
  maintenanceTips: json("maintenanceTips").$type<string[]>(),
  yearsToAvoid: json("yearsToAvoid").$type<string[]>(),
  bestYears: json("bestYears").$type<string[]>(),
  recallInfo: text("recallInfo"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type VehicleModel = typeof vehicleModels.$inferSelect;
export type InsertVehicleModel = typeof vehicleModels.$inferInsert;

/**
 * Vehicle listings from scraped sources
 */
export const vehicleListings = mysqlTable("vehicle_listings", {
  id: int("id").autoincrement().primaryKey(),
  model: varchar("model", { length: 255 }).notNull(),
  baseModel: varchar("baseModel", { length: 100 }).notNull(),
  normalizedModel: varchar("normalizedModel", { length: 255 }),
  year: int("year").notNull(),
  price: int("price").notNull(),
  mileage: int("mileage"),
  location: varchar("location", { length: 100 }),
  source: varchar("source", { length: 50 }).notNull(),
  priceEvaluation: mysqlEnum("priceEvaluation", ["good_deal", "fair_price", "overpriced", "unknown"]).default("unknown"),
  imageUrl: varchar("imageUrl", { length: 500 }),
  sourceUrl: varchar("sourceUrl", { length: 500 }),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type VehicleListing = typeof vehicleListings.$inferSelect;
export type InsertVehicleListing = typeof vehicleListings.$inferInsert;

/**
 * Market prices by model and year
 */
export const marketPrices = mysqlTable("market_prices", {
  id: int("id").autoincrement().primaryKey(),
  baseModel: varchar("baseModel", { length: 100 }).notNull(),
  year: int("year").notNull(),
  averagePrice: int("averagePrice").notNull(),
  medianPrice: int("medianPrice"),
  minPrice: int("minPrice"),
  maxPrice: int("maxPrice"),
  stdDev: int("stdDev"),
  sampleSize: int("sampleSize").notNull().default(0),
  priceRangeLow: int("priceRangeLow"),
  priceRangeHigh: int("priceRangeHigh"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MarketPrice = typeof marketPrices.$inferSelect;
export type InsertMarketPrice = typeof marketPrices.$inferInsert;

/**
 * Chat history for RAG chatbot
 */
export const chatHistory = mysqlTable("chat_history", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("sessionId", { length: 64 }).notNull(),
  userId: int("userId"),
  role: mysqlEnum("role", ["user", "assistant"]).notNull(),
  content: text("content").notNull(),
  metadata: json("metadata").$type<{
    vehiclesQueried?: string[];
    budgetRange?: { min: number; max: number };
    intent?: string;
  }>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatMessage = typeof chatHistory.$inferSelect;
export type InsertChatMessage = typeof chatHistory.$inferInsert;
