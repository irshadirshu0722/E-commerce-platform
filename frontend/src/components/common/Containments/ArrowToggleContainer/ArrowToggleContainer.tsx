import React, { FC, ReactNode, MouseEvent, useRef } from "react";
import { toggler } from "../../../../utils/toggler";
import "./arrowtogglecontainer.css";
interface ArrowToggleContainerProps {
  children?: ReactNode;
  heading: string;
}

const ArrowToggleContainer: FC<ArrowToggleContainerProps> = ({
  children,
  heading,
}) => {
  const arrowTogglerContainerRef = useRef<HTMLDivElement>(null);
  const arrowTogglerOpenChildrenRef = useRef<HTMLDivElement>(null);

  function onToggle(e: MouseEvent<HTMLDivElement>) {
    const toggler_div = e.currentTarget;
    const open_container = arrowTogglerContainerRef.current;
    const open_container_child = arrowTogglerOpenChildrenRef.current
    if (toggler_div && open_container && open_container_child){
      if (toggler_div) {
          const type = toggler(toggler_div, "open");
          if (type) {
            let total_height = open_container_child.offsetHeight;
            open_container.style.maxHeight = total_height + "px";
          } else {
            open_container.style.maxHeight = 0 + "px";
          }
        } 
      }
  }

  return (
    <div className="arrow-toggle-container-main">
      <div
        className="arrow-toggle-container-toggler"
        onClick={(e) => onToggle(e)}
      >
        <h4 className="arrow-toggle-container-toggler-heading">{heading}</h4>
        <span className="arrow-toggle-container-toggler-btn material-symbols-outlined">
          arrow_downward
        </span>
      </div>
      <div className="arrow-open-container" ref={arrowTogglerContainerRef}>
        {" "}
        {React.Children.map(children, (child) =>
          React.cloneElement(child as React.ReactElement<any>, {
            ref: arrowTogglerOpenChildrenRef,
          })
        )}
      </div>
    </div>
  );
};

export default ArrowToggleContainer;
