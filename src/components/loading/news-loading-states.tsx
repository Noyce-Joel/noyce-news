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
  src,
  width = "40%",
  height = "auto",
  controls = false,
  autoPlay = true,
  muted = false,
  loop = false
}) => {
  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <video
        src={src}
        width={width}
        height={height}
        controls={controls}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline
        onLoadedMetadata={(e) => {
          e.currentTarget.currentTime = 2;
        }}
        className="opacity-80"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};
