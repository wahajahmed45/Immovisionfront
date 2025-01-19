import { useState } from 'react';
import { StarRating } from './StarRating';
import { ReviewService } from '@/services/review/ReviewService';

interface AddReviewProps {
  propertyId: string;
  agentEmail: string;
  userEmail: string;
  onReviewAdded: () => void;
}

export const AddReview = ({ propertyId, agentEmail, userEmail, onReviewAdded }: AddReviewProps) => {
  const [propertyRating, setPropertyRating] = useState(0);
  const [agentRating, setAgentRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (propertyRating === 0 || agentRating === 0) {
      setError('Please rate both the property and the agent');
      return;
    }

    try {
      const reviewData = {
        propertyId,
        agentEmail,
        userEmail,
        propertyRating,
        agentRating,
        comment: comment.trim()
      };

      const response = await ReviewService.createReview(reviewData);
      
      if (response.success) {
        setComment('');
        setPropertyRating(0);
        setAgentRating(0);
        onReviewAdded();
      } else {
        setError(response.error || 'Une erreur est survenue');
      }
    } catch (error) {
      setError('An error occurred while submitting the review');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
          <i className="fas fa-pen-to-square text-secondary-color"></i>
          Write a Review
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-6">
          {/* Ratings Section */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Property Rating *
              </label>
              <div className="flex items-center gap-4">
                <StarRating 
                  rating={propertyRating} 
                  onRatingChange={setPropertyRating}
                  editable
                />
                <span className="text-sm text-gray-500">
                  {propertyRating}/5
                </span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Agent Rating *
              </label>
              <div className="flex items-center gap-4">
                <StarRating 
                  rating={agentRating} 
                  onRatingChange={setAgentRating}
                  editable
                />
                <span className="text-sm text-gray-500">
                  {agentRating}/5
                </span>
              </div>
            </div>
          </div>

          {/* Comment Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Comment *
            </label>
            <div className="relative">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary-color focus:border-transparent resize-none"
                rows={4}
                placeholder="Share your experience..."
                required
              />
              <div className="absolute right-3 bottom-3 text-gray-400">
                <i className="fas fa-message"></i>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg flex items-center gap-2">
              <i className="fas fa-exclamation-circle"></i>
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-secondary-color hover:bg-primary-color text-white px-6 py-3 rounded-lg transition-colors duration-300 flex items-center gap-2"
            >
              <i className="fas fa-paper-plane"></i>
              Submit Review
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}; 
export default AddReview;