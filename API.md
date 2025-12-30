# RiyaSaviya API Documentation

This document describes the API endpoints and procedures available in the RiyaSaviya application.

## 🌐 Base URL

- Development: `http://localhost:5173/api`
- Production: `https://your-domain.com/api`

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in your requests:

```javascript
// Cookie-based (recommended for web)
// Token is automatically sent in HTTP-only cookie

// Authorization header (for APIs)
headers: {
  'Authorization': `Bearer ${jwt_token}`
}
```

## 📡 API Procedures

### Vehicles

#### Get All Vehicles
```typescript
procedure: 'vehicles.getAll'
input: {
  limit?: number;
  offset?: number;
  sortBy?: 'price' | 'year' | 'mileage' | 'reliability';
  sortOrder?: 'asc' | 'desc';
}
output: Vehicle[]
```

#### Get Vehicle by ID
```typescript
procedure: 'vehicles.getById'
input: {
  id: string;
}
output: Vehicle
```

#### Search Vehicles
```typescript
procedure: 'vehicles.search'
input: {
  query?: string;
  model?: string;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  location?: string;
  fuelType?: 'petrol' | 'diesel' | 'hybrid' | 'electric';
  transmission?: 'manual' | 'automatic' | 'cvt';
  reliabilityMin?: number;
  limit?: number;
  offset?: number;
}
output: {
  vehicles: Vehicle[];
  total: number;
  filters: FilterOptions;
}
```

#### Get Good Deals
```typescript
procedure: 'vehicles.getGoodDeals'
input: {
  limit?: number;
  budget?: number;
}
output: Vehicle[]
```

### Vehicle Models

#### Get All Models
```typescript
procedure: 'models.getAll'
input: void
output: VehicleModel[]
```

#### Get Model by ID
```typescript
procedure: 'models.getById'
input: {
  id: string;
}
output: VehicleModel
```

#### Get Model Reliability Data
```typescript
procedure: 'models.getReliability'
input: {
  modelId: string;
}
output: {
  model: VehicleModel;
  reliability: ReliabilityData;
  commonProblems: CommonProblem[];
  maintenanceTips: MaintenanceTip[];
}
```

### Market Prices

#### Get Market Price
```typescript
procedure: 'prices.getMarketPrice'
input: {
  modelId: string;
  year: number;
  condition?: 'excellent' | 'good' | 'fair' | 'poor';
  mileage?: number;
  location?: string;
}
output: {
  marketPrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  priceEvaluation: 'good_deal' | 'fair' | 'overpriced';
  lastUpdated: Date;
}
```

#### Get Price History
```typescript
procedure: 'prices.getHistory'
input: {
  modelId: string;
  year: number;
  months?: number;
}
output: PriceHistoryPoint[]
```

### Recommendations

#### Get Budget Recommendations
```typescript
procedure: 'recommendations.getByBudget'
input: {
  budget: number;
  preferences?: {
    fuelType?: string;
    transmission?: string;
    brand?: string;
    purpose?: 'family' | 'personal' | 'commercial';
  };
}
output: RecommendedVehicle[]
```

#### Get Similar Vehicles
```typescript
procedure: 'recommendations.getSimilar'
input: {
  vehicleId: string;
  limit?: number;
}
output: Vehicle[]
```

### Chatbot

#### Send Message
```typescript
procedure: 'chat.sendMessage'
input: {
  message: string;
  sessionId?: string;
}
output: {
  response: string;
  sessionId: string;
  suggestions?: string[];
  relatedVehicles?: Vehicle[];
}
```

#### Get Chat History
```typescript
procedure: 'chat.getHistory'
input: {
  sessionId: string;
  limit?: number;
}
output: ChatMessage[]
```

#### Clear Chat History
```typescript
procedure: 'chat.clearHistory'
input: {
  sessionId: string;
}
output: { success: boolean }
```

### User Management

#### Register User
```typescript
procedure: 'auth.register'
input: {
  email: string;
  password: string;
  name: string;
  phone?: string;
  preferences?: UserPreferences;
}
output: {
  user: User;
  token: string;
}
```

#### Login User
```typescript
procedure: 'auth.login'
input: {
  email: string;
  password: string;
}
output: {
  user: User;
  token: string;
}
```

#### Get User Profile
```typescript
procedure: 'auth.getProfile'
input: void
output: User
```

#### Update User Profile
```typescript
procedure: 'auth.updateProfile'
input: {
  name?: string;
  phone?: string;
  preferences?: UserPreferences;
}
output: User
```

#### Logout
```typescript
procedure: 'auth.logout'
input: void
output: { success: boolean }
```

### Admin

#### Admin Login
```typescript
procedure: 'admin.login'
input: {
  email: string;
  password: string;
}
output: {
  admin: Admin;
  token: string;
}
```

#### Get All Users (Admin)
```typescript
procedure: 'admin.getUsers'
input: {
  limit?: number;
  offset?: number;
  search?: string;
}
output: {
  users: User[];
  total: number;
}
```

#### Create/Update Vehicle (Admin)
```typescript
procedure: 'admin.saveVehicle'
input: {
  id?: string;
  vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>;
}
output: Vehicle
```

#### Delete Vehicle (Admin)
```typescript
procedure: 'admin.deleteVehicle'
input: {
  id: string;
}
output: { success: boolean }
```

#### Update Reliability Data (Admin)
```typescript
procedure: 'admin.updateReliability'
input: {
  modelId: string;
  data: ReliabilityData;
}
output: VehicleModel
```

#### Get Chat Logs (Admin)
```typescript
procedure: 'admin.getChatLogs'
input: {
  limit?: number;
  offset?: number;
  dateFrom?: Date;
  dateTo?: Date;
  userId?: string;
}
output: {
  logs: ChatLog[];
  total: number;
}
```

## 📊 Data Types

### Vehicle
```typescript
interface Vehicle {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: 'petrol' | 'diesel' | 'hybrid' | 'electric';
  transmission: 'manual' | 'automatic' | 'cvt';
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  location: string;
  description: string;
  images: string[];
  features: string[];
  reliabilityScore: number;
  fuelEfficiency: {
    city: number;
    highway: number;
    combined: number;
  };
  seller: {
    name: string;
    phone: string;
    email?: string;
    type: 'dealer' | 'owner';
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### VehicleModel
```typescript
interface VehicleModel {
  id: string;
  brand: string;
  model: string;
  category: 'sedan' | 'suv' | 'hatchback' | 'coupe' | 'pickup' | 'van';
  yearsProduced: {
    start: number;
    end?: number;
  };
  specifications: {
    engine: string;
    power: number;
    torque: number;
    fuelTank: number;
    seating: number;
  };
  reliability: {
    overall: number;
    engine: number;
    transmission: number;
    electronics: number;
    suspension: number;
  };
  averagePrice: {
    new: number;
    used: {
      excellent: number;
      good: number;
      fair: number;
    };
  };
}
```

### ReliabilityData
```typescript
interface ReliabilityData {
  modelId: string;
  overallScore: number;
  categories: {
    engine: number;
    transmission: number;
    electronics: number;
    suspension: number;
    brakes: number;
    interior: number;
  };
  commonProblems: {
    issue: string;
    severity: 'low' | 'medium' | 'high';
    repairCost: number;
    affectedYears: number[];
  }[];
  maintenanceSchedule: {
    interval: string;
    service: string;
    estimatedCost: number;
  }[];
}
```

### User
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  preferences: {
    language: 'sinhala' | 'english';
    currency: 'LKR' | 'USD';
    notifications: boolean;
  };
  savedVehicles: string[];
  searchHistory: SearchQuery[];
  createdAt: Date;
  updatedAt: Date;
}
```

### ChatMessage
```typescript
interface ChatMessage {
  id: string;
  sessionId: string;
  message: string;
  response: string;
  timestamp: Date;
  metadata?: {
    suggestedVehicles?: string[];
    category?: string;
    confidence?: number;
  };
}
```

## 🔧 Error Handling

The API returns errors in the following format:

```typescript
{
  error: {
    code: string;
    message: string;
    details?: any;
  };
  data: null;
}
```

### Common Error Codes

- `UNAUTHORIZED` - Invalid or missing authentication
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `VALIDATION_ERROR` - Invalid input data
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INTERNAL_ERROR` - Server error

## 📝 Examples

### Search for Vehicles
```javascript
const response = await fetch('/api/vehicles.search', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: 'Toyota Vezel',
    yearMin: 2018,
    priceMax: 5000000,
    limit: 10
  })
});

const data = await response.json();
console.log(data.vehicles);
```

### Get Market Price
```javascript
const response = await fetch('/api/prices.getMarketPrice', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    modelId: 'vezel-2016',
    year: 2016,
    condition: 'good',
    mileage: 50000
  })
});

const { marketPrice, priceEvaluation } = await response.json();
```

### Send Chat Message
```javascript
const response = await fetch('/api/chat.sendMessage', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: 'Vezel 2014 ekak ganna hodaida?',
    sessionId: 'user-session-123'
  })
});

const { response: botResponse } = await response.json();
```

## 🚀 Rate Limiting

API requests are rate-limited to prevent abuse:
- Public endpoints: 100 requests per minute
- Authenticated users: 1000 requests per minute
- Admin endpoints: 5000 requests per minute

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## 📚 SDK/Client Libraries

### JavaScript/TypeScript
```bash
npm install @riyasaviya/client
```

```typescript
import { createTRPCClient } from '@trpc/client';
import type { AppRouter } from '@riyasaviya/server';

const client = createTRPCClient<AppRouter>({
  url: 'http://localhost:5173/api',
});

// Use the client
const vehicles = await client.vehicles.getAll();
```

## 🔄 Webhooks

Webhooks are available for real-time updates:

### New Vehicle Listing
```typescript
POST /webhooks/new-vehicle
{
  event: 'vehicle.created',
  data: Vehicle;
}
```

### Price Update
```typescript
POST /webhooks/price-update
{
  event: 'price.updated',
  data: {
    modelId: string;
    newPrice: number;
    oldPrice: number;
  };
}
```

Configure webhook URLs in the admin dashboard.

---

For more information, contact the development team or check the source code.
