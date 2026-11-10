'use client';

import { useChatFontSize, type ChatFontSize } from '@/src/hooks/useChatFontSize';

const OPTIONS: { value: ChatFontSize; label: string }[] = [
  { value: 'small', label: 'Smaller' },
  { value: 'medium', label: 'Follow device' },
  { value: 'large', label: 'Larger' },
];

export function ChatFontSizeSettings() {
  const { size, setSize, scale } = useChatFontSize();
  return (
    <fieldset className="min-w-0">
      <legend className="text-base font-semibold text-text-primary">Message text size</legend>
      <p className="mt-2 mb-3 text-base sm:text-sm text-text-secondary">
        Text follows your device settings. Adjust it here for your conversations.
      </p>
      <div className="grid gap-2 sm:grid-cols-3">
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={size === option.value}
            onClick={() => setSize(option.value)}
            className={`min-h-11 min-w-11 rounded-lg border px-3 py-3 text-base sm:text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${size === option.value ? 'border-accent bg-accent/10 text-text-primary' : 'border-border text-text-secondary hover:bg-surface/5'}`}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="mt-4 rounded-lg border border-border p-4">
        <p className="leading-relaxed text-text-primary" style={{ fontSize: `calc(1.0625rem * ${scale})` }}>
          Explore Quilibrium at your own pace.
        </p>
      </div>
    </fieldset>
  );
}
