import { type Provider, languages, awsEngines, openAIModels, elevenLabsModels, openAIFormats, elevenLabsFormats } from '@/lib/tts-config';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Globe, Cpu, FileAudio, MessageSquare, Sliders } from 'lucide-react';

interface SettingsPanelProps {
  provider: Provider;
  language: string;
  engine: string;
  model: string;
  format: string;
  instructions: string;
  stability: number;
  similarityBoost: number;
  speed: number;
  onLanguageChange: (value: string) => void;
  onEngineChange: (value: string) => void;
  onModelChange: (value: string) => void;
  onFormatChange: (value: string) => void;
  onInstructionsChange: (value: string) => void;
  onStabilityChange: (value: number) => void;
  onSimilarityBoostChange: (value: number) => void;
  onSpeedChange: (value: number) => void;
}

export function SettingsPanel({
  provider,
  language,
  engine,
  model,
  format,
  instructions,
  stability,
  similarityBoost,
  speed,
  onLanguageChange,
  onEngineChange,
  onModelChange,
  onFormatChange,
  onInstructionsChange,
  onStabilityChange,
  onSimilarityBoostChange,
  onSpeedChange,
}: SettingsPanelProps) {
  const models = provider === 'openai' ? openAIModels : provider === 'elevenlabs' ? elevenLabsModels : null;
  const formats = provider === 'openai' ? openAIFormats : provider === 'elevenlabs' ? elevenLabsFormats : null;

  return (
    <div className="space-y-6">
      {/* Language - AWS Polly only */}
      {provider === 'aws-polly' && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Language
          </label>
          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger className="w-full bg-card border-border h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border max-h-64">
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value} className="focus:bg-primary/20">
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Engine - AWS Polly only */}
      {provider === 'aws-polly' && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            Engine
          </label>
          <div className="grid grid-cols-2 gap-2">
            {awsEngines.map((eng) => (
              <button
                key={eng.value}
                onClick={() => onEngineChange(eng.value)}
                className={`p-3 rounded-lg border transition-all ${
                  engine === eng.value
                    ? 'border-primary bg-primary/10 text-foreground'
                    : 'border-border bg-card/50 text-muted-foreground hover:border-muted-foreground/50'
                }`}
              >
                <div className="text-sm font-medium">{eng.label}</div>
                <div className="text-xs opacity-70">{eng.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Model - OpenAI & ElevenLabs */}
      {models && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            Model
          </label>
          <Select value={model} onValueChange={onModelChange}>
            <SelectTrigger className="w-full bg-card border-border h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {models.map((m) => (
                <SelectItem key={m.value} value={m.value} className="focus:bg-primary/20">
                  <span>{m.label}</span>
                  <span className="text-xs text-muted-foreground ml-2">- {m.description}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Format */}
      {formats && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <FileAudio className="w-4 h-4" />
            Output Format
          </label>
          <Select value={format} onValueChange={onFormatChange}>
            <SelectTrigger className="w-full bg-card border-border h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {formats.map((f) => (
                <SelectItem key={f.value} value={f.value} className="focus:bg-primary/20">
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Instructions - OpenAI only */}
      {provider === 'openai' && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Voice Instructions
          </label>
          <Textarea
            value={instructions}
            onChange={(e) => onInstructionsChange(e.target.value)}
            placeholder="E.g., Speak cheerfully with moderate pace..."
            className="bg-card border-border min-h-[80px] resize-none"
          />
        </div>
      )}

      {/* Voice Settings - ElevenLabs only */}
      {provider === 'elevenlabs' && (
        <div className="space-y-6">
          <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4" />
            Voice Settings
          </label>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-sm">Stability</Label>
                <span className="text-sm text-muted-foreground">{stability.toFixed(2)}</span>
              </div>
              <Slider
                value={[stability]}
                onValueChange={([v]) => onStabilityChange(v)}
                min={0}
                max={1}
                step={0.01}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-sm">Similarity Boost</Label>
                <span className="text-sm text-muted-foreground">{similarityBoost.toFixed(2)}</span>
              </div>
              <Slider
                value={[similarityBoost]}
                onValueChange={([v]) => onSimilarityBoostChange(v)}
                min={0}
                max={1}
                step={0.01}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-sm">Speed</Label>
                <span className="text-sm text-muted-foreground">{speed.toFixed(2)}x</span>
              </div>
              <Slider
                value={[speed]}
                onValueChange={([v]) => onSpeedChange(v)}
                min={0.5}
                max={2}
                step={0.05}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
