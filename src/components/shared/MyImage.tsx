import React from "react";
import { StaticImageData } from "next/image";

// Define the props type for `MyImage`
type MyImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string | StaticImageData; // Accept both string and StaticImageData
  alt: string; // Required for accessibility
  priority?: boolean; // For preloading
  layout?: "fill" | "intrinsic" | "fixed" | "responsive"; // Layout style
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down"; // CSS `object-fit`
  placeholder?: "blur" | "empty"; // Placeholder options
};

const MyImage: React.FC<MyImageProps> = ({
  src, // Properly typed as `string | StaticImageData`
  alt,
  width,
  height,
  className,
  style,
  sizes,
  srcSet,
  objectFit,
  priority,
  layout,
  placeholder,
  ...props // Spread additional props
}: MyImageProps) => {
  // Resolve `src` to a string
  const resolvedSrc =
    typeof src === "string" ? src : (src as StaticImageData).src;

  // Ensure the component only renders an `<img>` tag with no extra wrapping
  return (
    <img
      src={resolvedSrc} // Ensure resolved string URL
      alt={alt} // Accessibility requirement
      width={width} // Respect passed width
      height={height} // Respect passed height
      className={className} // Add custom classes
      sizes={sizes} // Optional sizes
      srcSet={srcSet} // Optional srcSet
      style={{
        objectFit,
        ...style,
      }} // Apply styles directly
      {...props} // Pass additional props
    />
  );
};

export default MyImage;
