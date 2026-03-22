'use client';

import { memo, useMemo } from 'react';
import { parseFollowUpQuestions } from '@/src/lib/rag/followUpParser';
import { MarkdownRenderer } from './MarkdownRenderer';
import { SourcesCitation } from './SourcesCitation';
import { FollowUpQuestions } from './FollowUpQuestions';
import { CopyButton } from '@/src/components/ui/CopyButton';
import { Icon } from '@/src/components/ui/Icon';
import type { UIMessage } from '@ai-sdk/react';

interface MessageBubbleProps {
  message: UIMessage;
  isStreaming?: boolean;
  followUpQuestions?: string[];
  onFollowUpSelect?: (question: string) => void;
  /** URL of auto-created GitHub issue from a correction */
  correctionIssueUrl?: string;
  /** RAG quality signal for confidence callout */
  ragQuality?: 'high' | 'low' | 'none' | null;
}

/**
 * Streaming-only regexes: strip partial follow-up blocks as they're being typed.
 * For completed messages, parseFollowUpQuestions() handles stripping with Zod validation.
 */

/** Partial ```json code fence during streaming */
const PARTIAL_FOLLOW_UP_REGEX = /```json\s*\n?\s*\[?[\s\S]*$/;

/** Partial bare JSON follow-up during streaming (json prefix optional) */
const PARTIAL_BARE_FOLLOW_UP_REGEX = /\n\s*(?:json\s*\n?\s*)?\["[^\]]*$/;

/**
 * Regex to strip raw tool call text that some models output instead of structured calls.
 * Catches garbage tokens, special unicode separators, and the JSON payload.
 * Examples:
 *   "فتรfunction<｜tool▁sep｜>create_knowledge_issue json {"title": "..."}"
 *   "kontsultatua nostfunction<｜tool▁sep｜>create_knowledge_issue json {"title": "..."}"
 */
const TOOL_CALL_TEXT_REGEX = /[^\n]*create_knowledge_issue[\s\S]*$/;

/**
 * Partial tool call during streaming — catches the beginning of a tool call being typed.
 */
const PARTIAL_TOOL_CALL_REGEX = /[^\n]*create_knowledge_issue[^\n]*$/;

/**
 * Extract text content from UIMessage parts array.
 * UIMessage in AI SDK v6 uses parts[] instead of content string.
 * Also strips follow-up JSON block if present (complete or partial during streaming).
 *
 * For completed messages, delegates to parseFollowUpQuestions() which uses Zod
 * validation — only strips content that is actually a valid follow-up array.
 * This is safe regardless of whether followUpQuestions prop is populated
 * (e.g., when restoring chat history from sidebar).
 */
function getTextContent(message: UIMessage, isStreaming: boolean = false): string {
  if (!message.parts) return '';

  const textParts = message.parts
    .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
    .map((part) => part.text);

  const fullText = textParts.join('');

  // Strip follow-up JSON block and raw tool call text from display
  // During streaming, also strip partial blocks that are being typed
  if (isStreaming) {
    return fullText
      .replace(PARTIAL_FOLLOW_UP_REGEX, '')
      .replace(PARTIAL_BARE_FOLLOW_UP_REGEX, '')
      .replace(PARTIAL_TOOL_CALL_REGEX, '')
      .trimEnd();
  }

  // For completed messages, use the parser to safely strip follow-ups.
  // parseFollowUpQuestions validates with Zod before stripping, so
  // legitimate JSON output won't be removed.
  const { cleanText } = parseFollowUpQuestions(fullText);
  return cleanText.replace(TOOL_CALL_TEXT_REGEX, '').trimEnd();
}

/**
 * Extract source-url parts from UIMessage.
 */
function getSources(message: UIMessage): Array<{ sourceId: string; url: string; title?: string }> {
  if (!message.parts) return [];

  return message.parts
    .filter((part): part is { type: 'source-url'; sourceId: string; url: string; title?: string } =>
      part.type === 'source-url'
    )
    .map((part) => ({
      sourceId: part.sourceId,
      url: part.url,
      title: part.title,
    }));
}

/**
 * Chat message bubble with role-based styling (Claude-style layout).
 *
 * - User messages: right-aligned, in a subtle box
 * - Assistant messages: full width, no box, copy button in footer
 *
 * Memoized to prevent re-renders when other messages in the list update.
 */
export const MessageBubble = memo(function MessageBubble({
  message,
  isStreaming = false,
  followUpQuestions,
  onFollowUpSelect,
  correctionIssueUrl,
  ragQuality,
}: MessageBubbleProps) {
  const isUser = message.role === 'user';

  // Memoize text extraction to avoid recalculating on every render
  const textContent = useMemo(() => getTextContent(message, isStreaming), [message.parts, isStreaming]);
  const sources = useMemo(() => getSources(message), [message.parts]);

  // Determine if confidence warning should show:
  // Only for 'low' quality (chunks retrieved but weak match).
  // 'none' = no retrieval (casual chat) → no warning. 'high' = good match → no warning.
  const showConfidenceWarning = ragQuality === 'low';

  if (isUser) {
    return (
      <div className="flex justify-end mb-6">
        <div className="max-w-[85%] sm:max-w-[70%] bg-surface/10 dark:bg-surface/15 text-text-primary rounded-2xl px-4 py-3">
          <p className="whitespace-pre-wrap">{textContent}</p>
        </div>
      </div>
    );
  }

  // Assistant message - don't render if no text content yet (sources may have arrived first)
  if (!textContent && isStreaming) {
    return null;
  }

  return (
    <div className="mb-6 text-text-primary">
      <MarkdownRenderer content={textContent} isStreaming={isStreaming} />

      {/* Confidence warning - only for low quality (chunks retrieved but weak match) */}
      {!isStreaming && showConfidenceWarning && (
        <div className="callout-warning mt-4 text-base sm:text-sm flex items-start gap-2">
          <Icon name="alert-triangle" size={16} className="shrink-0 mt-0.5" />
          <span>This answer may not be fully supported by official documentation — take it with a grain of salt.</span>
        </div>
      )}

      {/* Sources - show above footer */}
      {!isStreaming && sources.length > 0 && (
        <div className="mt-4">
          <SourcesCitation sources={sources} />
        </div>
      )}

      {/* Correction issue notification */}
      {!isStreaming && correctionIssueUrl && (
        <div className="mt-4 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-sm text-text-secondary">
          <a
            href={correctionIssueUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-unstyled font-medium"
          >
            GitHub issue created
          </a>
          {' — thanks for helping me get smarter.'}
        </div>
      )}

      {/* Follow-up questions - show after sources */}
      {!isStreaming && followUpQuestions && followUpQuestions.length > 0 && onFollowUpSelect && (
        <FollowUpQuestions
          questions={followUpQuestions}
          onSelect={onFollowUpSelect}
        />
      )}

      {/* Disclaimer callout - only show after streaming completes (suppressed when confidence warning shown) */}
      {!isStreaming && !showConfidenceWarning && (
        <div className="callout-info mt-4 text-base sm:text-sm">
          <p>
            I can make mistakes, always check the{' '}
            <a
              href="https://docs.quilibrium.com"
              target="_blank"
              rel="noopener noreferrer"
              className="link-unstyled"
            >
              official docs
            </a>
            . If I&apos;m wrong, tell me the right answer and I&apos;ll flag it for review.
          </p>
        </div>
      )}

      {/* Footer with copy button and disclaimer - only show after streaming completes */}
      {!isStreaming && (
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
          {textContent && (
            <CopyButton
              text={textContent}
              size="lg"
              variant="minimal"
            />
          )}
          <p className="flex items-center gap-2 text-sm text-text-muted">
            <Icon name="alert-circle" size={16} className="shrink-0" />
            <span>
              Always verify with{' '}
              <a
                href="https://docs.quilibrium.com"
                target="_blank"
                rel="noopener noreferrer"
                className="link-muted"
              >
                official docs
              </a>
            </span>
          </p>
        </div>
      )}
    </div>
  );
});
