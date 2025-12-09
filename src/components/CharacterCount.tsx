import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface CharacterCountProps {
  count: number;
  max: number;
}

export function CharacterCount({ count, max }: CharacterCountProps) {
  const percentage = (count / max) * 100;
  const isNearLimit = percentage > 80;
  const isOverLimit = percentage > 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isOverLimit ? (
            <AlertTriangle className="w-4 h-4 text-destructive" />
          ) : isNearLimit ? (
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
          ) : (
            <CheckCircle className="w-4 h-4 text-primary" />
          )}
          <span
            className={`text-sm font-mono ${
              isOverLimit
                ? 'text-destructive'
                : isNearLimit
                ? 'text-yellow-500'
                : 'text-muted-foreground'
            }`}
          >
            {count.toLocaleString()} / {max.toLocaleString()}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          {Math.max(0, max - count).toLocaleString()} remaining
        </span>
      </div>

      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${
            isOverLimit
              ? 'bg-destructive'
              : isNearLimit
              ? 'bg-yellow-500'
              : 'bg-primary'
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(percentage, 100)}%` }}
          transition={{ type: 'spring', stiffness: 100 }}
        />
      </div>
    </div>
  );
}
