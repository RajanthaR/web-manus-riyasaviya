import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Fuel, Gauge, MapPin, Calendar, Star } from "lucide-react";
import { Link } from "wouter";

interface VehicleCardProps {
  id: number;
  model: string;
  baseModel: string;
  year: number;
  price: number;
  mileage?: number | null;
  location?: string | null;
  source: string;
  priceEvaluation?: string | null;
  reliabilityScore?: number;
  fuelEfficiency?: { city_kmpl?: string; highway_kmpl?: string; hybrid_kmpl?: string } | null;
}

const priceLabels: Record<string, { label: string; labelSi: string; class: string }> = {
  good_deal: { label: "Good Deal", labelSi: "හොඳ ගනුදෙනුවක්", class: "badge-good-deal" },
  fair_price: { label: "Fair Price", labelSi: "සාධාරණ මිල", class: "badge-fair-price" },
  overpriced: { label: "Overpriced", labelSi: "අධික මිල", class: "badge-overpriced" },
};

const getReliabilityColor = (score: number) => {
  if (score >= 8) return "reliability-high";
  if (score >= 6) return "reliability-medium";
  return "reliability-low";
};

const formatPrice = (price: number) => {
  if (price >= 1000000) {
    return `Rs. ${(price / 1000000).toFixed(2)}M`;
  }
  return `Rs. ${(price / 100000).toFixed(1)} Lakhs`;
};

const formatMileage = (mileage: number) => {
  if (mileage >= 1000) {
    return `${(mileage / 1000).toFixed(0)}k km`;
  }
  return `${mileage} km`;
};

// Placeholder car images based on model
const getCarImage = (baseModel: string) => {
  const images: Record<string, string> = {
    "Toyota Vitz": "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=250&fit=crop",
    "Suzuki Wagon R": "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=250&fit=crop",
    "Honda Vezel": "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=250&fit=crop",
    "Toyota Axio": "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=250&fit=crop",
  };
  return images[baseModel] || "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=250&fit=crop";
};

export function VehicleCard({
  id,
  model,
  baseModel,
  year,
  price,
  mileage,
  location,
  source,
  priceEvaluation,
  reliabilityScore = 7,
  fuelEfficiency,
}: VehicleCardProps) {
  const priceInfo = priceEvaluation ? priceLabels[priceEvaluation] : null;
  
  return (
    <Link href={`/vehicle/${id}`}>
      <Card className="vehicle-card cursor-pointer overflow-hidden h-full">
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden bg-muted">
          <img
            src={getCarImage(baseModel)}
            alt={model}
            className="w-full h-full object-cover"
          />
          {/* Price Evaluation Badge */}
          {priceInfo && (
            <div className="absolute top-2 left-2">
              <Badge className={priceInfo.class}>
                {priceInfo.labelSi}
              </Badge>
            </div>
          )}
          {/* Source Badge */}
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="text-xs capitalize">
              {source}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Model & Year */}
          <h3 className="font-semibold text-lg line-clamp-1">{model}</h3>
          <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
            <Calendar className="h-4 w-4" />
            <span>{year}</span>
            {location && (
              <>
                <span className="text-border">•</span>
                <MapPin className="h-4 w-4" />
                <span>{location}</span>
              </>
            )}
          </div>

          {/* Price */}
          <p className="text-2xl font-bold text-primary mt-3">
            {formatPrice(price)}
          </p>

          {/* Stats Row */}
          <div className="flex items-center gap-4 mt-3 text-sm">
            {/* Reliability Score */}
            <div className="flex items-center gap-1">
              <Star className={`h-4 w-4 ${getReliabilityColor(reliabilityScore)}`} />
              <span className={`font-medium ${getReliabilityColor(reliabilityScore)}`}>
                {reliabilityScore}/10
              </span>
              <span className="text-muted-foreground text-xs">විශ්වසනීයත්වය</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="px-4 pb-4 pt-0 flex justify-between items-center">
          {/* Mileage */}
          {mileage !== null && mileage !== undefined && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Gauge className="h-4 w-4" />
              <span>{formatMileage(mileage)}</span>
            </div>
          )}
          
          {/* Fuel Efficiency Badge */}
          {fuelEfficiency && (
            <div className="flex items-center gap-1 text-sm">
              <Fuel className="h-4 w-4 text-green-600" />
              <span className="text-green-600 font-medium">
                {fuelEfficiency.city_kmpl || fuelEfficiency.hybrid_kmpl || "N/A"} kmpl
              </span>
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
