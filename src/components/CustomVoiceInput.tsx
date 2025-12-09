import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, Plus, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CustomVoiceInputProps {
  value: string;
  onChange: (voiceId: string) => void;
  provider: string;
}

export function CustomVoiceInput({ value, onChange, provider }: CustomVoiceInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customId, setCustomId] = useState('');

  if (provider !== 'elevenlabs') return null;

  const handleApply = () => {
    if (customId.trim()) {
      onChange(customId.trim());
      setIsOpen(false);
      setCustomId('');
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setCustomId('');
  };

  return (
    <div className="mt-4">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key="button"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(true)}
              className="w-full border-dashed border-primary/50 text-primary hover:bg-primary/10"
            >
              <Plus className="w-4 h-4 mr-2" />
              Use Custom Voice ID
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <KeyRound className="w-4 h-4" />
              <span>Enter ElevenLabs Voice ID</span>
            </div>
            <div className="flex gap-2">
              <Input
                value={customId}
                onChange={(e) => setCustomId(e.target.value)}
                placeholder="e.g., 21m00Tcm4TlvDq8ikWAM"
                className="flex-1 bg-secondary/50 border-border font-mono text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleApply();
                  if (e.key === 'Escape') handleCancel();
                }}
                autoFocus
              />
              <Button
                size="icon"
                onClick={handleApply}
                disabled={!customId.trim()}
                className="bg-primary hover:bg-primary/90"
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleCancel}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Find voice IDs in your ElevenLabs dashboard or use cloned voices
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Show current custom voice if using one */}
      {value && !['21m00Tcm4TlvDq8ikWAM', 'AZnzlk1XvdvUeBnXmlld', 'EXAVITQu4vr4xnSDxMaL', 'ErXwobaYiN019PkySvjV', 'MF3mGyEYCl7XYWbV9V6O', 'TxGEqnHWrfWFTfGW9XjX', 'VR6AewLTigWG4xSOukaG', 'pNInz6obpgDQGcFmaJgB', 'yoZ06aMxZJJ28mfd3POQ'].includes(value) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 px-3 py-2 rounded-lg bg-primary/10 border border-primary/30 flex items-center gap-2"
        >
          <KeyRound className="w-4 h-4 text-primary" />
          <span className="text-sm font-mono text-foreground truncate flex-1">{value}</span>
          <span className="text-xs text-primary">Custom</span>
        </motion.div>
      )}
    </div>
  );
}
