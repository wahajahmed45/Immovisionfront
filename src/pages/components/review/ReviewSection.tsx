import { useState, useEffect } from 'react';
import { ReviewService } from '@/services/review/ReviewService';
import { ReviewList } from './ReviewList';
import { AddReview } from './AddReview';
import type { ReviewDTO } from '@/types/ReviewDTO';

interface ReviewSectionProps {
  propertyId: string;
  agentEmail: string;
  userEmail: string;
  propertyStatus: string;
  onReviewAdded: () => void;
}

export const ReviewSection = ({ propertyId, agentEmail, userEmail, propertyStatus, onReviewAdded }: ReviewSectionProps) => {
  const [reviews, setReviews] = useState<ReviewDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReviews = async () => {
    try {
      setIsLoading(true);
      const reviewsData = await ReviewService.getPropertyReviews(propertyId);
      setReviews(reviewsData);
      setError(null);
    } catch (error) {
      console.error('Erreur lors du chargement des avis:', error);
      setError('Impossible de charger les avis');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [propertyId]);

  const handleReviewAdded = async () => {
    await loadReviews();
    onReviewAdded();
  };

  return (
    <div className="reviews-section mt-8">
      <h4 className="text-22px font-semibold leading-1.3 pl-10px border-l-2 border-secondary-color text-heading-color mb-30px">
        Customer Reviews ({reviews.length})
      </h4>

      {isLoading ? (
        <div className="text-center py-8">Loading reviews...</div>
      ) : error ? (
        <div className="text-red-500 text-center py-8">{error}</div>
      ) : (
        <ReviewList reviews={reviews} />
      )}

      {userEmail && propertyStatus !== 'solded' ? (
        <AddReview 
          propertyId={propertyId}
          agentEmail={agentEmail}
          userEmail={userEmail}
          onReviewAdded={handleReviewAdded}
        />
      ) : (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600">
            {!userEmail ? (
              <>
                <i className="fas fa-lock mr-2"></i>
                Please log in to write a review
              </>
            ) : propertyStatus === 'solded' ? (
              <>
                <i className="fas fa-check-circle mr-2"></i>
                This property has been sold. Reviews are no longer accepted.
              </>
            ) : null}
          </p>
        </div>
      )}
    </div>
  );
}; 
export default ReviewSection; 