CREATE TABLE `chat_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(64) NOT NULL,
	`userId` int,
	`role` enum('user','assistant') NOT NULL,
	`content` text NOT NULL,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chat_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `market_prices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`baseModel` varchar(100) NOT NULL,
	`year` int NOT NULL,
	`averagePrice` int NOT NULL,
	`medianPrice` int,
	`minPrice` int,
	`maxPrice` int,
	`stdDev` int,
	`sampleSize` int NOT NULL DEFAULT 0,
	`priceRangeLow` int,
	`priceRangeHigh` int,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `market_prices_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vehicle_listings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`model` varchar(255) NOT NULL,
	`baseModel` varchar(100) NOT NULL,
	`normalizedModel` varchar(255),
	`year` int NOT NULL,
	`price` int NOT NULL,
	`mileage` int,
	`location` varchar(100),
	`source` varchar(50) NOT NULL,
	`priceEvaluation` enum('good_deal','fair_price','overpriced','unknown') DEFAULT 'unknown',
	`imageUrl` varchar(500),
	`sourceUrl` varchar(500),
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vehicle_listings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vehicle_models` (
	`id` int AUTO_INCREMENT NOT NULL,
	`baseModel` varchar(100) NOT NULL,
	`alsoKnownAs` varchar(255),
	`reliabilityScore` int NOT NULL DEFAULT 7,
	`commonProblems` json,
	`fuelEfficiency` json,
	`safetyRating` json,
	`maintenanceTips` json,
	`yearsToAvoid` json,
	`bestYears` json,
	`recallInfo` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vehicle_models_id` PRIMARY KEY(`id`),
	CONSTRAINT `vehicle_models_baseModel_unique` UNIQUE(`baseModel`)
);
