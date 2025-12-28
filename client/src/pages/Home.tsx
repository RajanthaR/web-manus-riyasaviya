import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";
import { VehicleCard } from "@/components/VehicleCard";
import { SearchFilters, FilterState } from "@/components/SearchFilters";
import { ChatBot } from "@/components/ChatBot";
import { Link } from "wouter";
import {
  Car,
  Shield,
  TrendingUp,
  MessageCircle,
  Star,
  ChevronRight,
  Fuel,
  AlertTriangle,
} from "lucide-react";

export default function Home() {
  const [filters, setFilters] = useState<FilterState>({});

  const { data: listingsData, isLoading: listingsLoading } = trpc.vehicle.getListings.useQuery(
    {
      ...filters,
      limit: 12,
    }
  );

  const { data: models, isLoading: modelsLoading } = trpc.vehicle.getModels.useQuery();
  const { data: goodDeals } = trpc.vehicle.getGoodDeals.useQuery({ limit: 4 });
  const { data: stats } = trpc.vehicle.getStats.useQuery();

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

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
            <Link href="/vehicles">
              <Button variant="ghost" className="sinhala-text">වාහන</Button>
            </Link>
            <Link href="/models">
              <Button variant="ghost" className="sinhala-text">Model තොරතුරු</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 sinhala-text">
              විශ්වසනීය Used Car එකක් සොයන්න
            </h1>
            <p className="text-xl text-muted-foreground mb-8 sinhala-text">
              ශ්‍රී ලංකාවේ Toyota Vitz, Suzuki Wagon R, Honda Vezel, Toyota Axio
              වාහන සඳහා Reliability Ratings, Market Prices සහ Expert Advice
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="text-sm py-1 px-3">
                <Shield className="h-4 w-4 mr-1" />
                Reliability Scores
              </Badge>
              <Badge variant="secondary" className="text-sm py-1 px-3">
                <TrendingUp className="h-4 w-4 mr-1" />
                Market Price Analysis
              </Badge>
              <Badge variant="secondary" className="text-sm py-1 px-3">
                <MessageCircle className="h-4 w-4 mr-1" />
                Expert Chatbot
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {stats && (
        <section className="py-8 border-b">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-primary">{stats.totalListings}</p>
                  <p className="text-sm text-muted-foreground sinhala-text">වාහන ලැයිස්තු</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-primary">{stats.totalModels}</p>
                  <p className="text-sm text-muted-foreground sinhala-text">Model වර්ග</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-green-600">{stats.goodDeals}</p>
                  <p className="text-sm text-muted-foreground sinhala-text">හොඳ ගනුදෙනු</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-primary">{stats.totalChats}</p>
                  <p className="text-sm text-muted-foreground sinhala-text">Chat පණිවිඩ</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Good Deals Section */}
      {goodDeals && goodDeals.length > 0 && (
        <section className="py-12 bg-green-50 dark:bg-green-950/20">
          <div className="container">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2 sinhala-text">
                  <Star className="h-6 w-6 text-yellow-500" />
                  හොඳම ගනුදෙනු (Good Deals)
                </h2>
                <p className="text-muted-foreground sinhala-text">
                  Market Price එකට වඩා අඩු මිලට ඇති වාහන
                </p>
              </div>
              <Link href="/vehicles?priceEvaluation=good_deal">
                <Button variant="outline" className="gap-2">
                  සියල්ල බලන්න
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {goodDeals.map((listing) => (
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
          </div>
        </section>
      )}

      {/* Model Overview Section */}
      <section className="py-12">
        <div className="container">
          <h2 className="text-2xl font-bold mb-6 sinhala-text">Model තොරතුරු සාරාංශය</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {modelsLoading ? (
              Array(4)
                .fill(0)
                .map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <Skeleton className="h-6 w-32 mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </CardContent>
                  </Card>
                ))
            ) : (
              models?.map((model) => (
                <Link key={model.id} href={`/model/${encodeURIComponent(model.baseModel)}`}>
                  <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center justify-between">
                        {model.baseModel}
                        <Badge
                          className={
                            model.reliabilityScore >= 8
                              ? "bg-green-100 text-green-800"
                              : model.reliabilityScore >= 6
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {model.reliabilityScore}/10
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-2">{model.alsoKnownAs}</p>
                      <div className="flex items-center gap-2 text-sm">
                        <Fuel className="h-4 w-4 text-green-600" />
                        <span>
                          {(model.fuelEfficiency as any)?.city_kmpl || "N/A"} kmpl (city)
                        </span>
                      </div>
                      {(model.yearsToAvoid as string[])?.length > 0 && (
                        <div className="flex items-center gap-2 text-sm mt-1 text-red-600">
                          <AlertTriangle className="h-4 w-4" />
                          <span>Avoid: {(model.yearsToAvoid as string[]).join(", ")}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Search & Listings Section */}
      <section className="py-12 bg-muted/30">
        <div className="container">
          <h2 className="text-2xl font-bold mb-6 sinhala-text">වාහන සොයන්න</h2>
          <SearchFilters onFilterChange={handleFilterChange} initialFilters={filters} />

          <div className="mt-8">
            {listingsLoading ? (
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
                <p className="text-muted-foreground mb-4 sinhala-text">
                  {listingsData.total} වාහන සොයාගත්තා
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {listingsData.listings.map((listing) => (
                    <VehicleCard
                      key={listing.id}
                      {...listing}
                      reliabilityScore={
                        models?.find((m) => m.baseModel === listing.baseModel)?.reliabilityScore ||
                        7
                      }
                      fuelEfficiency={
                        models?.find((m) => m.baseModel === listing.baseModel)
                          ?.fuelEfficiency as any
                      }
                    />
                  ))}
                </div>
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
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-card">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Car className="h-6 w-6 text-primary" />
              <span className="font-bold">RiyaSaviya</span>
            </div>
            <p className="text-sm text-muted-foreground sinhala-text">
              ශ්‍රී ලංකාවේ විශ්වසනීය Used Vehicle Marketplace
            </p>
          </div>
        </div>
      </footer>

      {/* Chatbot */}
      <ChatBot />
    </div>
  );
}
