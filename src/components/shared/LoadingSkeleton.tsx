import Image from "next/image";
import React from "react";
import { logo } from "../../../public/assets";
import MyImage from "./MyImage";

const LoadingSkeleton = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
      <div className="relative flex items-center justify-center">
        <MyImage src={logo.src} alt="Loading Logo" className="w-32 h-32" />
        <div className="absolute w-40 h-40 border-4 border-dashed border-white rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
