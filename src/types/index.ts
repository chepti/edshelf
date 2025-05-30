export interface AiTool {
  id: string;
  name: string;
  description: string;
  link: string;
  tags: string[];
  createdBy: string; // User ID or name
  createdAt: string; // ISO date string
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