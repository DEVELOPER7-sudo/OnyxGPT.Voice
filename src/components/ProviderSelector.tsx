import { providers, type Provider } from '@/lib/tts-config';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ProviderSelectorProps {
  value: Provider;
  onChange: (provider: Provider) => void;
}

export function ProviderSelector({ value, onChange }: ProviderSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Provider
      </label>
      <div className="grid grid-cols-3 gap-3">
        {providers.map((provider) => (
          <motion.button
            key={provider.value}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(provider.value as Provider)}
            className={cn(
              'relative p-4 rounded-xl border transition-all duration-300',
              value === provider.value
                ? 'gradient-border glow-primary bg-card'
                : 'border-border bg-card/50 hover:bg-card hover:border-muted-foreground/30'
            )}
          >
            <div className="text-sm font-semibold">{provider.label}</div>
            <div className="text-xs text-muted-foreground mt-1">{provider.description}</div>
            {value === provider.value && (
              <motion.div
                layoutId="provider-indicator"
                className="absolute inset-0 rounded-xl border-2 border-primary"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
