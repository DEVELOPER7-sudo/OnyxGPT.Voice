import { getVoicesForProvider, type Provider } from '@/lib/tts-config';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Mic } from 'lucide-react';

interface VoiceSelectorProps {
  provider: Provider;
  value: string;
  onChange: (voice: string) => void;
}

export function VoiceSelector({ provider, value, onChange }: VoiceSelectorProps) {
  const voices = getVoicesForProvider(provider);

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
        <Mic className="w-4 h-4" />
        Voice
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full bg-card border-border h-12">
          <SelectValue placeholder="Select a voice" />
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          {voices.map((voice) => (
            <SelectItem key={voice.value} value={voice.value} className="focus:bg-primary/20">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span>{voice.label}</span>
                {'description' in voice && (
                  <span className="text-xs text-muted-foreground">- {voice.description}</span>
                )}
                {'gender' in voice && (
                  <span className="text-xs text-muted-foreground">({voice.gender})</span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
