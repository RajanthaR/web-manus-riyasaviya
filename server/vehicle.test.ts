import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock database functions
vi.mock("./db", () => ({
  getAllVehicleModels: vi.fn().mockResolvedValue([
    {
      id: 1,
      baseModel: "Toyota Vitz",
      alsoKnownAs: "Toyota Yaris",
      reliabilityScore: 8,
      commonProblems: [
        { issue: "CVT Issues", severity: "Medium", description: "CVT can slip" }
      ],
      fuelEfficiency: { city_kmpl: "14-16", highway_kmpl: "17-20" },
      safetyRating: { jncap: "5 stars" },
      maintenanceTips: ["Regular CVT fluid changes"],
      yearsToAvoid: ["2009"],
      bestYears: ["2017", "2018"],
    },
  ]),
  getVehicleModelByName: vi.fn().mockImplementation((baseModel: string) => {
    if (baseModel === "Toyota Vitz") {
      return Promise.resolve({
        id: 1,
        baseModel: "Toyota Vitz",
        reliabilityScore: 8,
        commonProblems: [],
        fuelEfficiency: { city_kmpl: "14-16" },
      });
    }
    return Promise.resolve(undefined);
  }),
  searchListings: vi.fn().mockResolvedValue({
    listings: [
      {
        id: 1,
        model: "Toyota Vitz F Grade",
        baseModel: "Toyota Vitz",
        year: 2018,
        price: 6150000,
        mileage: 48000,
        location: "Colombo",
        source: "riyasewana",
        priceEvaluation: "fair_price",
        isActive: true,
      },
    ],
    total: 1,
  }),
  getListingById: vi.fn().mockImplementation((id: number) => {
    if (id === 1) {
      return Promise.resolve({
        id: 1,
        model: "Toyota Vitz F Grade",
        baseModel: "Toyota Vitz",
        year: 2018,
        price: 6150000,
        mileage: 48000,
        location: "Colombo",
        source: "riyasewana",
        priceEvaluation: "fair_price",
      });
    }
    return Promise.resolve(undefined);
  }),
  getGoodDeals: vi.fn().mockResolvedValue([
    {
      id: 2,
      model: "Toyota Vitz",
      baseModel: "Toyota Vitz",
      year: 2017,
      price: 5650000,
      priceEvaluation: "good_deal",
    },
  ]),
  getListingsByBudget: vi.fn().mockResolvedValue([
    {
      id: 3,
      model: "Suzuki Wagon R",
      baseModel: "Suzuki Wagon R",
      year: 2016,
      price: 5690000,
    },
  ]),
  getMarketPrice: vi.fn().mockResolvedValue({
    baseModel: "Toyota Vitz",
    year: 2018,
    averagePrice: 6250000,
    minPrice: 5800000,
    maxPrice: 6700000,
  }),
  getAllMarketPrices: vi.fn().mockResolvedValue([
    { baseModel: "Toyota Vitz", year: 2018, averagePrice: 6250000 },
  ]),
  getStats: vi.fn().mockResolvedValue({
    totalListings: 50,
    totalModels: 4,
    goodDeals: 9,
    totalChats: 0,
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

describe("vehicle.getModels", () => {
  it("returns all vehicle models", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.vehicle.getModels();

    expect(result).toHaveLength(1);
    expect(result[0].baseModel).toBe("Toyota Vitz");
    expect(result[0].reliabilityScore).toBe(8);
  });
});

describe("vehicle.getModel", () => {
  it("returns a specific model by name", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.vehicle.getModel({ baseModel: "Toyota Vitz" });

    expect(result.baseModel).toBe("Toyota Vitz");
    expect(result.reliabilityScore).toBe(8);
  });

  it("throws NOT_FOUND for unknown model", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.vehicle.getModel({ baseModel: "Unknown Model" })
    ).rejects.toThrow("Model not found");
  });
});

describe("vehicle.getListings", () => {
  it("returns paginated listings", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.vehicle.getListings({ limit: 10 });

    expect(result.listings).toHaveLength(1);
    expect(result.total).toBe(1);
    expect(result.listings[0].baseModel).toBe("Toyota Vitz");
  });

  it("accepts filter parameters", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.vehicle.getListings({
      baseModel: "Toyota Vitz",
      minYear: 2017,
      maxYear: 2020,
      minPrice: 5000000,
      maxPrice: 7000000,
      priceEvaluation: "fair_price",
    });

    expect(result.listings).toBeDefined();
  });
});

describe("vehicle.getListing", () => {
  it("returns listing with model and market price info", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.vehicle.getListing({ id: 1 });

    expect(result.listing.id).toBe(1);
    expect(result.listing.baseModel).toBe("Toyota Vitz");
    expect(result.model).toBeDefined();
    expect(result.marketPrice).toBeDefined();
  });

  it("throws NOT_FOUND for unknown listing", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.vehicle.getListing({ id: 9999 })
    ).rejects.toThrow("Listing not found");
  });
});

describe("vehicle.getGoodDeals", () => {
  it("returns good deal listings", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.vehicle.getGoodDeals({ limit: 5 });

    expect(result).toHaveLength(1);
    expect(result[0].priceEvaluation).toBe("good_deal");
  });
});

describe("vehicle.getByBudget", () => {
  it("returns listings within budget", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.vehicle.getByBudget({ maxBudget: 6000000 });

    expect(result).toHaveLength(1);
    expect(result[0].price).toBeLessThanOrEqual(6000000);
  });
});

describe("vehicle.getStats", () => {
  it("returns platform statistics", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.vehicle.getStats();

    expect(result).toEqual({
      totalListings: 50,
      totalModels: 4,
      goodDeals: 9,
      totalChats: 0,
    });
  });
});
