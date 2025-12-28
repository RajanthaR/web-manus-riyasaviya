import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";
import { ChatBot } from "@/components/ChatBot";
import {
  Car,
  ArrowLeft,
  Fuel,
  AlertTriangle,
  CheckCircle,
  Star,
  ChevronRight,
} from "lucide-react";

const getReliabilityColor = (score: number) => {
  if (score >= 8) return "text-green-600";
  if (score >= 6) return "text-yellow-600";
  return "text-red-600";
};

const getReliabilityBg = (score: number) => {
  if (score >= 8) return "bg-green-100 text-green-800";
  if (score >= 6) return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-800";
};

// Placeholder car images based on model
const getCarImage = (baseModel: string) => {
  const images: Record<string, string> = {
    "Toyota Vitz": "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=400&fit=crop",
    "Suzuki Wagon R": "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop",
    "Honda Vezel": "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&h=400&fit=crop",
    "Toyota Axio": "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&h=400&fit=crop",
  };
  return images[baseModel] || "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&h=400&fit=crop";
};

export default function Models() {
  const { data: models, isLoading } = trpc.vehicle.getModels.useQuery();

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 sinhala-text">Model තොරතුරු</h1>
          <p className="text-muted-foreground sinhala-text">
            සෑම Model එකක්ම සඳහා Reliability Ratings, Common Problems, සහ Maintenance Tips
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <Card key={i}>
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-6">
                    <Skeleton className="h-8 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {models?.map((model) => {
              const fuelEfficiency = model.fuelEfficiency as {
                city_kmpl?: string;
                highway_kmpl?: string;
                hybrid_kmpl?: string;
              } | null;
              const yearsToAvoid = model.yearsToAvoid as string[] | null;
              const bestYears = model.bestYears as string[] | null;
              const commonProblems = model.commonProblems as Array<{
                issue: string;
                severity: string;
                description: string;
              }> | null;

              return (
                <Link key={model.id} href={`/model/${encodeURIComponent(model.baseModel)}`}>
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden h-full">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={getCarImage(model.baseModel)}
                        alt={model.baseModel}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge className={getReliabilityBg(model.reliabilityScore)}>
                          <Star className="h-3 w-3 mr-1" />
                          {model.reliabilityScore}/10
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h2 className="text-2xl font-bold">{model.baseModel}</h2>
                          <p className="text-sm text-muted-foreground">{model.alsoKnownAs}</p>
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {/* Fuel Efficiency */}
                        {fuelEfficiency && (
                          <div className="flex items-center gap-2">
                            <Fuel className="h-4 w-4 text-green-600" />
                            <span className="text-sm">
                              {fuelEfficiency.city_kmpl || fuelEfficiency.hybrid_kmpl || "N/A"} kmpl
                            </span>
                          </div>
                        )}

                        {/* Reliability */}
                        <div className="flex items-center gap-2">
                          <Star className={`h-4 w-4 ${getReliabilityColor(model.reliabilityScore)}`} />
                          <span className={`text-sm ${getReliabilityColor(model.reliabilityScore)}`}>
                            {model.reliabilityScore >= 8
                              ? "ඉහළ විශ්වසනීයත්වය"
                              : model.reliabilityScore >= 6
                              ? "මධ්‍යම විශ්වසනීයත්වය"
                              : "අඩු විශ්වසනීයත්වය"}
                          </span>
                        </div>
                      </div>

                      {/* Years Info */}
                      <div className="space-y-2 mb-4">
                        {bestYears && bestYears.length > 0 && (
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-muted-foreground">හොඳම:</span>
                            <span className="font-medium">{bestYears.slice(0, 3).join(", ")}</span>
                          </div>
                        )}
                        {yearsToAvoid && yearsToAvoid.length > 0 && (
                          <div className="flex items-center gap-2 text-sm">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <span className="text-muted-foreground">වළකින්න:</span>
                            <span className="font-medium text-red-600">
                              {yearsToAvoid.join(", ")}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Top Problems Preview */}
                      {commonProblems && commonProblems.length > 0 && (
                        <div className="border-t pt-4">
                          <p className="text-xs text-muted-foreground mb-2">ප්‍රධාන ගැටලු:</p>
                          <div className="flex flex-wrap gap-1">
                            {commonProblems.slice(0, 2).map((problem, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {problem.issue}
                              </Badge>
                            ))}
                            {commonProblems.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{commonProblems.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* View More */}
                      <div className="flex items-center justify-end mt-4 text-primary">
                        <span className="text-sm">වැඩි විස්තර</span>
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Chatbot */}
      <ChatBot />
    </div>
  );
}
