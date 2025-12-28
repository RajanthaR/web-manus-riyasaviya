import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock database functions
vi.mock("./db", () => ({
  saveChatMessage: vi.fn().mockResolvedValue(undefined),
  getChatHistory: vi.fn().mockResolvedValue([
    {
      id: 1,
      sessionId: "test-session",
      role: "user",
      content: "Vezel 2014 ekak ganna hodaida?",
      createdAt: new Date(),
    },
    {
      id: 2,
      sessionId: "test-session",
      role: "assistant",
      content: "2014 Vezel ගැන කියන්නම්...",
      createdAt: new Date(),
    },
  ]),
  getAllVehicleModels: vi.fn().mockResolvedValue([
    {
      id: 1,
      baseModel: "Honda Vezel",
      reliabilityScore: 6,
      commonProblems: [
        { issue: "DCT Issues", severity: "High", description: "DCT overheating" }
      ],
      fuelEfficiency: { city_kmpl: "12-15" },
      yearsToAvoid: ["2014", "2015"],
      bestYears: ["2018", "2019"],
    },
  ]),
  getGoodDeals: vi.fn().mockResolvedValue([
    {
      id: 1,
      model: "Toyota Vitz",
      baseModel: "Toyota Vitz",
      year: 2017,
      price: 5650000,
      location: "Colombo",
    },
  ]),
  getListingsByBudget: vi.fn().mockResolvedValue([
    {
      id: 2,
      model: "Suzuki Wagon R",
      baseModel: "Suzuki Wagon R",
      year: 2016,
      price: 3900000,
    },
  ]),
}));

// Mock LLM
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [
      {
        message: {
          content: "මචං, 2014 Vezel ගැන කියන්නම්. ඒකේ DCT Gearbox එකේ overheating issue එකක් තියෙනවා. 2014-2015 models avoid කරන්න."
        }
      }
    ]
  }),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("chat.sendMessage", () => {
  it("sends a message and receives a response", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.chat.sendMessage({
      message: "Vezel 2014 ekak ganna hodaida?",
      sessionId: "test-session-123",
    });

    expect(result.sessionId).toBe("test-session-123");
    expect(result.message).toBeDefined();
    expect(result.message.length).toBeGreaterThan(0);
  });

  it("generates a session ID if not provided", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.chat.sendMessage({
      message: "Hello",
    });

    expect(result.sessionId).toBeDefined();
    expect(result.sessionId.length).toBeGreaterThan(0);
  });

  it("responds in Sinhala with English technical terms", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.chat.sendMessage({
      message: "Vezel 2014 ekak ganna hodaida?",
    });

    // The mock response contains Sinhala text with English terms
    expect(result.message).toContain("DCT");
  });
});

describe("chat.getHistory", () => {
  it("returns chat history for a session", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.chat.getHistory({ sessionId: "test-session" });

    expect(result).toHaveLength(2);
    expect(result[0].role).toBe("user");
    expect(result[1].role).toBe("assistant");
  });
});
