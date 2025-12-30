# RiyaSaviya - වාහන වෙළඳපොළ හා උපදේශක සේවාව

A comprehensive vehicle marketplace and advisory platform tailored for Sri Lankan users, featuring AI-powered recommendations and reliability insights.

## 🚗 Features

### 🏠 Public Interface
- **Vehicle Listings**: Browse extensive vehicle inventory with detailed information
- **Smart Search & Filter**: Find vehicles by model, year, price, location, and reliability score
- **Reliability Scores**: Comprehensive reliability ratings for each vehicle model
- **Market Price Analysis**: Real-time market price comparisons with deal evaluations
- **Fuel Efficiency Information**: Detailed fuel consumption data for all vehicles
- **Safety Ratings**: NCAP safety ratings and safety feature highlights
- **Maintenance Tips**: Model-specific maintenance guidance and common issues

### 🤖 AI Chatbot - "Baas Unnehe"
- **Sinhala Language Support**: Natural conversations in Sinhala with English technical terms
- **RAG-Powered**: Database-driven recommendations using Retrieval-Augmented Generation
- **Expert Persona**: Mechanic-style advice from "Baas Unnehe" character
- **Vehicle Recommendations**: Personalized suggestions based on budget and preferences
- **Problem Diagnosis**: Common issues and troubleshooting guidance

### 👨‍💼 Admin Dashboard
- **Vehicle Management**: CRUD operations for vehicle listings
- **Reliability Data Editor**: Update and maintain vehicle reliability information
- **Chatbot Interaction Logs**: Monitor and analyze user interactions
- **Data Analytics**: Market insights and user behavior analytics

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component library
- **Wouter** - Lightweight routing
- **React Query** - Server state management
- **Framer Motion** - Smooth animations
- **React Hook Form** - Form management with Zod validation

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **tRPC** - End-to-end typesafe APIs
- **Drizzle ORM** - Type-safe SQL toolkit
- **MySQL** - Database
- **JWT** - Authentication with Jose library
- **AWS S3** - File storage and CDN

### Development Tools
- **PNPM** - Package manager
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Vitest** - Unit testing
- **TypeScript** - Static type checking

## 📁 Project Structure

```
web-manus-riyasaviya/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Route components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   └── contexts/      # React contexts
├── server/                # Node.js backend application
│   ├── _core/            # Main server application
│   ├── routes/           # API route handlers
│   ├── procedures/       # tRPC procedures
│   └── middleware/       # Express middleware
├── shared/               # Shared types and utilities
├── drizzle/              # Database schema and migrations
└── scripts/              # Build and deployment scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PNPM package manager
- MySQL database
- AWS S3 bucket (for file storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RajanthaR/web-manus-riyasaviya.git
   cd web-manus-riyasaviya
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Configure the following variables in `.env`:
   ```env
   # Database
   DATABASE_URL=mysql://user:password@localhost:3306/riyasaviya
   
   # JWT Secret
   JWT_SECRET=your-super-secret-jwt-key
   
   # AWS S3
   AWS_ACCESS_KEY_ID=your-access-key
   AWS_SECRET_ACCESS_KEY=your-secret-key
   AWS_REGION=ap-south-1
   S3_BUCKET_NAME=your-bucket-name
   
   # API Keys
   OPENAI_API_KEY=your-openai-api-key
   ```

4. **Set up the database**
   ```bash
   pnpm db:push
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   ```

   The application will be available at `http://localhost:5173`

## 📝 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm check` - Type checking without emitting
- `pnpm format` - Format code with Prettier
- `pnpm test` - Run unit tests
- `pnpm db:push` - Generate and apply database migrations

## 🧪 Testing

The project uses Vitest for unit testing. Run tests with:

```bash
pnpm test
```

Test coverage reports are generated in the `coverage/` directory.

## 📊 Database Schema

The application uses the following main tables:

- `vehicle_listings` - Vehicle inventory data
- `vehicle_models` - Model information and reliability data
- `market_prices` - Historical and current market prices
- `chat_history` - User chatbot interactions
- `users` - User authentication and profiles
- `admins` - Admin user management

## 🔒 Authentication

The application uses JWT-based authentication:
- Users can register and login to save preferences
- Admin users have access to the admin dashboard
- Secure cookie-based session management

## 🌍 Localization

- Primary language: Sinhala (සිංහල)
- Secondary language: English (for technical terms)
- Font: Noto Sans Sinhala for proper Sinhala rendering
- UTF-8 encoding throughout

## 📈 Performance

- Optimized images with S3 CDN
- Lazy loading for vehicle listings
- Efficient database queries with proper indexing
- Client-side caching with React Query
- Code splitting with Vite

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

Copyright © 2024 Rajantha R Ambegala. All rights reserved.

This project is proprietary software and may not be distributed or used commercially without explicit permission from the copyright owner.

## 👤 Author

**Rajantha R Ambegala**
- GitHub: [@RajanthaR](https://github.com/RajanthaR/)
- Email: rajantha.rc@gmail.com

## 🙏 Acknowledgments

- Vehicle data sourced from various Sri Lankan automotive platforms
- Reliability data compiled from industry reports and user feedback
- AI chatbot powered by OpenAI's language models
- UI components from Radix UI and Tailwind CSS
