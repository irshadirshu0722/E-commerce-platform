import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faStarHalfAlt,
  faStarHalfStroke,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as farStar } from "@fortawesome/free-regular-svg-icons";

interface RatingStarProps {
  fullStar: number;
  onClick?: (star: number, feedback_id: number) => void;
  id?: number;
  halfStar?: number;
  styles?: React.CSSProperties;
}

const RatingStar: React.FC<RatingStarProps> = ({
  fullStar,
  onClick,
  id,
  halfStar,
  styles,
}) => {
  return (
    <>
      {Array.from({ length: fullStar }, (_, i) => (
        <span
          key={i + 1}
          onClick={onClick ? () => onClick(i + 1, id ?? 0) : undefined}
          style={{ cursor: "pointer", ...styles }}
        >
          <FontAwesomeIcon icon={faStar} />
        </span>
      ))}
      {halfStar
        ? Array.from({ length: halfStar }, (_, i) => (
            <span key={i + 1} style={{ cursor: "pointer", ...styles }}>
              <FontAwesomeIcon icon={faStarHalfStroke} />
            </span>
          ))
        : undefined}
      {Array.from(
        { length: 5 - ((fullStar ?? 0) + (halfStar ?? 0)) },
        (_, i) => (
          <span
            key={fullStar + i + 1}
            onClick={
              onClick ? () => onClick(i + fullStar + 1, id ?? 0) : undefined
            }
            style={{ cursor: "pointer", ...styles }}
          >
            <FontAwesomeIcon icon={farStar} />
          </span>
        )
      )}
    </>
  );
};

export default RatingStar;
