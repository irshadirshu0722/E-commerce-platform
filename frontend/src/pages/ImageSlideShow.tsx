import { Slide, Fade } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import { useState, useRef } from "react";
import ImageZoom from "../components/common/ImageZoom";
// import { useSpring, animated } from "react-spring";
// import { useGesture } from "react-use-gesture";

// @ts-ignore
const spanStyle = {
  padding: "20px",
  background: "#efefef",
  color: "#000000",
};

const divStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundSize: "cover",
  height: "400px",
};
const slideImages = [
  {
    url: "https://images.unsplash.com/photo-1509721434272-b79147e0e708?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
    caption: "Slide 1",
  },
  {
    url: "https://images.unsplash.com/photo-1506710507565-203b9f24669b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1536&q=80",
    caption: "Slide 2",
  },
  {
    url: "https://images.unsplash.com/photo-1536987333706-fc9adfb10d91?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
    caption: "Slide 3",
  },
];
const fadeImages = [
  {
    url: "https://images.unsplash.com/photo-1509721434272-b79147e0e708?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
    caption: "First Slide",
  },
  {
    url: "https://images.unsplash.com/photo-1506710507565-203b9f24669b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1536&q=80",
    caption: "Second Slide",
  },
  {
    url: "https://images.unsplash.com/photo-1536987333706-fc9adfb10d91?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
    caption: "Third Slide",
  },
];

const images = [
  "https://images.unsplash.com/photo-1536987333706-fc9adfb10d91?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
  "https://images.unsplash.com/photo-1506710507565-203b9f24669b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1536&q=80",
  "https://images.unsplash.com/photo-1509721434272-b79147e0e708?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
  "https://images.unsplash.com/photo-1536987333706-fc9adfb10d91?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
  "https://images.unsplash.com/photo-1506710507565-203b9f24669b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1536&q=80",
  "https://images.unsplash.com/photo-1509721434272-b79147e0e708?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
];
const child = { width: `30em`, height: `30rem`, backgroundColor: "red" };
const parent = { width: `100vw`, height: `30rem`, backgroundColor: "blue" };
export const Slideshow = () => {
  const colors = [
    "#FF5733",
    "#FFD700",
    "#36FF33",
    "#33FFEC",
    "#336DFF",
    "#F333FF",
  ];

  const onClickImage = (index: number) => {
    const largeContainer = document.getElementById("large-container");
    const largeItem = document.getElementById(index.toString()) as HTMLElement;
    console.log(largeContainer, largeItem);
    if (largeContainer && largeItem) {
      largeItem.scrollIntoView({
        inline: "center",
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      {/* <div className="slide-container">
        <Slide>
          {slideImages.map((slideImage, index) => (
            <div key={index}>
              <div
                style={{
                  ...divStyle,
                  backgroundImage: `url(${slideImage.url})`,
                }}
              >
                <span style={spanStyle}>{slideImage.caption}</span>
              </div>
            </div>
          ))}
        </Slide>
      </div>
      <div className="slide-container">
        <Fade>
          {fadeImages.map((fadeImage, index) => (
            <div key={index}>
              <img style={{ width: "100%" }} src={fadeImage.url} />
              <h2>{fadeImage.caption}</h2>
            </div>
          ))}
        </Fade>
      </div>
      <div className="slide-container">
        <Zoom scale={0.4}>
          {images.map((each, index) => (
            <img key={index} style={{ width: "100%" }} src={each} />
          ))}
        </Zoom>
      </div> */}

      <div className="section-center">
        <div style={{ width: "500px", height: "500px" }}>
          <ImageZoom src="https://images.unsplash.com/photo-1509721434272-b79147e0e708?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80" />
        </div>
        <div style={{ width: "700px", height: "700px" }} id="large-container">
          <HorizontalScrollView>
            {[...Array(10)].map((_, index) => (
              <div
                id={index.toString()}
                key={index}
                style={{
                  background: `url("${
                    images[Math.floor(Math.random() * images.length)]
                  }")`,
                  width: "100%",
                  height: "100%",
                  display: "inline-block",
                  scrollSnapAlign: "center",
                }}
              ></div>
            ))}
          </HorizontalScrollView>
        </div>
        <div style={{ width: "250px", height: "250px" }}>
          <HorizontalScrollView>
            {[...Array(10)].map((_, index) => (
              <div
                onClick={() => onClickImage(index)}
                id={index.toString()}
                key={index}
                // src={images[Math.floor(Math.random() * colors.length)]}
                style={{
                  backgroundImage: images[0],
                  background: `url("${
                    images[Math.floor(Math.random() * images.length)]
                  }")`,
                  margin: "10px",
                  width: "100px",
                  height: "100px",
                  display: "inline-block",
                  userSelect: "none",
                  // scrollSnapAlign: "center",
                }}
              ></div>
            ))}
          </HorizontalScrollView>
        </div>
      </div>
    </>
  );
};

interface HorizontalScrollContainerProps {
  children: React.ReactNode;
}

const HorizontalScrollView: React.FC<HorizontalScrollContainerProps> = ({
  children,
}) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState<number>(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsDown(true);
    setStartX(e.pageX - (boxRef.current?.offsetLeft ?? 0));
    setScrollLeft(boxRef.current?.scrollLeft ?? 0);
    if (boxRef.current) {
      boxRef.current.style.cursor = "grabbing";
    }
  };

  const handleMouseUp = () => {
    setIsDown(false);
    if (boxRef.current) {
      boxRef.current.style.cursor = "grab";
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!isDown || !boxRef.current) return;
    e.preventDefault();
    const x = e.pageX - (boxRef.current.offsetLeft ?? 0);
    const walkX = (x - startX) * 1; // Change this number to adjust the scroll speed
    boxRef.current.scrollLeft = scrollLeft - walkX * 2;
  };

  return (
    <div
      ref={boxRef}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      style={{
        width: "100%",
        height: "100%",
        overflowX: "auto",
        scrollbarWidth: "none",
        overflowY: "hidden",
        whiteSpace: "nowrap",
        scrollSnapType: "x mandatory",
        scrollBehavior: "smooth",
      }}
    >
      {children}
    </div>
  );
};

export default HorizontalScrollView;
