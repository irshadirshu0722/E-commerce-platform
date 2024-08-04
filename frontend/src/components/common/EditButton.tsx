import React, { MouseEventHandler } from 'react'

interface IProps{
  onClick:MouseEventHandler
}
export const EditButton: React.FC<IProps> = ({ onClick }) => {
  return (
    <button className="edit-btn" onClick={onClick}>
      <span className="material-symbols-outlined">edit</span>
    </button>
  );
};
