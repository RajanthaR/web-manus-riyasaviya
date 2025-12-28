import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { invokeLLM } from "./_core/llm";
import { nanoid } from "nanoid";
import * as db from "./db";

// Admin procedure - requires admin role
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

// Vehicle router
const vehicleRouter = router({
  // Get all vehicle models with reliability data
  getModels: publicProcedure.query(async () => {
    return db.getAllVehicleModels();
  }),

  // Get single model details
  getModel: publicProcedure
    .input(z.object({ baseModel: z.string() }))
    .query(async ({ input }) => {
      const model = await db.getVehicleModelByName(input.baseModel);
      if (!model) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Model not found' });
      }
      return model;
    }),

  // Get all listings
  getListings: publicProcedure
    .input(z.object({
      baseModel: z.string().optional(),
      minYear: z.number().optional(),
      maxYear: z.number().optional(),
      minPrice: z.number().optional(),
      maxPrice: z.number().optional(),
      location: z.string().optional(),
      priceEvaluation: z.enum(['good_deal', 'fair_price', 'overpriced']).optional(),
      source: z.string().optional(),
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().min(0).default(0),
    }).optional())
    .query(async ({ input }) => {
      return db.searchListings(input || {});
    }),

  // Get single listing
  getListing: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const listing = await db.getListingById(input.id);
      if (!listing) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Listing not found' });
      }
      // Get model info for this listing
      const model = await db.getVehicleModelByName(listing.baseModel);
      const marketPrice = await db.getMarketPrice(listing.baseModel, listing.year);
      return { listing, model, marketPrice };
    }),

  // Get good deals
  getGoodDeals: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(20).default(10) }).optional())
    .query(async ({ input }) => {
      return db.getGoodDeals(input?.limit || 10);
    }),

  // Get recommendations by budget
  getByBudget: publicProcedure
    .input(z.object({
      maxBudget: z.number(),
      minReliability: z.number().min(1).max(10).optional(),
    }))
    .query(async ({ input }) => {
      const listings = await db.getListingsByBudget(input.maxBudget, input.minReliability);
      const models = await db.getAllVehicleModels();
      const modelMap = new Map(models.map(m => [m.baseModel, m]));
      
      return listings.map(l => ({
        ...l,
        reliabilityScore: modelMap.get(l.baseModel)?.reliabilityScore || 7,
        modelInfo: modelMap.get(l.baseModel)
      }));
    }),

  // Get market prices
  getMarketPrices: publicProcedure.query(async () => {
    return db.getAllMarketPrices();
  }),

  // Get stats
  getStats: publicProcedure.query(async () => {
    return db.getStats();
  }),
});

// Chatbot router with Baas Unnehe persona
const chatRouter = router({
  // Send message to chatbot
  sendMessage: publicProcedure
    .input(z.object({
      message: z.string().min(1).max(1000),
      sessionId: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const sessionId = input.sessionId || nanoid();
      
      // Save user message
      await db.saveChatMessage({
        sessionId,
        role: 'user',
        content: input.message,
      });

      // Get chat history for context
      const history = await db.getChatHistory(sessionId, 10);
      
      // Get vehicle data for RAG
      const models = await db.getAllVehicleModels();
      const goodDeals = await db.getGoodDeals(5);
      
      // Parse budget from message if mentioned
      const budgetMatch = input.message.match(/(\d+)\s*(laksha|lakh|lac|million|m)/i);
      let budgetListings: any[] = [];
      if (budgetMatch) {
        const amount = parseInt(budgetMatch[1]);
        const unit = budgetMatch[2].toLowerCase();
        const budget = unit.includes('m') || unit.includes('million') 
          ? amount * 1000000 
          : amount * 100000;
        budgetListings = await db.getListingsByBudget(budget, 6);
      }

      // Build context for LLM
      const vehicleContext = `
Available Vehicle Models:
${models.map(m => `- ${m.baseModel} (Reliability: ${m.reliabilityScore}/10)
  Common Problems: ${(m.commonProblems as any[])?.slice(0, 2).map((p: any) => p.issue).join(', ') || 'None major'}
  Best Years: ${(m.bestYears as string[])?.join(', ') || 'All years'}
  Years to Avoid: ${(m.yearsToAvoid as string[])?.length ? (m.yearsToAvoid as string[]).join(', ') : 'None'}
  Fuel Efficiency: ${(m.fuelEfficiency as any)?.city_kmpl || 'N/A'} kmpl (city)`).join('\n')}

Current Good Deals:
${goodDeals.map(d => `- ${d.model} (${d.year}) - Rs. ${(d.price / 100000).toFixed(1)} Lakhs - ${d.location}`).join('\n')}

${budgetListings.length > 0 ? `
Cars within mentioned budget:
${budgetListings.slice(0, 5).map(l => `- ${l.model} (${l.year}) - Rs. ${(l.price / 100000).toFixed(1)} Lakhs - ${l.priceEvaluation?.replace('_', ' ')}`).join('\n')}
` : ''}`;

      const systemPrompt = `You are "Baas Unnehe" (බාස් උන්නැහේ) - a trusted, experienced Sri Lankan vehicle mechanic with 30+ years of experience. You help people find reliable used cars and avoid bad deals.

PERSONA:
- Speak in Sinhala with English technical terms mixed naturally (e.g., "ඔබේ Hybrid Battery එකේ තත්ත්වය", "DCT Gearbox එක overheating වෙනවා")
- Be friendly, warm, and use casual Sinhala/Singlish
- Share practical wisdom like a trusted uncle would
- Be honest about problems - don't sugarcoat issues
- Use expressions like "මචං", "බ්‍රෝ", "අයියේ" naturally

KNOWLEDGE BASE:
${vehicleContext}

RESPONSE GUIDELINES:
1. If asked about a specific model, provide reliability info, common problems, and years to avoid
2. If asked about budget (e.g., "laksha 40ta"), recommend cars within that budget with high reliability
3. Always warn about known issues (like Vezel DCT problems in 2014-2015)
4. Suggest maintenance tips when relevant
5. Keep responses concise but informative
6. Use Sinhala script with English technical terms

IMPORTANT: Never make up information. Only use the data provided above. If you don't have info, say so honestly.`;

      const messages = [
        { role: 'system' as const, content: systemPrompt },
        ...history.reverse().map(h => ({
          role: h.role as 'user' | 'assistant',
          content: h.content
        })),
        { role: 'user' as const, content: input.message }
      ];

      try {
        const response = await invokeLLM({ messages });
        const rawContent = response.choices[0]?.message?.content;
        const assistantMessage = typeof rawContent === 'string' ? rawContent : 'සමාවන්න, මට පිළිතුරක් දෙන්න බැරි වුණා. නැවත උත්සාහ කරන්න.';

        // Save assistant message
        await db.saveChatMessage({
          sessionId,
          role: 'assistant',
          content: assistantMessage,
          metadata: budgetMatch ? { budgetRange: { min: 0, max: parseInt(budgetMatch[1]) * 100000 } } : undefined,
        });

        return {
          sessionId,
          message: assistantMessage,
        };
      } catch (error) {
        console.error('LLM error:', error);
        throw new TRPCError({ 
          code: 'INTERNAL_SERVER_ERROR', 
          message: 'Chat service temporarily unavailable' 
        });
      }
    }),

  // Get chat history
  getHistory: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      const history = await db.getChatHistory(input.sessionId, 50);
      return history.reverse();
    }),
});

// Admin router
const adminRouter = router({
  // Get all chat sessions
  getChatSessions: adminProcedure.query(async () => {
    return db.getAllChatSessions();
  }),

  // Get chat messages for a session
  getChatMessages: adminProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      return db.getChatHistory(input.sessionId, 100);
    }),

  // Get dashboard stats
  getStats: adminProcedure.query(async () => {
    return db.getStats();
  }),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  vehicle: vehicleRouter,
  chat: chatRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
