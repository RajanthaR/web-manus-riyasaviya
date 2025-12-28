import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, SlidersHorizontal, X } from "lucide-react";

interface SearchFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  initialFilters?: FilterState;
}

export interface FilterState {
  baseModel?: string;
  minYear?: number;
  maxYear?: number;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  priceEvaluation?: "good_deal" | "fair_price" | "overpriced";
}

const models = [
  { value: "Toyota Vitz", label: "Toyota Vitz" },
  { value: "Suzuki Wagon R", label: "Suzuki Wagon R" },
  { value: "Honda Vezel", label: "Honda Vezel" },
  { value: "Toyota Axio", label: "Toyota Axio" },
];

const locations = [
  "Colombo",
  "Gampaha",
  "Kandy",
  "Galle",
  "Kurunegala",
  "Kalutara",
  "Matara",
  "Negombo",
  "Jaffna",
  "Kegalle",
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 20 }, (_, i) => currentYear - i);

export function SearchFilters({ onFilterChange, initialFilters = {} }: SearchFiltersProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
  };

  const applyFilters = () => {
    onFilterChange(filters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== undefined);

  return (
    <div className="bg-card rounded-lg border p-4 space-y-4">
      {/* Quick Search Bar */}
      <div className="flex gap-2">
        <Select
          value={filters.baseModel || ""}
          onValueChange={(v) => updateFilter("baseModel", v)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="වාහන වර්ගය තෝරන්න" />
          </SelectTrigger>
          <SelectContent>
            {models.map((model) => (
              <SelectItem key={model.value} value={model.value}>
                {model.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={applyFilters} className="gap-2">
          <Search className="h-4 w-4" />
          සොයන්න
        </Button>

        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {isExpanded ? "අඩු පෙරහන්" : "වැඩි පෙරහන්"}
        </Button>

        {hasActiveFilters && (
          <Button variant="ghost" onClick={clearFilters} className="gap-2">
            <X className="h-4 w-4" />
            මකන්න
          </Button>
        )}
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
          {/* Year Range */}
          <div className="space-y-2">
            <Label className="sinhala-text">නිෂ්පාදිත වර්ෂය</Label>
            <div className="flex gap-2">
              <Select
                value={filters.minYear?.toString() || ""}
                onValueChange={(v) => updateFilter("minYear", v ? parseInt(v) : undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="සිට" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filters.maxYear?.toString() || ""}
                onValueChange={(v) => updateFilter("maxYear", v ? parseInt(v) : undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="දක්වා" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <Label className="sinhala-text">මිල පරාසය (Rs.)</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="අවම"
                value={filters.minPrice || ""}
                onChange={(e) =>
                  updateFilter("minPrice", e.target.value ? parseInt(e.target.value) : undefined)
                }
              />
              <Input
                type="number"
                placeholder="උපරිම"
                value={filters.maxPrice || ""}
                onChange={(e) =>
                  updateFilter("maxPrice", e.target.value ? parseInt(e.target.value) : undefined)
                }
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label className="sinhala-text">ස්ථානය</Label>
            <Select
              value={filters.location || ""}
              onValueChange={(v) => updateFilter("location", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="ස්ථානය තෝරන්න" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Evaluation */}
          <div className="space-y-2">
            <Label className="sinhala-text">මිල තක්සේරුව</Label>
            <Select
              value={filters.priceEvaluation || ""}
              onValueChange={(v) => updateFilter("priceEvaluation", v as FilterState["priceEvaluation"])}
            >
              <SelectTrigger>
                <SelectValue placeholder="තක්සේරුව තෝරන්න" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="good_deal">හොඳ ගනුදෙනුවක් (Good Deal)</SelectItem>
                <SelectItem value="fair_price">සාධාරණ මිල (Fair Price)</SelectItem>
                <SelectItem value="overpriced">අධික මිල (Overpriced)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
