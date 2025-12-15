import React, { useState } from "react";

interface StarRatingProps {
  rating?: number; // initial rating
  onChange?: (value: number) => void; // callback to parent
  maxStars?: number; // default 5
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating = 0,
  onChange,
  maxStars = 5,
}) => {
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [currentRating, setCurrentRating] = useState<number>(rating);

  const handleClick = (index: number, isHalf: boolean) => {
    const newRating = isHalf ? index + 0.5 : index + 1;
    setCurrentRating(newRating);
    if (onChange) onChange(newRating);
  };

  const renderStar = (index: number) => {
    const value = hoverRating || currentRating;
    let starClass = "text-gray-300";

    if (value >= index + 1) {
      starClass = "text-yellow-400"; // full star
    } else if (value >= index + 0.5) {
      starClass = "text-yellow-400"; // half star (will render half with clip)
    }

    return (
      <div key={index} className="relative w-6 h-6 cursor-pointer inline-block">
        {/* Half star left */}
        <div
          className={`absolute left-0 top-0 w-1/2 h-full overflow-hidden ${starClass}`}
          onMouseEnter={() => setHoverRating(index + 0.5)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => handleClick(index, true)}
        >
          ★
        </div>

        {/* Full star right */}
        <div
          className={`absolute left-0 top-0 w-full h-full ${starClass}`}
          onMouseEnter={() => setHoverRating(index + 1)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => handleClick(index, false)}
        >
          ★
        </div>
      </div>
    );
  };

  return (
    <div className="flex space-x-1 select-none">
      {Array.from({ length: maxStars }, (_, i) => renderStar(i))}
      <span className="ml-2 text-gray-700">{currentRating.toFixed(1)}</span>
    </div>
  );
};

// export const App = () => {
//   const [rating, setRating] = useState(0);

//   return (
//     <div className="p-10">
//       <h1 className="mb-4 text-lg font-semibold">Rate this:</h1>
//       <StarRating rating={rating} onChange={(val) => setRating(val)} />
//       <p className="mt-2">Selected Rating: {rating}</p>
//     </div>
//   );
// };
