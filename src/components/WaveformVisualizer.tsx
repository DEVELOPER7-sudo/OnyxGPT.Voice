import { motion } from 'framer-motion';

interface WaveformVisualizerProps {
  isPlaying: boolean;
  isLoading: boolean;
}

export function WaveformVisualizer({ isPlaying, isLoading }: WaveformVisualizerProps) {
  const bars = 24;
  
  return (
    <div className="flex items-center justify-center gap-1 h-16">
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full bg-gradient-to-t from-primary to-accent"
          initial={{ height: 8 }}
          animate={
            isLoading
              ? {
                  height: [8, 32, 8],
                  opacity: [0.3, 1, 0.3],
                }
              : isPlaying
              ? {
                  height: [8, Math.random() * 48 + 16, 8],
                }
              : { height: 8, opacity: 0.3 }
          }
          transition={
            isLoading || isPlaying
              ? {
                  duration: 0.5 + Math.random() * 0.5,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  delay: i * 0.05,
                }
              : { duration: 0.3 }
          }
        />
      ))}
    </div>
  );
}
