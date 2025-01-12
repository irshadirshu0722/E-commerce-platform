import React, { FC, useEffect, useRef, useState, CSSProperties } from "react";
import { DEFAULT_IMAGE } from "../../../config/data";
import { imageSlider } from "../../../utils/imageslider";
import Image from "../Image";
import { handleImageError } from "../../../utils/handleImageError";
import "../../../styles/global.css";
interface Image {
  image_url: string; // Change 'String' to 'string'
}

interface CardSliderProps {
  images: Image[];
}
const imageContainerStyles: CSSProperties = {
  display: "grid",
  placeItems: "center",
  paddingTop: "2rem",
  maxHeight: "400px",
  height: "100%",
  width: "100%",
  // backgroundColor: 'var(--grey-200)', // Uncomment if needed
  position: "relative",
};

const imageStyles: CSSProperties = {
  maxHeight: "400px",
  maxWidth: "100%",
  width: "auto",
  height: "auto",
  borderRadius: "var(--borderRadiusMedium)",
  transition: "var(--transition)",
  objectFit: "cover",
};
const arrowIconStyles: CSSProperties = {
  color: "var(--black)",
  top: "48%",
  height: "50px",
  width: "50px",
  cursor: "pointer",
  fontSize: "1.25rem",
  position: "absolute",
  textAlign: "center",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  lineHeight: "50px",
  backgroundColor: "transparent",
  border: "2px solid var(--black)",
  borderRadius: "50%",
  boxShadow: "0 3px 6px rgba(0, 0, 0, 0.23)",
  transform: "translateY(-50%)",
  transition: "transform 0.1s linear",
  zIndex: "0",
};

const arrowIconActiveStyles: CSSProperties = {
  transform: "translateY(-50%) scale(0.85)",
};
export const CardSlider: FC<CardSliderProps> = ({ images }) => {
  const imageContainer = useRef<HTMLImageElement>(null);
  const [imageList, setImageList] = useState<string[]>([]);
  useEffect(() => {
    const imgs: string[] = images.map((item) => item.image_url);
    if (imgs.length == 0) {
      imgs.push(DEFAULT_IMAGE);
    }
    setImageList(imgs);
  }, [images]);
  function onClick(is_right: boolean) {
    if (imageContainer.current) {
      if (!is_right) {
        imageSlider(imageContainer.current, imageList, false);
      } else {
        imageSlider(imageContainer.current, imageList, true);
      }
    }
  }
  return (
    <div className="" style={imageContainerStyles}>
      <span
        className="active-scale material-symbols-outlined"
        onClick={() => onClick(false)}
        style={{ ...arrowIconStyles, left: "20px" }}
      >
        arrow_back_ios_new
      </span>
      <img
        ref={imageContainer}
        onError={(e) => {
          handleImageError(e);
        }}
        id="0"
        src={imageList[0]}
        style={imageStyles}
      />
      <span
        className="active-scale material-symbols-outlined"
        onClick={() => onClick(true)}
        style={{ ...arrowIconStyles, right: "20px" }}
      >
        arrow_forward_ios
      </span>
    </div>
  );
};
