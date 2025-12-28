import { eq, and, gte, lte, like, or, desc, asc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, vehicleModels, vehicleListings, marketPrices, chatHistory, InsertVehicleListing, InsertVehicleModel, InsertMarketPrice, InsertChatMessage } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// User functions
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Vehicle Models functions
export async function getAllVehicleModels() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(vehicleModels);
}

export async function getVehicleModelByName(baseModel: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(vehicleModels).where(eq(vehicleModels.baseModel, baseModel)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Vehicle Listings functions
export async function getAllListings() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(vehicleListings).where(eq(vehicleListings.isActive, true)).orderBy(desc(vehicleListings.createdAt));
}

export async function getListingById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(vehicleListings).where(eq(vehicleListings.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function searchListings(filters: {
  baseModel?: string;
  minYear?: number;
  maxYear?: number;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  priceEvaluation?: string;
  source?: string;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return { listings: [], total: 0 };

  const conditions = [eq(vehicleListings.isActive, true)];
  
  if (filters.baseModel) {
    conditions.push(eq(vehicleListings.baseModel, filters.baseModel));
  }
  if (filters.minYear) {
    conditions.push(gte(vehicleListings.year, filters.minYear));
  }
  if (filters.maxYear) {
    conditions.push(lte(vehicleListings.year, filters.maxYear));
  }
  if (filters.minPrice) {
    conditions.push(gte(vehicleListings.price, filters.minPrice));
  }
  if (filters.maxPrice) {
    conditions.push(lte(vehicleListings.price, filters.maxPrice));
  }
  if (filters.location) {
    conditions.push(like(vehicleListings.location, `%${filters.location}%`));
  }
  if (filters.priceEvaluation) {
    conditions.push(eq(vehicleListings.priceEvaluation, filters.priceEvaluation as any));
  }
  if (filters.source) {
    conditions.push(eq(vehicleListings.source, filters.source));
  }

  const whereClause = and(...conditions);
  
  const listings = await db.select()
    .from(vehicleListings)
    .where(whereClause)
    .orderBy(desc(vehicleListings.createdAt))
    .limit(filters.limit || 20)
    .offset(filters.offset || 0);

  const countResult = await db.select({ count: sql<number>`count(*)` })
    .from(vehicleListings)
    .where(whereClause);
  
  return {
    listings,
    total: countResult[0]?.count || 0
  };
}

export async function getListingsByBudget(maxBudget: number, minReliability?: number) {
  const db = await getDb();
  if (!db) return [];

  const listings = await db.select()
    .from(vehicleListings)
    .where(and(
      eq(vehicleListings.isActive, true),
      lte(vehicleListings.price, maxBudget)
    ))
    .orderBy(asc(vehicleListings.price));

  if (minReliability) {
    const models = await getAllVehicleModels();
    const modelScores = new Map(models.map(m => [m.baseModel, m.reliabilityScore]));
    return listings.filter(l => (modelScores.get(l.baseModel) || 0) >= minReliability);
  }

  return listings;
}

export async function getGoodDeals(limit = 10) {
  const db = await getDb();
  if (!db) return [];
  return db.select()
    .from(vehicleListings)
    .where(and(
      eq(vehicleListings.isActive, true),
      eq(vehicleListings.priceEvaluation, 'good_deal')
    ))
    .orderBy(desc(vehicleListings.createdAt))
    .limit(limit);
}

// Market Prices functions
export async function getMarketPrice(baseModel: string, year: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select()
    .from(marketPrices)
    .where(and(
      eq(marketPrices.baseModel, baseModel),
      eq(marketPrices.year, year)
    ))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllMarketPrices() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(marketPrices).orderBy(marketPrices.baseModel, marketPrices.year);
}

// Chat History functions
export async function saveChatMessage(message: InsertChatMessage) {
  const db = await getDb();
  if (!db) return;
  await db.insert(chatHistory).values(message);
}

export async function getChatHistory(sessionId: string, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db.select()
    .from(chatHistory)
    .where(eq(chatHistory.sessionId, sessionId))
    .orderBy(desc(chatHistory.createdAt))
    .limit(limit);
}

export async function getAllChatSessions(limit = 50) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select({
    sessionId: chatHistory.sessionId,
    messageCount: sql<number>`count(*)`,
    lastMessage: sql<Date>`max(${chatHistory.createdAt})`
  })
    .from(chatHistory)
    .groupBy(chatHistory.sessionId)
    .orderBy(desc(sql`max(${chatHistory.createdAt})`))
    .limit(limit);
  
  return result;
}

// Stats functions
export async function getStats() {
  const db = await getDb();
  if (!db) return null;

  const [listingCount] = await db.select({ count: sql<number>`count(*)` }).from(vehicleListings).where(eq(vehicleListings.isActive, true));
  const [modelCount] = await db.select({ count: sql<number>`count(*)` }).from(vehicleModels);
  const [goodDealCount] = await db.select({ count: sql<number>`count(*)` }).from(vehicleListings).where(and(eq(vehicleListings.isActive, true), eq(vehicleListings.priceEvaluation, 'good_deal')));
  const [chatCount] = await db.select({ count: sql<number>`count(*)` }).from(chatHistory);

  return {
    totalListings: listingCount?.count || 0,
    totalModels: modelCount?.count || 0,
    goodDeals: goodDealCount?.count || 0,
    totalChats: chatCount?.count || 0
  };
}
