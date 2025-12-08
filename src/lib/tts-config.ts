export type Provider = 'aws-polly' | 'openai' | 'elevenlabs';

export const providers = [
  { value: 'aws-polly', label: 'AWS Polly', description: 'Classic & reliable' },
  { value: 'openai', label: 'OpenAI', description: 'GPT-powered voices' },
  { value: 'elevenlabs', label: 'ElevenLabs', description: 'Ultra-realistic' },
] as const;

export const languages = [
  { value: 'en-US', label: 'English (US)' },
  { value: 'en-GB', label: 'English (British)' },
  { value: 'en-AU', label: 'English (Australian)' },
  { value: 'en-IN', label: 'English (Indian)' },
  { value: 'es-ES', label: 'Spanish (European)' },
  { value: 'es-MX', label: 'Spanish (Mexican)' },
  { value: 'fr-FR', label: 'French' },
  { value: 'fr-CA', label: 'French (Canadian)' },
  { value: 'de-DE', label: 'German' },
  { value: 'it-IT', label: 'Italian' },
  { value: 'pt-BR', label: 'Portuguese (Brazilian)' },
  { value: 'pt-PT', label: 'Portuguese (European)' },
  { value: 'ja-JP', label: 'Japanese' },
  { value: 'ko-KR', label: 'Korean' },
  { value: 'cmn-CN', label: 'Chinese (Mandarin)' },
  { value: 'yue-CN', label: 'Chinese (Cantonese)' },
  { value: 'ar-AE', label: 'Arabic' },
  { value: 'hi-IN', label: 'Hindi' },
  { value: 'ru-RU', label: 'Russian' },
  { value: 'nl-NL', label: 'Dutch' },
  { value: 'pl-PL', label: 'Polish' },
  { value: 'sv-SE', label: 'Swedish' },
  { value: 'da-DK', label: 'Danish' },
  { value: 'fi-FI', label: 'Finnish' },
  { value: 'nb-NO', label: 'Norwegian' },
  { value: 'tr-TR', label: 'Turkish' },
  { value: 'ro-RO', label: 'Romanian' },
  { value: 'is-IS', label: 'Icelandic' },
  { value: 'cy-GB', label: 'Welsh' },
  { value: 'ca-ES', label: 'Catalan' },
] as const;

export const awsPollyVoices = [
  { value: 'Joanna', label: 'Joanna', gender: 'Female' },
  { value: 'Matthew', label: 'Matthew', gender: 'Male' },
  { value: 'Ivy', label: 'Ivy', gender: 'Female (Child)' },
  { value: 'Kendra', label: 'Kendra', gender: 'Female' },
  { value: 'Kimberly', label: 'Kimberly', gender: 'Female' },
  { value: 'Salli', label: 'Salli', gender: 'Female' },
  { value: 'Joey', label: 'Joey', gender: 'Male' },
  { value: 'Justin', label: 'Justin', gender: 'Male (Child)' },
  { value: 'Kevin', label: 'Kevin', gender: 'Male (Child)' },
  { value: 'Ruth', label: 'Ruth', gender: 'Female' },
  { value: 'Stephen', label: 'Stephen', gender: 'Male' },
  { value: 'Amy', label: 'Amy (British)', gender: 'Female' },
  { value: 'Brian', label: 'Brian (British)', gender: 'Male' },
  { value: 'Emma', label: 'Emma (British)', gender: 'Female' },
  { value: 'Aria', label: 'Aria (NZ)', gender: 'Female' },
  { value: 'Ayanda', label: 'Ayanda (SA)', gender: 'Female' },
] as const;

export const openAIVoices = [
  { value: 'alloy', label: 'Alloy', description: 'Neutral & balanced' },
  { value: 'ash', label: 'Ash', description: 'Warm & confident' },
  { value: 'ballad', label: 'Ballad', description: 'Soft & melodic' },
  { value: 'coral', label: 'Coral', description: 'Clear & friendly' },
  { value: 'echo', label: 'Echo', description: 'Deep & resonant' },
  { value: 'fable', label: 'Fable', description: 'Expressive & dynamic' },
  { value: 'nova', label: 'Nova', description: 'Bright & energetic' },
  { value: 'onyx', label: 'Onyx', description: 'Rich & authoritative' },
  { value: 'sage', label: 'Sage', description: 'Calm & wise' },
  { value: 'shimmer', label: 'Shimmer', description: 'Light & airy' },
] as const;

export const elevenLabsVoices = [
  { value: '21m00Tcm4TlvDq8ikWAM', label: 'Rachel', description: 'Sample voice' },
  { value: 'AZnzlk1XvdvUeBnXmlld', label: 'Domi', description: 'Strong & clear' },
  { value: 'EXAVITQu4vr4xnSDxMaL', label: 'Bella', description: 'Soft & gentle' },
  { value: 'ErXwobaYiN019PkySvjV', label: 'Antoni', description: 'Well-rounded' },
  { value: 'MF3mGyEYCl7XYWbV9V6O', label: 'Elli', description: 'Emotional range' },
  { value: 'TxGEqnHWrfWFTfGW9XjX', label: 'Josh', description: 'Deep & young' },
  { value: 'VR6AewLTigWG4xSOukaG', label: 'Arnold', description: 'Crisp & narrative' },
  { value: 'pNInz6obpgDQGcFmaJgB', label: 'Adam', description: 'Deep & mature' },
  { value: 'yoZ06aMxZJJ28mfd3POQ', label: 'Sam', description: 'Raspy & dynamic' },
] as const;

export const awsEngines = [
  { value: 'standard', label: 'Standard', description: 'Basic synthesis' },
  { value: 'neural', label: 'Neural', description: 'More natural' },
  { value: 'long-form', label: 'Long-form', description: 'For longer text' },
  { value: 'generative', label: 'Generative', description: 'Highest quality' },
] as const;

export const openAIModels = [
  { value: 'gpt-4o-mini-tts', label: 'GPT-4o Mini TTS', description: 'Default' },
  { value: 'tts-1', label: 'TTS-1', description: 'Fast & efficient' },
  { value: 'tts-1-hd', label: 'TTS-1 HD', description: 'High quality' },
] as const;

export const elevenLabsModels = [
  { value: 'eleven_multilingual_v2', label: 'Multilingual V2', description: 'Default, 29 languages' },
  { value: 'eleven_flash_v2_5', label: 'Flash V2.5', description: 'Low latency' },
  { value: 'eleven_turbo_v2_5', label: 'Turbo V2.5', description: 'Fast, 32 languages' },
  { value: 'eleven_v3', label: 'V3', description: 'Latest generation' },
] as const;

export const openAIFormats = [
  { value: 'mp3', label: 'MP3' },
  { value: 'wav', label: 'WAV' },
  { value: 'opus', label: 'Opus' },
  { value: 'aac', label: 'AAC' },
  { value: 'flac', label: 'FLAC' },
  { value: 'pcm', label: 'PCM' },
] as const;

export const elevenLabsFormats = [
  { value: 'mp3_44100_128', label: 'MP3 (44.1kHz, 128kbps)' },
  { value: 'mp3_44100_192', label: 'MP3 (44.1kHz, 192kbps)' },
  { value: 'pcm_16000', label: 'PCM (16kHz)' },
  { value: 'pcm_22050', label: 'PCM (22.05kHz)' },
  { value: 'pcm_24000', label: 'PCM (24kHz)' },
  { value: 'ulaw_8000', label: 'μ-law (8kHz)' },
] as const;

export function getVoicesForProvider(provider: Provider) {
  switch (provider) {
    case 'aws-polly':
      return awsPollyVoices;
    case 'openai':
      return openAIVoices;
    case 'elevenlabs':
      return elevenLabsVoices;
  }
}

export function getModelsForProvider(provider: Provider) {
  switch (provider) {
    case 'openai':
      return openAIModels;
    case 'elevenlabs':
      return elevenLabsModels;
    default:
      return null;
  }
}
