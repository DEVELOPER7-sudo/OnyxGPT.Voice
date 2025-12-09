import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitCompare, Play, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { openAIVoices, elevenLabsVoices } from '@/lib/tts-config';

interface VoiceComparisonProps {
  text: string;
  onCompare: (voice: string, provider: 'openai' | 'elevenlabs') => Promise<void>;
  isLoading: boolean;
}

export function VoiceComparison({ text, onCompare, isLoading }: VoiceComparisonProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeVoice, setActiveVoice] = useState<string | null>(null);

  const handleCompare = async (voice: string, provider: 'openai' | 'elevenlabs') => {
    setActiveVoice(voice);
    await onCompare(voice, provider);
    setActiveVoice(null);
  };

  return (
    <div className="gradient-border rounded-2xl p-4 bg-card">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center gap-2">
          <GitCompare className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Voice Comparison
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-4">
              {!text.trim() ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Enter some text to compare voices
                </p>
              ) : (
                <>
                  {/* OpenAI Voices */}
                  <div className="space-y-2">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">
                      OpenAI
                    </span>
                    <div className="grid grid-cols-5 gap-2">
                      {openAIVoices.slice(0, 5).map((voice) => (
                        <Button
                          key={voice.value}
                          size="sm"
                          variant="outline"
                          onClick={() => handleCompare(voice.value, 'openai')}
                          disabled={isLoading}
                          className="text-xs border-border hover:border-primary/50 hover:bg-primary/10"
                        >
                          {isLoading && activeVoice === voice.value ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Play className="w-3 h-3 mr-1" />
                          )}
                          {voice.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* ElevenLabs Voices */}
                  <div className="space-y-2">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">
                      ElevenLabs
                    </span>
                    <div className="grid grid-cols-5 gap-2">
                      {elevenLabsVoices.slice(0, 5).map((voice) => (
                        <Button
                          key={voice.value}
                          size="sm"
                          variant="outline"
                          onClick={() => handleCompare(voice.value, 'elevenlabs')}
                          disabled={isLoading}
                          className="text-xs border-border hover:border-primary/50 hover:bg-primary/10"
                        >
                          {isLoading && activeVoice === voice.value ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Play className="w-3 h-3 mr-1" />
                          )}
                          {voice.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
