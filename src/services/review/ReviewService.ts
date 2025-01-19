import { ReviewDTO, ReviewResponse } from '@/types/ReviewDTO';
import config from '@/utils/config';

export const ReviewService = {
  // Récupérer les avis pour une propriété
  async getPropertyReviews(propertyId: string): Promise<ReviewDTO[]> {
    try {
      
      if (!propertyId) {
        throw new Error('Property ID is required');
      }
      
      const response = await fetch(`${config.apiBaseUrl}/reviews/property/${propertyId}`);
      if (!response.ok) {
        throw new Error('Error while fetching reviews');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur dans getPropertyReviews:', error);
      throw error;
    }
  },

  // Récupérer la note moyenne d'une propriété
  async getPropertyAverageRating(agentEmail: string): Promise<number> {
    try {
      const response = await fetch(`${config.apiBaseUrl}/reviews/property/${agentEmail}/rating`);
      
      if (!response.ok) {
        throw new Error('Error while fetching average rating');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur dans getPropertyAverageRating:', error);
      throw error;
    }
  },

  // Récupérer la note moyenne d'un agent
  async getAgentOverallRating(agentEmail: string): Promise<number> {
    try {
      const response = await fetch(`${config.apiBaseUrl}/reviews/agent/${agentEmail}/rating`);
      
      if (!response.ok) {
        throw new Error('Error while fetching agent rating');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur dans getAgentOverallRating:', error);
      throw error;
    }
  },

  // Créer un nouvel avis
  async createReview(review: Omit<ReviewDTO, 'id' | 'reviewDate'>): Promise<ReviewResponse> {
    try {
      
      const response = await fetch(`${config.apiBaseUrl}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(review)
      });

      if (!response.ok) {
        throw new Error('Error while creating review');
      }

      const data = await response.json();
      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Erreur dans createReview:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred'
      };
    }
  },

  // Ajouter cette fonction
  async getAgentReviewCount(agentEmail: string): Promise<number> {
    try {
      const response = await fetch(`${config.apiBaseUrl}/reviews/agent/${agentEmail}/count`);
      
      if (!response.ok) {
        throw new Error('Error while fetching agent review count');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur dans getAgentReviewCount:', error);
      throw error;
    }
  } 
};
