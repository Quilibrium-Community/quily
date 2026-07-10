'use client';

import { Icon } from '@/src/components/ui/Icon';

export interface ThinkingStep {
  id: string;
  label: string;
  description?: string;
  status: 'pending' | 'active' | 'completed';
  icon?: 'search' | 'docs' | 'generate';
}

interface ThinkingProcessProps {
  steps: ThinkingStep[];
  isVisible: boolean;
}

/** Shown before any status step arrives (initial submit). */
const THINKING_LABEL = 'Thinking';
/** Shown once retrieval finishes but the LLM hasn't streamed its first token yet. */
const GENERATING_LABEL = 'Writing the answer';

/**
 * Simple thinking process indicator showing current status.
 * Displays the active step with an animated spinner. When no step is active it still
 * renders — "Thinking" before any status arrives, "Writing the answer" once retrieval
 * has completed — so the indicator never blinks out into an empty bubble during the
 * RAG→first-token gap.
 */
export function ThinkingProcess({ steps, isVisible }: ThinkingProcessProps) {
  if (!isVisible) {
    return null;
  }

  const activeStep = steps.find(s => s.status === 'active');
  // No active step: either nothing has started yet (no steps) → "Thinking", or all
  // retrieval steps are done and we're waiting on the first token → "Writing the answer".
  const label = activeStep
    ? activeStep.label
    : steps.length === 0
      ? THINKING_LABEL
      : GENERATING_LABEL;
  const description = activeStep?.description;

  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[95%] sm:max-w-[80%] bg-surface/10 dark:bg-surface/15 rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Animated spinner */}
          <Icon name="loader" size={16} className="text-accent animate-spin shrink-0" />

          {/* Status label and description */}
          <div className="min-w-0">
            <span className="text-sm text-text-primary">{label}</span>
            {description && (
              <span className="text-sm text-text-muted ml-2">
                — {description}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
