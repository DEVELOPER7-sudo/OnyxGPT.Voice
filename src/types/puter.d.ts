declare global {
  interface Window {
    puter: {
      ai: {
        txt2speech: (
          text: string,
          options?: {
            language?: string;
            voice?: string;
            engine?: 'standard' | 'neural' | 'long-form' | 'generative';
            provider?: 'aws-polly' | 'openai' | 'elevenlabs';
            model?: string;
            response_format?: 'mp3' | 'wav' | 'opus' | 'aac' | 'flac' | 'pcm';
            output_format?: string;
            instructions?: string;
            voice_settings?: {
              stability?: number;
              similarity_boost?: number;
              speed?: number;
            };
          }
        ) => Promise<HTMLAudioElement>;
      };
    };
  }
}

export {};
