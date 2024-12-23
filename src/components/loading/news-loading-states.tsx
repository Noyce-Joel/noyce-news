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

export const NewsLoadingStates: FC<VideoPlayerProps> = ({
  src = "/globe.mov",
  width = "10%",
  height = "auto",
  controls = false,
  autoPlay = true,
  muted = false,
  loop = false,
}) => {
  return (
    <motion.div
      className="flex flex-col justify-center items-center h-screen w-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
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
        className=" invert grayscale"
      >
        Your browser does not support the video tag.
      </video>
      <div className="bg-black w-full h-2 -mt-2 z-50"></div>
    </motion.div>
  );
};
