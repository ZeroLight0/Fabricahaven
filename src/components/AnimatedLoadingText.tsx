"use client";

import { useEffect, useState } from "react";

const DEFAULT_MESSAGES = [
  "This could take a little while…",
  "We're still on it…",
  "Our AI is working…",
  "Just a few more seconds…",
];

interface Props {
  /** Shown immediately, before `delayMs` elapses. */
  initialText: string;
  /** Rotating reassurance messages shown once the wait drags on. */
  messages?: string[];
  /** How long to wait before switching to rotating messages (ms). */
  delayMs?: number;
  /** How often to rotate between messages once shown (ms). */
  intervalMs?: number;
  className?: string;
}

export default function AnimatedLoadingText({
  initialText,
  messages = DEFAULT_MESSAGES,
  delayMs = 6000,
  intervalMs = 2800,
  className = "text-sm text-espresso-muted",
}: Props) {
  const [showReassurance, setShowReassurance] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const delayTimer = setTimeout(() => setShowReassurance(true), delayMs);
    return () => clearTimeout(delayTimer);
  }, [delayMs]);

  useEffect(() => {
    if (!showReassurance) return;
    const rotateTimer = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, intervalMs);
    return () => clearInterval(rotateTimer);
  }, [showReassurance, messages, intervalMs]);

  const text = showReassurance ? messages[index] : initialText;

  return (
    <p className={className} role="status" aria-live="polite">
      <span key={showReassurance ? `msg-${index}` : "initial"} className="inline-block animate-fade-in">
        {text}
      </span>
    </p>
  );
}
