import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/trpc";
import { ChatBot } from "@/components/ChatBot";
import {
  ArrowLeft,
  Car,
  Calendar,
  MapPin,
  Gauge,
  Fuel,
  Shield,
  AlertTriangle,
  CheckCircle,
  Star,
  Wrench,
  ExternalLink,
} from "lucide-react";

const priceLabels: Record<string, { label: string; labelSi: string; class: string }> = {
  good_deal: { label: "Good Deal", labelSi: "හොඳ ගනුදෙනුවක්", class: "badge-good-deal" },
  fair_price: { label: "Fair Price", labelSi: "සාධාරණ මිල", class: "badge-fair-price" },
  overpriced: { label: "Overpriced", labelSi: "අධික මිල", class: "badge-overpriced" },
};

const formatPrice = (price: number) => {
  if (price >= 1000000) {
    return `Rs. ${(price / 1000000).toFixed(2)} Million`;
  }
  return `Rs. ${(price / 100000).toFixed(1)} Lakhs`;
};

const formatMileage = (mileage: number) => {
  return `${mileage.toLocaleString()} km`;
};

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

// Placeholder car images based on model
const getCarImage = (baseModel: string) => {
  const images: Record<string, string> = {
    "Toyota Vitz": "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=500&fit=crop",
    "Suzuki Wagon R": "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=500&fit=crop",
    "Honda Vezel": "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=500&fit=crop",
    "Toyota Axio": "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=500&fit=crop",
  };
  return images[baseModel] || "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=500&fit=crop";
};

export default function VehicleDetail() {
  const params = useParams<{ id: string }>();
  const vehicleId = parseInt(params.id || "0");

  const { data, isLoading, error } = trpc.vehicle.getListing.useQuery(
    { id: vehicleId },
    { enabled: vehicleId > 0 }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-[400px] w-full rounded-lg mb-6" />
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-6 w-1/2" />
            </div>
            <div>
              <Skeleton className="h-[300px] w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Car className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">වාහනය සොයාගත නොහැක</h1>
          <p className="text-muted-foreground mb-4">Vehicle not found</p>
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

  const { listing, model, marketPrice } = data;
  const priceInfo = listing.priceEvaluation ? priceLabels[listing.priceEvaluation] : null;
  const commonProblems = model?.commonProblems as Array<{
    issue: string;
    severity: string;
    description: string;
  }> | null;
  const fuelEfficiency = model?.fuelEfficiency as {
    city_kmpl?: string;
    highway_kmpl?: string;
    hybrid_kmpl?: string;
  } | null;
  const safetyRating = model?.safetyRating as {
    euro_ncap?: string;
    jncap?: string;
    asean_ncap?: string;
    global_ncap?: string;
    notes?: string;
  } | null;
  const maintenanceTips = model?.maintenanceTips as string[] | null;
  const yearsToAvoid = model?.yearsToAvoid as string[] | null;
  const bestYears = model?.bestYears as string[] | null;

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

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div className="relative rounded-lg overflow-hidden">
              <img
                src={getCarImage(listing.baseModel)}
                alt={listing.model}
                className="w-full h-[400px] object-cover"
              />
              {priceInfo && (
                <div className="absolute top-4 left-4">
                  <Badge className={`${priceInfo.class} text-base py-1 px-3`}>
                    {priceInfo.labelSi}
                  </Badge>
                </div>
              )}
              <div className="absolute top-4 right-4">
                <Badge variant="secondary" className="capitalize">
                  {listing.source}
                </Badge>
              </div>
            </div>

            {/* Title & Basic Info */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{listing.model}</h1>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {listing.year}
                </span>
                {listing.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {listing.location}
                  </span>
                )}
                {listing.mileage && (
                  <span className="flex items-center gap-1">
                    <Gauge className="h-4 w-4" />
                    {formatMileage(listing.mileage)}
                  </span>
                )}
              </div>
            </div>

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
                  <div className="grid grid-cols-2 gap-4">
                    {safetyRating.euro_ncap && (
                      <div>
                        <p className="text-sm text-muted-foreground">Euro NCAP</p>
                        <p className="font-semibold">{safetyRating.euro_ncap}</p>
                      </div>
                    )}
                    {safetyRating.jncap && (
                      <div>
                        <p className="text-sm text-muted-foreground">JNCAP</p>
                        <p className="font-semibold">{safetyRating.jncap}</p>
                      </div>
                    )}
                    {safetyRating.asean_ncap && (
                      <div>
                        <p className="text-sm text-muted-foreground">ASEAN NCAP</p>
                        <p className="font-semibold">{safetyRating.asean_ncap}</p>
                      </div>
                    )}
                    {safetyRating.global_ncap && (
                      <div>
                        <p className="text-sm text-muted-foreground">Global NCAP</p>
                        <p className="font-semibold">{safetyRating.global_ncap}</p>
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
                  <ul className="space-y-2">
                    {maintenanceTips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <Card>
              <CardContent className="p-6">
                <p className="text-4xl font-bold text-primary mb-2">
                  {formatPrice(listing.price)}
                </p>
                {marketPrice && (
                  <div className="text-sm text-muted-foreground mb-4">
                    <p>
                      Market Average: {formatPrice(marketPrice.averagePrice)}
                    </p>
                    <p>
                      Range: {formatPrice(marketPrice.minPrice || 0)} -{" "}
                      {formatPrice(marketPrice.maxPrice || 0)}
                    </p>
                  </div>
                )}
                <Separator className="my-4" />
                <Button className="w-full" size="lg">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {listing.source} හි බලන්න
                </Button>
              </CardContent>
            </Card>

            {/* Reliability Score */}
            {model && (
              <Card>
                <CardHeader>
                  <CardTitle className="sinhala-text">විශ්වසනීයත්වය</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`text-5xl font-bold ${getReliabilityColor(
                        model.reliabilityScore
                      )}`}
                    >
                      {model.reliabilityScore}
                    </div>
                    <div>
                      <p className="text-lg font-medium">/10</p>
                      <p className="text-sm text-muted-foreground">Reliability Score</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {Array(10)
                      .fill(0)
                      .map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < model.reliabilityScore
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Fuel Efficiency */}
            {fuelEfficiency && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 sinhala-text">
                    <Fuel className="h-5 w-5 text-green-600" />
                    ඉන්ධන කාර්යක්ෂමතාව
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {fuelEfficiency.city_kmpl && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">City</span>
                      <span className="font-semibold">{fuelEfficiency.city_kmpl} kmpl</span>
                    </div>
                  )}
                  {fuelEfficiency.highway_kmpl && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Highway</span>
                      <span className="font-semibold">{fuelEfficiency.highway_kmpl} kmpl</span>
                    </div>
                  )}
                  {fuelEfficiency.hybrid_kmpl && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Hybrid</span>
                      <span className="font-semibold">{fuelEfficiency.hybrid_kmpl} kmpl</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Years to Avoid / Best Years */}
            {(yearsToAvoid?.length || bestYears?.length) && (
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
                </CardContent>
              </Card>
            )}

            {/* Recall Info */}
            {model?.recallInfo && (
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
          </div>
        </div>
      </div>

      {/* Chatbot */}
      <ChatBot />
    </div>
  );
}
