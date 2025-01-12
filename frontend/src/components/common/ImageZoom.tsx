import React, { useRef, useState } from "react";

interface IProps {
  src: string;
  alt?: string;
}

export default function ImageZoom({ src, alt }: IProps) {
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const image = useRef<HTMLImageElement>(null);

  const toggleZoom = () => {
    if (!isClicked) {
      return;
    }
    if (image.current == undefined) {
      return;
    }
    if (isClicked) {
      image.current.style.transform = "scale(1)";
      image.current.style.cursor = "normal";
    } else {
      image.current.style.transform = "scale(1.3)";
      image.current.style.cursor = "zoom-in";
    }
    setIsClicked((prevState) => !prevState);
  };
  function Zoomimage(event: React.MouseEvent<HTMLImageElement, MouseEvent>) {
    if (image.current == undefined) {
      return;
    }
    const offsetX = event.nativeEvent.offsetX;
    const offsetY = event.nativeEvent.offsetY;

    const scaleFactor = 1.3;
    const transformOriginX = (offsetX / image.current.width) * 100 + "%";
    const transformOriginY = (offsetY / image.current.height) * 100 + "%";

    image.current.style.transformOrigin = `${transformOriginX} ${transformOriginY}`;
    image.current.style.transform = `scale(${scaleFactor})`;
  }
  function disableZoom() {
    if (image.current == undefined) {
      return;
    }
    image.current.style.transform = "scale(1)";
    image.current.style.cursor = "normal";
    setIsClicked(false);
  }
  return (
    <div
      style={{
        overflow: "hidden",
      }}
    >
      <img
        ref={image}
        src={src}
        alt={alt}
        onClick={toggleZoom}
        onMouseLeave={disableZoom}
        onMouseMove={Zoomimage}
        style={{
          cursor: "pointer",
          transition: "all 0.3s ease",
          overflow: "hidden",
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}
