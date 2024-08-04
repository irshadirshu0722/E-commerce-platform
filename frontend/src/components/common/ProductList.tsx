import React, { ReactNode } from "react";

interface IProps {
  children: ReactNode;
}
export default function ProductList({ children }: IProps) {
  return (
    <ul
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "1rem",
      }}
    >
      {children}
    </ul>
  );
}
