import { useState, useEffect } from "react";
import { useSearch, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";
import { VehicleCard } from "@/components/VehicleCard";
import { SearchFilters, FilterState } from "@/components/SearchFilters";
import { ChatBot } from "@/components/ChatBot";
import { Car, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

export default function Vehicles() {
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);

  const [filters, setFilters] = useState<FilterState>(() => {
    const initial: FilterState = {};
    if (searchParams.get("baseModel")) initial.baseModel = searchParams.get("baseModel")!;
    if (searchParams.get("priceEvaluation")) {
      const pe = searchParams.get("priceEvaluation");
      if (pe === "good_deal" || pe === "fair_price" || pe === "overpriced") {
        initial.priceEvaluation = pe;
      }
    }
    return initial;
  });

  const [page, setPage] = useState(0);
  const limit = 12;

  const { data: listingsData, isLoading } = trpc.vehicle.getListings.useQuery({
    ...filters,
    limit,
    offset: page * limit,
  });

  const { data: models } = trpc.vehicle.getModels.useQuery();

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(0);
  };

  const totalPages = Math.ceil((listingsData?.total || 0) / limit);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-40">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <Car className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">RiyaSaviya</span>
            </div>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                මුල් පිටුව
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6 sinhala-text">වාහන සොයන්න</h1>

        {/* Search Filters */}
        <SearchFilters onFilterChange={handleFilterChange} initialFilters={filters} />

        {/* Results */}
        <div className="mt-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array(8)
                .fill(0)
                .map((_, i) => (
                  <Card key={i}>
                    <Skeleton className="h-48 w-full" />
                    <CardContent className="p-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-4" />
                      <Skeleton className="h-8 w-1/3" />
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : listingsData?.listings && listingsData.listings.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-muted-foreground sinhala-text">
                  {listingsData.total} වාහන සොයාගත්තා
                </p>
                {totalPages > 1 && (
                  <p className="text-sm text-muted-foreground">
                    පිටුව {page + 1} / {totalPages}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {listingsData.listings.map((listing) => (
                  <VehicleCard
                    key={listing.id}
                    {...listing}
                    reliabilityScore={
                      models?.find((m) => m.baseModel === listing.baseModel)?.reliabilityScore || 7
                    }
                    fuelEfficiency={
                      models?.find((m) => m.baseModel === listing.baseModel)?.fuelEfficiency as any
                    }
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum = i;
                    if (totalPages > 5) {
                      if (page < 3) {
                        pageNum = i;
                      } else if (page > totalPages - 3) {
                        pageNum = totalPages - 5 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? "default" : "outline"}
                        size="icon"
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum + 1}
                      </Button>
                    );
                  })}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Car className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground sinhala-text">
                ඔබේ සෙවුමට ගැලපෙන වාහන නැත
              </p>
              <Button variant="outline" onClick={() => setFilters({})} className="mt-4">
                පෙරහන් මකන්න
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Chatbot */}
      <ChatBot />
    </div>
  );
}
