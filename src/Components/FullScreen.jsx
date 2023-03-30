export const FullScreen = ({ size }) => {
  return (
    <svg viewBox="0 0 24 24" width={size | 15} height={size | 15}>
      <path
        fill="#fafafa"
        d="M5,5H10V7H7V10H5V5M14,5H19V10H17V7H14V5M17,14H19V19H14V17H17V14M10,17V19H5V14H7V17H10Z"
      ></path>
    </svg>
  );
};
