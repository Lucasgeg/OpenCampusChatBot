import React from "react";

export const Minimize = ({ size }) => {
  return (
    <svg viewBox="0 0 24 24" width={size | 15} height={size | 15}>
      <path
        fill="currentColor"
        d="M14,14H19V16H16V19H14V14M5,14H10V19H8V16H5V14M8,5H10V10H5V8H8V5M19,8V10H14V5H16V8H19Z"
      ></path>
    </svg>
  );
};
