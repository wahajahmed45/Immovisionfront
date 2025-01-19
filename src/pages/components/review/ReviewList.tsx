import { ReviewDTO } from '@/types/ReviewDTO';
import { StarRating } from './StarRating';

interface ReviewListProps {
  reviews: ReviewDTO[];
}

export const ReviewList = ({ reviews = [] }: ReviewListProps) => {
  // Log the reviews to debug
  console.log('Reviews:', reviews);

  return (
    <div className="space-y-6 mb-8">
      {Array.isArray(reviews) && reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl border border-gray-100">
            <div className="flex flex-col">
              {/* En-tête de l'avis */}
              <div className="flex items-start justify-between border-b border-gray-100 pb-4 mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-secondary-color flex items-center justify-center text-white text-xl font-semibold">
                    {review.userName?.[0]?.toUpperCase() || 'A'}
                  </div>
                  <div>
                    <h5 className="text-lg font-semibold text-gray-800">
                      {review.userName || 'Anonymous User'}
                    </h5>
                    <p className="text-sm text-gray-500">
                      {(() => {
                        if (!review.reviewDate) return 'Date not available';
                        const dateArr = review.reviewDate.toString().split(',');
                        if (dateArr.length < 3) return 'Invalid date format';
                        const year = dateArr[0];
                        const month = dateArr[1].padStart(2, '0');
                        const day = dateArr[2].padStart(2, '0');
                        const date = new Date(`${year}-${month}-${day}`);
                        return date.toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        });
                      })()}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-2">
                  <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1 rounded-full">
                    <span className="text-sm font-medium text-gray-600">
                      Property
                    </span>
                    <StarRating rating={review.propertyRating} />
                  </div>
                  <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1 rounded-full">
                    <span className="text-sm font-medium text-gray-600">
                      Agent
                    </span>
                    <StarRating rating={review.agentRating} />
                  </div>
                </div>
              </div>

              {/* Contenu de l'avis */}
              <div className="relative">
                <div className="absolute -left-2 top-0 text-4xl text-secondary-color opacity-20">
                  <i className="fas fa-quote-left"></i>
                </div>
                <p className="text-gray-700 leading-relaxed pl-6 italic">
                  {review.comment}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-5xl mb-4 text-gray-300">
            <i className="far fa-comment-dots"></i>
          </div>
          <p className="text-gray-500 font-medium">
            No reviews yet.
          </p>
          <p className="text-gray-400 text-sm">
            Be the first to leave a review!
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewList;