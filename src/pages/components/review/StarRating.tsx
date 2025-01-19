interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  editable?: boolean;
}

export const StarRating = ({ rating, onRatingChange, editable = false }: StarRatingProps) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <i 
          key={star}
          onClick={() => editable && onRatingChange?.(star)}
          className={`fas fa-star ${
            star <= rating ? 'text-yellow-400' : 'text-gray-300'
          } ${editable ? 'cursor-pointer' : ''}`}
        ></i>
      ))}
    </div>
  );
}; 

export default StarRating;