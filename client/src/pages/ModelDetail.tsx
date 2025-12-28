import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";
import { VehicleCard } from "@/components/VehicleCard";
import { ChatBot } from "@/components/ChatBot";
import {
  ArrowLeft,
  Car,
  Fuel,
  Shield,
  AlertTriangle,
  CheckCircle,
  Star,
  Wrench,
  TrendingUp,
} from "lucide-react";

const getReliabilityColor = (score: number) => {
  if (score >= 8) return "text-green-600";
  if (score >= 6) return "text-yellow-600";
  return "text-red-600";
};

const getSeverityColor = (severity: string) => {
  switch (severity.toLowerCase()) {
    case "high":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case "medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "low":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const formatPrice = (price: number) => {
  if (price >= 1000000) {
    return `Rs. ${(price / 1000000).toFixed(2)}M`;
  }
  return `Rs. ${(price / 100000).toFixed(1)}L`;
};

export default function ModelDetail() {
  const params = useParams<{ baseModel: string }>();
  const baseModel = decodeURIComponent(params.baseModel || "");

  const { data: model, isLoading: modelLoading } = trpc.vehicle.getModel.useQuery(
    { baseModel },
    { enabled: !!baseModel }
  );

  const { data: listingsData, isLoading: listingsLoading } = trpc.vehicle.getListings.useQuery(
    { baseModel, limit: 8 },
    { enabled: !!baseModel }
  );

  const { data: marketPrices } = trpc.vehicle.getMarketPrices.useQuery();

  const modelPrices = marketPrices?.filter((p) => p.baseModel === baseModel) || [];

  if (modelLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <Skeleton className="h-12 w-64 mb-4" />
          <Skeleton className="h-6 w-48 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-[300px] w-full rounded-lg" />
            </div>
            <div>
              <Skeleton className="h-[200px] w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Car className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Model එක සොයාගත නොහැක</h1>
          <p className="text-muted-foreground mb-4">Model not found</p>
          <Link href="/">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              මුල් පිටුවට
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const commonProblems = model.commonProblems as Array<{
    issue: string;
    severity: string;
    description: string;
  }> | null;
  const fuelEfficiency = model.fuelEfficiency as {
    city_kmpl?: string;
    highway_kmpl?: string;
    hybrid_kmpl?: string;
  } | null;
  const safetyRating = model.safetyRating as {
    euro_ncap?: string;
    jncap?: string;
    asean_ncap?: string;
    global_ncap?: string;
    notes?: string;
  } | null;
  const maintenanceTips = model.maintenanceTips as string[] | null;
  const yearsToAvoid = model.yearsToAvoid as string[] | null;
  const bestYears = model.bestYears as string[] | null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-40">
        <div className="container flex h-16 items-center">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              ආපසු
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{model.baseModel}</h1>
              <p className="text-muted-foreground">{model.alsoKnownAs}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div
                  className={`text-5xl font-bold ${getReliabilityColor(model.reliabilityScore)}`}
                >
                  {model.reliabilityScore}
                </div>
                <p className="text-sm text-muted-foreground">Reliability Score</p>
              </div>
              <div className="flex flex-col gap-1">
                {Array(10)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 w-8 rounded ${
                        i < model.reliabilityScore
                          ? model.reliabilityScore >= 8
                            ? "bg-green-500"
                            : model.reliabilityScore >= 6
                            ? "bg-yellow-500"
                            : "bg-red-500"
                          : "bg-gray-200"
                      }`}
                    />
                  ))
                  .reverse()}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Common Problems */}
            {commonProblems && commonProblems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 sinhala-text">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    පොදු ගැටලු (Common Problems)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {commonProblems.map((problem, index) => (
                    <div key={index} className="border-l-4 border-yellow-500 pl-4 py-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{problem.issue}</span>
                        <Badge className={getSeverityColor(problem.severity)}>
                          {problem.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{problem.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Safety Rating */}
            {safetyRating && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 sinhala-text">
                    <Shield className="h-5 w-5 text-blue-600" />
                    ආරක්ෂිත ශ්‍රේණිගත කිරීම් (Safety Ratings)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {safetyRating.euro_ncap && (
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Euro NCAP</p>
                        <p className="font-bold text-lg">{safetyRating.euro_ncap}</p>
                      </div>
                    )}
                    {safetyRating.jncap && (
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">JNCAP</p>
                        <p className="font-bold text-lg">{safetyRating.jncap}</p>
                      </div>
                    )}
                    {safetyRating.asean_ncap && (
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">ASEAN NCAP</p>
                        <p className="font-bold text-lg">{safetyRating.asean_ncap}</p>
                      </div>
                    )}
                    {safetyRating.global_ncap && (
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Global NCAP</p>
                        <p className="font-bold text-lg">{safetyRating.global_ncap}</p>
                      </div>
                    )}
                  </div>
                  {safetyRating.notes && (
                    <p className="text-sm text-muted-foreground mt-4">{safetyRating.notes}</p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Maintenance Tips */}
            {maintenanceTips && maintenanceTips.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 sinhala-text">
                    <Wrench className="h-5 w-5 text-primary" />
                    නඩත්තු උපදෙස් (Maintenance Tips)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {maintenanceTips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Market Prices by Year */}
            {modelPrices.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 sinhala-text">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    වර්ෂය අනුව වෙළඳපොළ මිල (Market Prices by Year)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-4">වර්ෂය</th>
                          <th className="text-right py-2 px-4">සාමාන්‍ය මිල</th>
                          <th className="text-right py-2 px-4">පරාසය</th>
                          <th className="text-right py-2 px-4">සාම්පල</th>
                        </tr>
                      </thead>
                      <tbody>
                        {modelPrices
                          .sort((a, b) => b.year - a.year)
                          .map((price) => (
                            <tr key={price.id} className="border-b hover:bg-muted/50">
                              <td className="py-2 px-4 font-medium">{price.year}</td>
                              <td className="py-2 px-4 text-right">
                                {formatPrice(price.averagePrice)}
                              </td>
                              <td className="py-2 px-4 text-right text-sm text-muted-foreground">
                                {formatPrice(price.minPrice || 0)} -{" "}
                                {formatPrice(price.maxPrice || 0)}
                              </td>
                              <td className="py-2 px-4 text-right text-sm text-muted-foreground">
                                {price.sampleSize}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Available Listings */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold sinhala-text">
                  ලබා ගත හැකි {model.baseModel} වාහන
                </h2>
                <Link href={`/vehicles?baseModel=${encodeURIComponent(model.baseModel)}`}>
                  <Button variant="outline" size="sm">
                    සියල්ල බලන්න
                  </Button>
                </Link>
              </div>
              {listingsLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <Card key={i}>
                        <Skeleton className="h-48 w-full" />
                        <CardContent className="p-4">
                          <Skeleton className="h-6 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-1/2" />
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ) : listingsData?.listings && listingsData.listings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {listingsData.listings.map((listing) => (
                    <VehicleCard
                      key={listing.id}
                      {...listing}
                      reliabilityScore={model.reliabilityScore}
                      fuelEfficiency={fuelEfficiency}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground sinhala-text">
                      දැනට ලබා ගත හැකි {model.baseModel} වාහන නැත
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Fuel Efficiency */}
            {fuelEfficiency && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 sinhala-text">
                    <Fuel className="h-5 w-5 text-green-600" />
                    ඉන්ධන කාර්යක්ෂමතාව
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fuelEfficiency.city_kmpl && (
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="text-muted-foreground">City Driving</span>
                      <span className="font-bold text-lg">{fuelEfficiency.city_kmpl} kmpl</span>
                    </div>
                  )}
                  {fuelEfficiency.highway_kmpl && (
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="text-muted-foreground">Highway</span>
                      <span className="font-bold text-lg">{fuelEfficiency.highway_kmpl} kmpl</span>
                    </div>
                  )}
                  {fuelEfficiency.hybrid_kmpl && (
                    <div className="flex justify-between items-center p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <span className="text-green-700 dark:text-green-300">Hybrid Mode</span>
                      <span className="font-bold text-lg text-green-700 dark:text-green-300">
                        {fuelEfficiency.hybrid_kmpl} kmpl
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Years Guide */}
            <Card>
              <CardHeader>
                <CardTitle className="sinhala-text">වර්ෂ මාර්ගෝපදේශය</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {bestYears && bestYears.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      හොඳම වර්ෂ (Best Years)
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {bestYears.map((year) => (
                        <Badge key={year} className="bg-green-100 text-green-800">
                          {year}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {yearsToAvoid && yearsToAvoid.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      වළකින්න (Years to Avoid)
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {yearsToAvoid.map((year) => (
                        <Badge key={year} className="bg-red-100 text-red-800">
                          {year}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {(!yearsToAvoid || yearsToAvoid.length === 0) && (
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    වළකින්න යුතු විශේෂ වර්ෂ නැත
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Recall Info */}
            {model.recallInfo && (
              <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700 sinhala-text">
                    <AlertTriangle className="h-5 w-5" />
                    Recall තොරතුරු
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{model.recallInfo}</p>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="sinhala-text">ඉක්මන් සාරාංශය</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ලබා ගත හැකි වාහන</span>
                  <span className="font-semibold">{listingsData?.total || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">මිල දත්ත වර්ෂ</span>
                  <span className="font-semibold">{modelPrices.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reliability</span>
                  <span className={`font-semibold ${getReliabilityColor(model.reliabilityScore)}`}>
                    {model.reliabilityScore >= 8
                      ? "ඉහළ"
                      : model.reliabilityScore >= 6
                      ? "මධ්‍යම"
                      : "අඩු"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Chatbot */}
      <ChatBot />
    </div>
  );
}
