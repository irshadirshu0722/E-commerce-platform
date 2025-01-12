import React from "react";
import copy from "copy-to-clipboard";
interface IProps {
  copyText: string;
}

export const CopyIcon = ({ copyText }: IProps) => {
  return (
    <span
      style={{
        verticalAlign: "middle",
        fontSize: "1.2rem",
        marginLeft: "10px",
      }}
      className="cursor-pointer material-symbols-outlined"
      onClick={() => {
        copy(copyText);
      }}
    >
      content_copy
    </span>
  );
};
