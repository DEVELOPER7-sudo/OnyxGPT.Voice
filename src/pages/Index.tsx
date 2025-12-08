import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, Volume2, Settings2, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ProviderSelector } from '@/components/ProviderSelector';
import { VoiceSelector } from '@/components/VoiceSelector';
import { SettingsPanel } from '@/components/SettingsPanel';
import { WaveformVisualizer } from '@/components/WaveformVisualizer';
import type { Provider } from '@/lib/tts-config';

const MAX_CHARS = 3000;

export default function Index() {
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Provider & Voice
  const [provider, setProvider] = useState<Provider>('openai');
  const [voice, setVoice] = useState('onyx');
  
  // AWS Polly settings
  const [language, setLanguage] = useState('en-US');
  const [engine, setEngine] = useState('neural');
  
  // Model & Format
  const [model, setModel] = useState('gpt-4o-mini-tts');
  const [format, setFormat] = useState('mp3');
  
  // OpenAI instructions
  const [instructions, setInstructions] = useState('');
  
  // ElevenLabs voice settings
  const [stability, setStability] = useState(0.5);
  const [similarityBoost, setSimilarityBoost] = useState(0.75);
  const [speed, setSpeed] = useState(1.0);

  const handleProviderChange = (newProvider: Provider) => {
    setProvider(newProvider);
    // Reset voice to default for new provider
    if (newProvider === 'aws-polly') {
      setVoice('Joanna');
      setEngine('neural');
    } else if (newProvider === 'openai') {
      setVoice('onyx');
      setModel('gpt-4o-mini-tts');
      setFormat('mp3');
    } else {
      setVoice('21m00Tcm4TlvDq8ikWAM');
      setModel('eleven_multilingual_v2');
      setFormat('mp3_44100_128');
    }
  };

  const handleSpeak = async () => {
    if (!text.trim()) {
      toast({
        title: 'No text provided',
        description: 'Please enter some text to convert to speech.',
        variant: 'destructive',
      });
      return;
    }

    if (text.length > MAX_CHARS) {
      toast({
        title: 'Text too long',
        description: `Text must be less than ${MAX_CHARS} characters.`,
        variant: 'destructive',
      });
      return;
    }

    // Stop any existing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setIsLoading(true);

    try {
      const options: Record<string, unknown> = {
        provider,
        voice,
      };

      if (provider === 'aws-polly') {
        options.language = language;
        options.engine = engine;
      } else if (provider === 'openai') {
        options.model = model;
        options.response_format = format;
        if (instructions.trim()) {
          options.instructions = instructions;
        }
      } else if (provider === 'elevenlabs') {
        options.model = model;
        options.output_format = format;
        options.voice_settings = {
          stability,
          similarity_boost: similarityBoost,
          speed,
        };
      }

      const audio = await window.puter.ai.txt2speech(text, options as Parameters<typeof window.puter.ai.txt2speech>[1]);
      audioRef.current = audio;
      
      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
      audio.onpause = () => setIsPlaying(false);
      audio.onerror = () => {
        setIsPlaying(false);
        toast({
          title: 'Playback error',
          description: 'Failed to play the audio.',
          variant: 'destructive',
        });
      };

      await audio.play();
    } catch (error) {
      console.error('TTS Error:', error);
      toast({
        title: 'Synthesis failed',
        description: error instanceof Error ? error.message : 'Failed to convert text to speech.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsPlaying(false);
  };

  const charCount = text.length;
  const charPercentage = (charCount / MAX_CHARS) * 100;

  return (
    <div className="min-h-screen bg-background bg-noise relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow delay-1000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Volume2 className="w-12 h-12 text-primary" />
              <Sparkles className="w-5 h-5 text-accent absolute -top-1 -right-1" />
            </div>
            <h1 className="text-5xl font-bold text-gradient">OnyxGPT.Voice</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Transform text into natural speech with AI-powered voices
          </p>
        </motion.header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Text Input */}
            <div className="gradient-border rounded-2xl p-6 bg-card">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Your Text
                  </label>
                  <span className={`text-sm font-mono ${charPercentage > 90 ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
                  </span>
                </div>
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter the text you want to convert to speech..."
                  className="min-h-[200px] bg-secondary/50 border-border text-lg resize-none focus:ring-primary"
                />
                <div className="h-1 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${charPercentage > 90 ? 'bg-destructive' : 'bg-primary'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(charPercentage, 100)}%` }}
                    transition={{ type: 'spring', stiffness: 100 }}
                  />
                </div>
              </div>
            </div>

            {/* Provider Selection */}
            <div className="gradient-border rounded-2xl p-6 bg-card">
              <ProviderSelector value={provider} onChange={handleProviderChange} />
            </div>

            {/* Voice Selection */}
            <div className="gradient-border rounded-2xl p-6 bg-card">
              <VoiceSelector provider={provider} value={voice} onChange={setVoice} />
            </div>

            {/* Waveform & Controls */}
            <div className="gradient-border rounded-2xl p-6 bg-card">
              <WaveformVisualizer isPlaying={isPlaying} isLoading={isLoading} />
              
              <div className="flex items-center justify-center gap-4 mt-6">
                <AnimatePresence mode="wait">
                  {isPlaying ? (
                    <motion.div
                      key="stop"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                    >
                      <Button
                        size="lg"
                        variant="destructive"
                        onClick={handleStop}
                        className="h-14 px-8 text-lg font-semibold"
                      >
                        <Square className="w-5 h-5 mr-2 fill-current" />
                        Stop
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="speak"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                    >
                      <Button
                        size="lg"
                        onClick={handleSpeak}
                        disabled={isLoading || !text.trim()}
                        className="h-14 px-8 text-lg font-semibold glow-primary bg-primary hover:bg-primary/90"
                      >
                        {isLoading ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              className="w-5 h-5 mr-2 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                            />
                            Synthesizing...
                          </>
                        ) : (
                          <>
                            <Play className="w-5 h-5 mr-2 fill-current" />
                            Speak
                          </>
                        )}
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Settings Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="gradient-border rounded-2xl p-6 bg-card">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center justify-between w-full text-left"
              >
                <div className="flex items-center gap-2">
                  <Settings2 className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Advanced Settings
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: showSettings ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
              </button>
              
              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-6 border-t border-border mt-4">
                      <SettingsPanel
                        provider={provider}
                        language={language}
                        engine={engine}
                        model={model}
                        format={format}
                        instructions={instructions}
                        stability={stability}
                        similarityBoost={similarityBoost}
                        speed={speed}
                        onLanguageChange={setLanguage}
                        onEngineChange={setEngine}
                        onModelChange={setModel}
                        onFormatChange={setFormat}
                        onInstructionsChange={setInstructions}
                        onStabilityChange={setStability}
                        onSimilarityBoostChange={setSimilarityBoost}
                        onSpeedChange={setSpeed}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Info Card */}
            <div className="rounded-2xl p-6 bg-secondary/30 border border-border">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>
                    <strong className="text-foreground">Powered by Puter.js</strong> - Uses AI providers including OpenAI, ElevenLabs, and AWS Polly.
                  </p>
                  <p>
                    Different providers offer unique voice characteristics and customization options.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 text-sm text-muted-foreground"
        >
          Built with Puter.js Text-to-Speech API
        </motion.footer>
      </div>
    </div>
  );
}
