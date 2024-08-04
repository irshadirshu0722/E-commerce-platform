import React, { ReactNode, useState, MouseEventHandler } from "react";
import "./filter.css";

interface IProps {
  onFilterReset: MouseEventHandler<HTMLButtonElement>;
  onFilterApply: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
}

export default function Filter({
  children,
  onFilterReset,
  onFilterApply,
}: IProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  function toggleFilter() {
    setIsOpen((prev) => !prev);
  }
  return (
    <div className="custom-filter-container">
      <div className="filter-toggle">
        <div
          className="filter-toggle-group"
          id="filter-toggle-button"
          onClick={toggleFilter}
        >
          <span>Filter products</span>
          <span className="material-symbols-outlined icon">filter_list</span>
        </div>
      </div>
      <div
        className={`filter-container filter-toggle-container ${
          isOpen && "show-filter-container"
        }`}
      >
        {children}
        <div className="filter-apply-btn">
          <button className="btn btn-medium reset-btn" onClick={onFilterReset}>
            Reset
          </button>
          <button className="btn btn-medium apply-btn" onClick={onFilterApply}>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
