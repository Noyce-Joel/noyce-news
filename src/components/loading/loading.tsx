import { motion } from "framer-motion";
import { FC } from "react";

interface VideoPlayerProps {
  src?: string;
  width?: string | number;
  height?: string | number;
  controls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  currentTime?: number;
}

export const Loading: FC<VideoPlayerProps> = ({
  src = "/globe-2.mp4",
  width = "100%",
  height = "auto",
  controls = false,
  autoPlay = true,
  muted = false,
  loop = true,
}) => {
  return (
    <motion.div
      className="flex flex-col justify-center items-center h-screen w-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative flex flex-col justify-center items-center  p-5 rounded-3xl">
        <video
          src={src}
          width={width}
          height={height}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          playsInline
          onLoadedMetadata={(e) => {
            e.currentTarget.currentTime = 1;
          }}
          className="invert grayscale lg:w-32 w-44 h-auto bg-black overflow-hidden" 
          style={{ clipPath: 'inset(0 10px 10px 0)' }}
        >
          Your browser does not support the video tag.
        </video>
        
      </div>
    </motion.div>
  );
};
