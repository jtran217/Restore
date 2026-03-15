import { useState, useEffect, useCallback, useRef } from 'react';

const BACKEND_URL = 'http://127.0.0.1:5001';
const SETUP_DONE_KEY = 'flow-setup-done';
const WARMUP_RETRY_MS = 8000;
const WARMUP_TIMEOUT_MS = 5 * 60 * 1000; // 5 min for first-time model download

interface FirstTimeSetupProps {
  onDone: () => void;
}

export function FirstTimeSetup({ onDone }: FirstTimeSetupProps) {
  const [phase, setPhase] = useState<'warmup' | 'permissions' | 'done'>('warmup');
  const [message, setMessage] = useState('Setting up your focus assistant…');
  const [subMessage, setSubMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const markDone = useCallback(() => {
    try {
      localStorage.setItem(SETUP_DONE_KEY, 'true');
    } catch {
      // ignore
    }
    setPhase('done');
    onDone();
  }, [onDone]);

  // Phase 1: call backend warmup (loads model, may download on first run)
  useEffect(() => {
    if (phase !== 'warmup') return;

    let cancelled = false;
    let attempt = 0;

    const run = async () => {
      attempt += 1;
      if (attempt > 1) {
        setMessage('Waiting for setup…');
        setSubMessage('Retrying in a few seconds.');
      } else {
        setMessage('Setting up your focus assistant…');
        setSubMessage('If this is your first time, we’re downloading a small AI model. This can take a few minutes.');
      }
      setError(null);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), WARMUP_TIMEOUT_MS);

      try {
        const res = await fetch(`${BACKEND_URL}/api/setup-warmup`, {
          method: 'POST',
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (cancelled) return;
        if (!res.ok) throw new Error(`Setup check failed: ${res.status}`);
        const data = (await res.json()) as { ready?: boolean };
        if (data.ready) {
          setPhase('permissions');
          setMessage('Almost there');
          setSubMessage('Allow notifications so we can nudge you when you might be getting distracted.');
          return;
        }
        throw new Error('Setup not ready');
      } catch (e) {
        clearTimeout(timeoutId);
        if (cancelled) return;
        const err = e instanceof Error ? e.message : 'Connection failed';
        setError(err);
        setSubMessage('Make sure the backend is running (e.g. flask run in the backend folder). We’ll retry shortly.');
        retryRef.current = setTimeout(run, WARMUP_RETRY_MS);
      }
    };

    run();
    return () => {
      cancelled = true;
      if (retryRef.current) {
        clearTimeout(retryRef.current);
        retryRef.current = null;
      }
    };
  }, [phase]);

  // Phase 2: request notification permission, then finish
  const handleContinue = useCallback(async () => {
    if (phase !== 'permissions') return;
    try {
      if (typeof Notification !== 'undefined' && Notification.requestPermission) {
        await Notification.requestPermission();
      }
    } catch {
      // ignore
    }
    markDone();
  }, [phase, markDone]);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center gap-8"
      style={{
        background: 'var(--color-bg)',
        fontFamily: 'var(--font-ui)',
      }}
    >
      {/* Calming loader */}
      <div className="flex flex-col items-center gap-6">
        <div
          className="rounded-full animate-pulse"
          style={{
            width: 48,
            height: 48,
            background: 'var(--color-primary-surface)',
            animation: 'pulse 2s ease-in-out infinite',
          }}
          aria-hidden
        />
        <div className="text-center max-w-sm">
          <p
            className="text-text-primary font-medium"
            style={{ fontSize: 'var(--text-lg)' }}
          >
            {message}
          </p>
          {subMessage && (
            <p
              className="text-text-secondary mt-2"
              style={{ fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)' }}
            >
              {subMessage}
            </p>
          )}
          {error && (
            <p
              className="text-text-tertiary mt-2"
              style={{ fontSize: 'var(--text-xs)' }}
            >
              {error}
            </p>
          )}
        </div>
      </div>

      {phase === 'permissions' && (
        <button
          type="button"
          onClick={handleContinue}
          className="btn-primary"
          style={{
            padding: 'var(--space-md) var(--space-xl)',
            fontSize: 'var(--text-base)',
          }}
        >
          Continue
        </button>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}

export function isSetupDone(): boolean {
  try {
    return localStorage.getItem(SETUP_DONE_KEY) === 'true';
  } catch {
    return false;
  }
}
