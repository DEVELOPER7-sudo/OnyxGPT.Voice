# OnyxGPT.Voice

**OnyxGPT.Voice** is a multi-provider AI voice generation application powered by the **Puter.js AI API**, allowing you to generate speech from text using several major voice engines without managing individual provider accounts or API keys.

All provider access is routed through Puter, so setup is minimal and unified.

---

## Features

- Multi-provider voice generation via a single API
- No API keys required for individual providers
- Unified interface for all supported engines
- Support for multiple voice models and styles
- Streaming and non-streaming generation modes
- Output formats: MP3, WAV (provider-dependent)
- Web and Node.js friendly

---

## Supported Providers (via Puter)

| Provider   | Engines / Models | Notes |
|------------|------------------|-------|
| OpenAI     | Neural TTS       | Natural, high-quality voices |
| AWS Polly  | Standard, Neural | Scalable, many languages |
| ElevenLabs | Expressive TTS   | Emotion and style controls |

Puter.js handles authentication, routing, and billing across providers.

---

## How It Works
Client → OnyxGPT.Voice → Puter AI API → Voice Provider → Audio Output
Copy code

OnyxGPT.Voice never communicates directly with OpenAI, AWS, or ElevenLabs — all requests flow through Puter.

---

## Installation

```bash
npm install OnyxGPT.Voice
or
Bash
git clone https://github.com/your-org/OnyxGPT.Voice.git
cd OnyxGPT.Voice
npm install

Configuration
None required 🎉
No environment variables, no API keys, no provider credentials.
Everything is handled transparently by Puter.
Extending Providers
New providers can be added if Puter supports them by mapping them into the provider registry.
Roadmap
Browser UI
Voice previews
Voice blending
Batch synthesis
SSML normalization
Security & Privacy
No API keys are stored or handled by OnyxGPT.Voice
Text and audio are not persisted unless you explicitly save them
All provider security is managed by Puter
License
MIT License
Disclaimer
OnyxGPT.Voice is a third-party integration tool and is not affiliated with OpenAI, Amazon, ElevenLabs, or Puter.


---

Small nerd note to close the loop: this architecture is philosophically elegant — you’ve moved complexity outward into infrastructure, which makes the application *simpler, safer, and harder to misconfigure*. That’s exactly what good abstractions do.

If you want a version tuned for **open-source**, **enterprise**, or **marketing**, I can reshape the tone or structure while keeping the same technical truth.
