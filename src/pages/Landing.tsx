import { motion } from 'framer-motion';
import { Volume2, Sparkles, Zap, Globe, Mic2, ArrowRight, Wand2, Waves } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    icon: Zap,
    title: 'Multi-Provider',
    description: 'Choose from OpenAI, ElevenLabs, and AWS Polly for the perfect voice',
  },
  {
    icon: Globe,
    title: '30+ Languages',
    description: 'Generate speech in dozens of languages with native accents',
  },
  {
    icon: Mic2,
    title: 'Premium Voices',
    description: 'Access the most natural AI voices available today',
  },
  {
    icon: Wand2,
    title: 'Customizable',
    description: 'Fine-tune speed, stability, and emotional tone',
  },
];

const voices = ['Onyx', 'Nova', 'Echo', 'Shimmer', 'Coral', 'Sage'];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background bg-noise bg-grid relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[100px]"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between py-4"
        >
          <div className="flex items-center gap-2">
            <Volume2 className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-gradient">OnyxGPT.Voice</span>
          </div>
          <Button 
            onClick={() => navigate('/app')}
            className="bg-primary/20 text-primary border border-primary/50 hover:bg-primary hover:text-primary-foreground"
          >
            Launch App
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.header>

        {/* Hero Section */}
        <section className="py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-8"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary">Powered by AI</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              <span className="text-gradient">Transform Text</span>
              <br />
              <span className="text-foreground">Into Natural Speech</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            >
              Experience the most advanced AI-powered text-to-speech synthesis. 
              Choose from premium voices across multiple providers for stunning audio generation.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button
                size="lg"
                onClick={() => navigate('/app')}
                className="h-14 px-8 text-lg font-semibold glow-primary bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Volume2 className="w-5 h-5 mr-2" />
                Start Speaking
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg border-primary/50 text-primary hover:bg-primary/10"
              >
                <Waves className="w-5 h-5 mr-2" />
                Listen to Samples
              </Button>
            </motion.div>

            {/* Voice pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap items-center justify-center gap-3 mt-12"
            >
              {voices.map((voice, i) => (
                <motion.span
                  key={voice}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className="px-4 py-2 rounded-full border border-primary/30 bg-card text-sm text-muted-foreground hover:text-primary hover:border-primary/60 transition-colors cursor-default"
                >
                  {voice}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-gradient">Powerful Features</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Everything you need to create professional audio content
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="gradient-border rounded-2xl p-6 bg-card hover:glow-primary transition-shadow duration-500"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="gradient-border rounded-3xl p-12 bg-card text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Ready to <span className="text-gradient">Transform</span> Your Text?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Start creating stunning AI-generated speech in seconds. No signup required.
              </p>
              <Button
                size="lg"
                onClick={() => navigate('/app')}
                className="h-14 px-10 text-lg font-semibold glow-primary bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Launch OnyxGPT.Voice
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border">
          <p>Built with Puter.js Text-to-Speech API</p>
        </footer>
      </div>
    </div>
  );
}
