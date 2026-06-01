import React, { useState } from 'react';

interface StarRatingProps {
  value: number;
  onChange?: (val: number) => void;
  readonly?: boolean;
  size?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ value, onChange, readonly = false, size = 18 }) => {
  const [hover, setHover] = useState(0);
  const activeValue = hover || value;

  return (
    <div className="stars" aria-label={readonly ? `Rating: ${value} out of 5` : 'Choose a rating'}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`star ${star <= activeValue ? 'filled' : ''} ${!readonly ? 'interactive' : ''}`}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={star <= activeValue ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
          role={readonly ? 'img' : 'button'}
          aria-label={readonly ? `${star} star` : `Rate ${star} out of 5`}
          tabIndex={readonly ? -1 : 0}
          onClick={() => !readonly && onChange && onChange(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          onKeyDown={(event) => {
            if (!readonly && onChange && (event.key === 'Enter' || event.key === ' ')) {
              event.preventDefault();
              onChange(star);
            }
          }}
          style={{ cursor: readonly ? 'default' : 'pointer' }}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
};

export default StarRating;
