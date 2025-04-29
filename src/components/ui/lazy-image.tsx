
import { useState, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  placeholderSrc?: string;
  aspectRatio?: string;
  blurEffect?: boolean;
}

const LazyImage = ({
  src,
  alt,
  className,
  placeholderSrc = "/placeholder.svg",
  aspectRatio = "16/9",
  blurEffect = true,
  ...props
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    if (!imageRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" } // Start loading the image when it's 200px from entering the viewport
    );
    
    observer.observe(imageRef.current);
    
    return () => {
      if (imageRef.current) {
        observer.disconnect();
      }
    };
  }, []);
  
  return (
    <div
      className={cn(
        "overflow-hidden relative",
        className
      )}
      style={{ aspectRatio }}
    >
      {/* Placeholder or low-quality image */}
      <img
        src={placeholderSrc}
        alt={alt}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isLoaded ? "opacity-0" : "opacity-100"
        )}
        style={{ position: "absolute", top: 0, left: 0 }}
      />
      
      {/* Actual image (only loads when in viewport) */}
      {shouldLoad && (
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          className={cn(
            "w-full h-full object-cover transition-all duration-500",
            isLoaded ? "opacity-100" : "opacity-0",
            blurEffect && !isLoaded ? "blur-xl scale-110" : "blur-0 scale-100"
          )}
          style={{ position: "absolute", top: 0, left: 0 }}
          onLoad={() => setIsLoaded(true)}
          {...props}
        />
      )}
      
      {/* Invisible ref element if image not yet loading */}
      {!shouldLoad && (
        <div
          ref={imageRef}
          className="absolute inset-0"
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default LazyImage;
