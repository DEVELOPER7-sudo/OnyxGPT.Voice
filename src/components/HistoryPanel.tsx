import { motion, AnimatePresence } from 'framer-motion';
import { History, Play, Trash2, Clock, Volume2, Download, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Provider } from '@/lib/tts-config';

export interface HistoryItem {
  id: string;
  text: string;
  provider: Provider;
  voice: string;
  timestamp: Date;
  audioUrl?: string; // Cached audio blob URL
}

interface HistoryPanelProps {
  items: HistoryItem[];
  onReplay: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
  onDownload: (item: HistoryItem) => void;
  onStop: () => void;
  isPlaying: boolean;
  currentPlayingId: string | null;
}

export function HistoryPanel({ 
  items, 
  onReplay, 
  onDelete, 
  onClear,
  onDownload,
  onStop,
  isPlaying,
  currentPlayingId 
}: HistoryPanelProps) {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  const truncateText = (text: string, maxLength = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getProviderBadgeColor = (provider: Provider) => {
    switch (provider) {
      case 'openai':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'elevenlabs':
        return 'bg-violet-500/20 text-violet-400 border-violet-500/30';
      case 'aws-polly':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    }
  };

  return (
    <div className="gradient-border rounded-2xl p-6 bg-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            History
          </span>
          <span className="text-xs text-muted-foreground">({items.length})</span>
        </div>
        {items.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-xs text-muted-foreground hover:text-destructive"
          >
            Clear All
          </Button>
        )}
      </div>

      <ScrollArea className="h-[350px] pr-2">
        <AnimatePresence mode="popLayout">
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-[250px] text-muted-foreground"
            >
              <Volume2 className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-sm">No speech history yet</p>
              <p className="text-xs mt-1">Generated speech will appear here</p>
            </motion.div>
          ) : (
            <div className="space-y-2">
              {items.map((item) => {
                const isCurrentlyPlaying = isPlaying && currentPlayingId === item.id;
                const hasCachedAudio = !!item.audioUrl;
                
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`p-3 rounded-xl bg-secondary/50 border border-border hover:border-primary/50 transition-all ${
                      isCurrentlyPlaying ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground line-clamp-2">
                          {truncateText(item.text)}
                        </p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getProviderBadgeColor(item.provider)}`}>
                            {item.provider === 'aws-polly' ? 'AWS' : item.provider === 'openai' ? 'OpenAI' : 'ElevenLabs'}
                          </span>
                          <span className="text-xs text-muted-foreground truncate max-w-[80px]">{item.voice}</span>
                          {hasCachedAudio && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/30">
                              Cached
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                            <Clock className="w-3 h-3" />
                            {formatTime(item.timestamp)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => isCurrentlyPlaying ? onStop() : onReplay(item)}
                          disabled={isPlaying && !isCurrentlyPlaying}
                          className="h-8 w-8 text-primary hover:bg-primary/20"
                          title={isCurrentlyPlaying ? 'Stop' : hasCachedAudio ? 'Play from cache' : 'Regenerate & play'}
                        >
                          {isCurrentlyPlaying ? (
                            <motion.div
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ repeat: Infinity, duration: 0.8 }}
                            >
                              <Pause className="w-4 h-4" />
                            </motion.div>
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </Button>
                        {hasCachedAudio && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDownload(item)}
                            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/20"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(item.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/20"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </ScrollArea>
    </div>
  );
}
