import React, { ReactNode } from "react";
import "./dropdownlist.css";
// Define props interface extending from SelectHTMLAttributes
interface DropdownListProps {
 children:ReactNode
}

// Use DropdownListProps as the type for the props
export const DropdownList: React.FC<DropdownListProps> = ({
  children,
}) => {
  return (
    <div className="drop-down-list ">
      {children}
    </div>
  );
};
