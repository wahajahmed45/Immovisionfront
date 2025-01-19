import { StarRating } from '../review/StarRating';

interface AgentCardProps {
  name: string;
  role: string;
  rating?: number;
  reviewCount?: number;
}

export const AgentCard = ({ name, role, rating = 0, reviewCount = 0 }: AgentCardProps) => {
  // Ensure name is defined and is a string
  const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '';

  return (
    <div className="px-5 pt-35px pb-10 xl:pl-35px xl:pr-30px mb-10 border-2 border-border-color-11">
      <div className="flex flex-col items-center text-center">
        <div className="mb-25px">
          <div className="w-140px h-140px rounded-full bg-secondary-color flex items-center justify-center">
            <span className="text-4xl text-white font-bold">
              {initials}
            </span>
          </div>
        </div>
        <h4 className="mb-15px lg:text-lg text-heading-color font-bold">
          <span className="leading-1.3 lg:leading-1.3">{name}</span>
        </h4>
        <p className="text-[12.25px] lg:text-sm">
          <span className="lg:leading-1 8">{role}</span>
        </p>
        <div className="flex flex-col items-center space-y-3 my-4">
          <div className="flex items-center gap-3">
            <StarRating rating={rating} />
            <span className="text-xl font-semibold text-secondary-color">
              {rating > 0 ? rating.toFixed(1) : '-'}
            </span>
          </div>

          <div className="text-sm text-gray-600">
            {reviewCount > 0 ? (
              <span>
                {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
              </span>
            ) : (
              <span>No reviews yet</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentCard;