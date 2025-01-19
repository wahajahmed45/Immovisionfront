export interface PropertyDTO {
  title: string;
  description: string;
  type: string;
  status: string;
  approvationComment?: string;
  approvationStatus?: string;
  
  // Price information
  price: number;
  priceLabel: string;
  pricePrefix: string;
  yearlyTaxRate: string;
  hoaFee: string;

  // Property details
  bedroom: number;
  roomCounts: number;
  bathroom: number;
  toilet: number;
  landArea: number;
  livingArea: number;
  floorNumber: number;
  typeOfEnvironnement: string;
  buildingCondition: string;
  basement: boolean;
  attic: boolean;
  garden: boolean;
  gardenArea: number;
  garage: number;
  parking: boolean;
  availableFrom: string;
  extraDetails: string;

  // Location
  location: string;
  country: string;
  state: string;
  city: string;
  zip: string;
  coordinates?: {
    lat: number;
    lng: number;
  };

  // Media
  images: File[];
  imageUrl: string[];
  virtualTour: string;
  propertyVideo: string;
  floorPlan: string;

  // Amenities
  amenities: {
    interior: string[];
    exterior: string[];
    other: string[];
  };

  // Status
  available: boolean;
  forRent: boolean;
  featured: boolean;

  // Additional fields
  yearBuilt?: string;

  // Additional Details
  agentEmail?: string;
  propertyId?: string;
  createdAt?: string;
  updatedAt?: string;
  ownerEmail: string;
  agentName: string;

  
} 