import React, { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
import { HEADLINES_AUDIO } from "@/lib/constants";

interface AudioVisualizerProps {
  className?: string;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ className }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const previousPointsRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      if (audioContext) audioContext.close();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [audioContext]);

  const initializeAudio = async (): Promise<void> => {
    if (audioContext) return;

    try {
      const ctx = new window.AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const audio = audioRef.current;
      if (!audio) return;

      const source = ctx.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(ctx.destination);

      setAudioContext(ctx);
    } catch (error) {
      console.error("Failed to initialize audio:", error);
    }
  };

  const drawVisualizer = (): void => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const analyser = analyserRef.current;

    if (!analyser || !ctx || !canvas) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = (): void => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const midRangeStart = Math.floor(bufferLength * 0.25);
      const midRangeEnd = Math.floor(bufferLength * 0.75);
      const points = Array.from(
        dataArray.slice(midRangeStart, midRangeEnd)
      ).map((value, i) => {
        const prev = previousPointsRef.current[i] || 0;
        const target = (value / 255) * (canvas.height * 1.4);
        return prev * 0.85 + target * 0.15;
      });

      previousPointsRef.current = points;

      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)");
      gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.4)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

      const createCurve = (
        points: number[],
        ctx: CanvasRenderingContext2D,
        canvas: HTMLCanvasElement
      ): void => {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);

        ctx.lineTo(0, canvas.height - points[0]);

        for (let i = 0; i < points.length - 1; i++) {
          const x1 = ((i * canvas.width) / (points.length - 1)) * 2;
          const x2 = (((i + 1) * canvas.width) / (points.length - 1)) * 2;
          const y1 = canvas.height - points[i];
          const y2 = canvas.height - points[i + 1];

          const controlX = (x1 + x2) / 2;
          const controlY = canvas.height - (points[i] + points[i + 1]) / 2;

          ctx.quadraticCurveTo(x1, y1, controlX, controlY);
        }

        ctx.lineTo(canvas.width, canvas.height - points[points.length - 1]);
        ctx.lineTo(canvas.width * 2, canvas.height);
        ctx.closePath();
      };

      ctx.fillStyle = gradient;
      createCurve(points, ctx, canvas);
      ctx.fill();
    };

    draw();
  };

  const togglePlay = async (): Promise<void> => {
    try {
      await initializeAudio();

      if (!isPlaying && audioRef.current) {
        await audioRef.current.play();
        drawVisualizer();
      } else if (audioRef.current) {
        audioRef.current.pause();
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error("Error toggling audio:", error);
    }
  };

  return (
    <div
      className={`relative flex justify-center items-center w-28 h-28 mx-auto border-2 border-white bg-black rounded-full ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full rounded-full"
      />

      <button
        onClick={togglePlay}
        className="relative z-10 p-4 mix-blend-difference rounded-full hover:bg-white text-white hover:text-black  transition-colors"
        type="button"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <Pause className="w-8 h-8" />
        ) : (
          <Play className="w-8 h-8" />
        )}
      </button>

      <audio ref={audioRef} src={HEADLINES_AUDIO} crossOrigin="anonymous" />
    </div>
  );
};

export default AudioVisualizer;
