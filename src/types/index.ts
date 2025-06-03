export interface AiTool {
  id: string; // Unique identifier for the tool
  name: string;
  link: string;
  logo?: string;
  description: string;
  // User rating - will be handled separately or averaged from reviews later
  // rating?: number; 
  // For now, let's use the initial rating from the sheet as 'generalRating'
  generalRating?: number | string; // Can be string like "4.5"
  pros?: string; // Advantages
  cons?: string; // Disadvantages
  limitations?: string; // Limitations
  uploadedBy?: string; // User who uploaded the tool
  timestamp?: string; // Timestamp of addition
  // Fields to be removed or handled differently based on new structure:
  // tags?: string[];
  // creatorName?: string; // This is now uploadedBy
  // hebrewSupport?: number | string;
  // freeTier?: string;
  // pedagogicalContribution?: string;
  // productType?: string;
  // pedagogicalContext?: string;
  // communicationFormat?: string;
  // examples?: string; // Will be linked from a separate sheet/table
  // tutorials?: string; // Will be linked from a separate sheet/table
}

export interface Review {
  id: string;
  toolId: string;
  userId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string; // ISO date string
}

export interface Example {
  id: string;
  toolId: string;
  userId: string;
  title: string;
  description: string;
  fileUrl?: string;
  link?: string;
  createdAt: string; // ISO date string
}

export interface Collection {
  id: string;
  userId: string;
  name: string;
  toolIds: string[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// You might want to add more specific types for API responses or form data 