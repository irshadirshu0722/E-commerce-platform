import React, { FC, RefObject, SyntheticEvent } from "react";
import { RefactorActionInfo } from "typescript";

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  ref?: RefObject<HTMLImageElement>;
}

const Image: FC<Props> = ({ ref, ...otherProps }) => {
  const handleImageError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.onerror = null;
    target.src =
      "http://res.cloudinary.com/dg3m2vvvs/image/upload/v1710835028/vtsipjaola9uaeldow5b.jpg";

    // If an additional onError handler is passed, call it
  };

  return <img onError={handleImageError} {...otherProps} ref={ref} />;
};

export default Image;
