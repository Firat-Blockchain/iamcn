import React from "react";

const CustomButton = ({ btnType, title, handleClick, styles, disabled }) => {
  return (
    <button
      type={btnType}
      className={`font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px] ${styles}`}
      onClick={handleClick}
      disabled={disabled}
      style={{ backgroundColor: disabled ? "#E9DEFF" : "" }}
    >
      {title}
    </button>
  );
};

export default CustomButton;