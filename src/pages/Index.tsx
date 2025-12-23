import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, Settings2, AlertCircle, Download, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ProviderSelector } from '@/components/ProviderSelector';
import { VoiceSelector } from '@/components/VoiceSelector';
import { SettingsPanel } from '@/components/SettingsPanel';
import { WaveformVisualizer } from '@/components/WaveformVisualizer';
import { HistoryPanel, type HistoryItem } from '@/components/HistoryPanel';
import { SampleTextPresets } from '@/components/SampleTextPresets';
import { VoiceComparison } from '@/components/VoiceComparison';
import { AudioProgress } from '@/components/AudioProgress';
import { KeyboardShortcuts } from '@/components/KeyboardShortcuts';
import { CharacterCount } from '@/components/CharacterCount';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import type { Provider } from '@/lib/tts-config';

const MAX_CHARS = 3000;
const HISTORY_KEY = 'onyxgpt-voice-history';

export default function Index() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
  const [comparisonLoading, setComparisonLoading] = useState(false);
  
  // History
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
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
  
  // ElevenLabs voice settings (for display only, not sent to API)
  const [stability, setStability] = useState(0.5);
  const [similarityBoost, setSimilarityBoost] = useState(0.75);
  const [speed, setSpeed] = useState(1.0);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setHistory(parsed.map((item: HistoryItem) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        })));
      } catch {
        console.error('Failed to parse history');
      }
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);


  const handleProviderChange = (newProvider: Provider) => {
    setProvider(newProvider);
    setAudioBlob(null);
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

  const buildTTSOptions = (overrideProvider?: Provider, overrideVoice?: string) => {
    const useProvider = overrideProvider || provider;
    const useVoice = overrideVoice || voice;
    
    // Build options exactly as per Puter.js docs
    if (useProvider === 'aws-polly') {
      return {
        provider: useProvider,
        voice: useVoice,
        language,
        engine,
      };
    } else if (useProvider === 'openai') {
      const opts: Record<string, unknown> = {
        provider: useProvider,
        voice: useVoice,
        model,
        response_format: format,
      };
      if (instructions.trim()) {
        opts.instructions = instructions;
      }
      return opts;
    } else {
      // ElevenLabs - exact format from docs, no extra options
      return {
        provider: 'elevenlabs',
        model,
        voice: useVoice,
        output_format: format,
      };
    }
  };

  // Play audio from cached URL (no API call)
  const playCachedAudio = async (audioUrl: string, historyId: string): Promise<boolean> => {
    try {
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      setCurrentPlayingId(historyId);
      
      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => {
        setIsPlaying(false);
        setCurrentPlayingId(null);
      };
      audio.onpause = () => {
        setIsPlaying(false);
        setCurrentPlayingId(null);
      };
      audio.onerror = () => {
        setIsPlaying(false);
        setCurrentPlayingId(null);
        toast({
          title: 'Playback error',
          description: 'Cached audio failed. Try regenerating.',
          variant: 'destructive',
        });
      };

      await audio.play();
      return true;
    } catch (error) {
      console.error('Cached playback error:', error);
      return false;
    }
  };

  const playAudio = async (
    textToSpeak: string,
    options: Record<string, unknown>,
    historyId?: string
  ): Promise<{ audio: HTMLAudioElement; blobUrl: string } | null> => {
    try {
      console.log('Calling puter.ai.txt2speech with:', { text: textToSpeak.substring(0, 50), options });
      
      const audio = await window.puter.ai.txt2speech(
        textToSpeak,
        options as Parameters<typeof window.puter.ai.txt2speech>[1]
      );
      
      audioRef.current = audio;
      if (historyId) {
        setCurrentPlayingId(historyId);
      }
      
      // Get the blob URL for caching and download
      let blobUrl = '';
      if (audio.src) {
        try {
          const response = await fetch(audio.src);
          const blob = await response.blob();
          blobUrl = URL.createObjectURL(blob);
          setAudioBlob(blob);
        } catch (e) {
          console.log('Could not fetch audio blob');
          blobUrl = audio.src;
        }
      }
      
      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => {
        setIsPlaying(false);
        setCurrentPlayingId(null);
      };
      audio.onpause = () => {
        setIsPlaying(false);
        setCurrentPlayingId(null);
      };
      audio.onerror = () => {
        setIsPlaying(false);
        setCurrentPlayingId(null);
        toast({
          title: 'Playback error',
          description: 'Failed to play the audio.',
          variant: 'destructive',
        });
      };

      await audio.play();
      return { audio, blobUrl };
    } catch (error) {
      console.error('TTS Error:', error);
      const errorObj = error as { message?: string; error?: { message?: string } };
      const errorMessage = errorObj?.error?.message || errorObj?.message || 'Unknown error occurred';
      toast({
        title: 'Synthesis failed',
        description: errorMessage,
        variant: 'destructive',
      });
      return null;
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
    setAudioBlob(null);

    setIsLoading(true);

    const options = buildTTSOptions();
    const newHistoryId = crypto.randomUUID();

    try {
      const result = await playAudio(text, options, newHistoryId);
      
      if (result) {
        // Add to history with cached audio URL
        const newHistoryItem: HistoryItem = {
          id: newHistoryId,
          text: text.trim(),
          provider,
          voice,
          timestamp: new Date(),
          audioUrl: result.blobUrl, // Cache the audio URL
        };
        setHistory((prev) => [newHistoryItem, ...prev].slice(0, 50));
      }
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
    setCurrentPlayingId(null);
  };

  const handleDownload = () => {
    if (!audioBlob) {
      toast({
        title: 'No audio to download',
        description: 'Generate speech first before downloading.',
        variant: 'destructive',
      });
      return;
    }

    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `onyxgpt-voice-${Date.now()}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Download started',
      description: 'Your audio file is being downloaded.',
    });
  };

  const handleReplayHistory = async (item: HistoryItem) => {
    // Stop any existing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // If we have cached audio, use it directly (no API call)
    if (item.audioUrl) {
      await playCachedAudio(item.audioUrl, item.id);
      return;
    }

    // No cache - need to regenerate
    setAudioBlob(null);
    setIsLoading(true);
    const options = buildTTSOptions(item.provider, item.voice);

    try {
      const result = await playAudio(item.text, options, item.id);
      
      // Update history item with cached audio URL
      if (result) {
        setHistory((prev) => 
          prev.map((h) => 
            h.id === item.id ? { ...h, audioUrl: result.blobUrl } : h
          )
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteHistory = (id: string) => {
    // Revoke blob URL to free memory
    const item = history.find((h) => h.id === id);
    if (item?.audioUrl) {
      URL.revokeObjectURL(item.audioUrl);
    }
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearHistory = () => {
    // Revoke all blob URLs
    history.forEach((item) => {
      if (item.audioUrl) {
        URL.revokeObjectURL(item.audioUrl);
      }
    });
    setHistory([]);
  };

  const handleDownloadFromHistory = (item: HistoryItem) => {
    if (!item.audioUrl) {
      toast({
        title: 'No audio available',
        description: 'Play this item first to cache the audio.',
        variant: 'destructive',
      });
      return;
    }

    const a = document.createElement('a');
    a.href = item.audioUrl;
    a.download = `onyxgpt-${item.provider}-${Date.now()}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    toast({
      title: 'Download started',
      description: 'Your audio file is being downloaded.',
    });
  };

  // Voice comparison handler
  const handleVoiceCompare = async (voice: string, provider: 'openai' | 'elevenlabs') => {
    if (!text.trim()) return;
    
    setComparisonLoading(true);
    const options = buildTTSOptions(provider, voice);
    
    try {
      await playAudio(text, options);
    } finally {
      setComparisonLoading(false);
    }
  };

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onSpeak: () => !isLoading && text.trim() && handleSpeak(),
    onStop: handleStop,
    onDownload: handleDownload,
    onToggleSettings: () => setShowSettings(prev => !prev),
    onClearText: () => setText(''),
  });

  const charCount = text.length;
  const charPercentage = (charCount / MAX_CHARS) * 100;

  return (
    <div className="min-h-screen bg-background bg-noise bg-grid relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/15 rounded-full blur-[100px] animate-pulse-slow delay-1000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <img src="/logo-192.png" alt="OnyxGPT.Voice" className="w-10 h-10 rounded-lg" />
            <h1 className="text-3xl font-bold text-gradient">OnyxGPT.Voice</h1>
          </div>
          <div className="flex items-center gap-2">
            <KeyboardShortcuts />
            <ThemeToggle />
          </div>
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
                
                {/* Sample Text Presets */}
                <SampleTextPresets onSelect={setText} />
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
              
              {/* Audio Progress */}
              <AudioProgress audio={audioRef.current} isPlaying={isPlaying} />
              
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
                      className="flex gap-3"
                    >
                      <Button
                        size="lg"
                        onClick={handleSpeak}
                        disabled={isLoading || !text.trim()}
                        className="h-14 px-8 text-lg font-semibold glow-primary bg-primary text-primary-foreground hover:bg-primary/90"
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
                      {audioBlob && (
                        <Button
                          size="lg"
                          variant="outline"
                          onClick={handleDownload}
                          className="h-14 px-6 border-primary/50 text-primary hover:bg-primary/10"
                        >
                          <Download className="w-5 h-5 mr-2" />
                          Download
                        </Button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Settings Panel */}
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

            {/* History Panel */}
            <HistoryPanel
              items={history}
              onReplay={handleReplayHistory}
              onDelete={handleDeleteHistory}
              onClear={handleClearHistory}
              onDownload={handleDownloadFromHistory}
              onStop={handleStop}
              isPlaying={isPlaying}
              currentPlayingId={currentPlayingId}
            />

            {/* Info Card */}
            <div className="rounded-2xl p-6 bg-secondary/30 border border-border">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>
                    <strong className="text-foreground">Powered by Puter.js</strong> - Uses AI providers including OpenAI, ElevenLabs, and AWS Polly.
                  </p>
                  <p>
                    Different providers offer unique voice characteristics.
                  </p>
                </div>
              </div>
            </div>

            {/* Voice Comparison */}
            <VoiceComparison 
              text={text} 
              onCompare={handleVoiceCompare}
              isLoading={comparisonLoading}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
