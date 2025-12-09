import { motion } from 'framer-motion';
import { BookOpen, Newspaper, MessageCircle, Mic, Brain, Heart } from 'lucide-react';

interface SampleTextPresetsProps {
  onSelect: (text: string) => void;
}

const presets = [
  {
    icon: Newspaper,
    label: 'News',
    text: 'Breaking news from around the world. Scientists have discovered a new species of deep-sea fish that uses bioluminescence to communicate in ways never before seen.',
  },
  {
    icon: BookOpen,
    label: 'Story',
    text: 'Once upon a time, in a land where the mountains touched the clouds and the rivers sang ancient melodies, there lived a young inventor with dreams bigger than the sky itself.',
  },
  {
    icon: MessageCircle,
    label: 'Casual',
    text: "Hey there! Just wanted to check in and see how you're doing. The weather has been absolutely beautiful lately, hasn't it? Perfect for a walk in the park!",
  },
  {
    icon: Mic,
    label: 'Podcast',
    text: "Welcome back to another episode! Today we're diving deep into the fascinating world of artificial intelligence and how it's transforming the way we create content.",
  },
  {
    icon: Brain,
    label: 'Educational',
    text: 'The human brain contains approximately 86 billion neurons, each connected to thousands of others. This intricate network enables everything from breathing to complex problem-solving.',
  },
  {
    icon: Heart,
    label: 'Emotional',
    text: "Sometimes the smallest moments carry the greatest meaning. A kind word, a gentle smile, or a moment of understanding can change someone's entire day.",
  },
];

export function SampleTextPresets({ onSelect }: SampleTextPresetsProps) {
  return (
    <div className="space-y-3">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Quick Samples
      </label>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {presets.map((preset, i) => (
          <motion.button
            key={preset.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => onSelect(preset.text)}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-border bg-card/50 hover:border-primary/50 hover:bg-primary/5 transition-all group"
            title={preset.text.slice(0, 100) + '...'}
          >
            <preset.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
              {preset.label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
