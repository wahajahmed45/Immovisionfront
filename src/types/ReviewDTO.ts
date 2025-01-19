export interface ReviewDTO {
  id?: string;  // UUID
  propertyId: string;  // UUID
  agentEmail: string;    // UUID
  userEmail: string;  
  userName?: string;
  propertyRating: number;
  agentRating: number;
  reviewDate?: string; // LocalDateTime
  comment: string;    // Ajouté pour le commentaire
}

export interface ReviewResponse {
  success: boolean;
  data?: ReviewDTO;
  error?: string;
}
