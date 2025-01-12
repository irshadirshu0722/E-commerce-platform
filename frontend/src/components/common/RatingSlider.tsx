import React from "react";

interface RatingSliderProps {
  fiveStarP: number;
  fourStarP: number;
  threeStarP: number;
  twoStarP: number;
  oneStarP: number;
}

export const RatingSlider: React.FC<RatingSliderProps> = ({
  fiveStarP,
  fourStarP,
  threeStarP,
  twoStarP,
  oneStarP,
}: RatingSliderProps) => {
  const percentage: number[] = [
    fiveStarP,
    fourStarP,
    threeStarP,
    twoStarP,
    oneStarP,
  ];
  return (
    <>
      {percentage.map((item: number, index: number) => (
        <li key={index}>
          <span className="rating-count">{5 - index}</span>
          <div className="rating-slider-outer">
            <div
              className="rating-slider-inner"
              style={{ width: `${item}%` }}
            ></div>
          </div>
          <span className="rating-percentage">{item}%</span>
        </li>
      ))}
    </>
  );
};

export default RatingSlider;
