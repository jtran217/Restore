import { useState, useEffect } from 'react';
import { ensureLlmReady } from '../lib/api';

type Phase = 'downloading' | 'ready' | 'error';

interface DownloadScreenProps {
  onComplete: () => void;
}

export function DownloadScreen({ onComplete }: DownloadScreenProps) {
  const [phase, setPhase] = useState<Phase>('downloading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const ok = await ensureLlmReady();
      if (cancelled) return;
      if (ok) {
        setPhase('ready');
        const t = setTimeout(() => onComplete(), 800);
        return () => clearTimeout(t);
      }
      setPhase('error');
      setErrorMessage('Download failed. Please check your connection and try again.');
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{
        background: 'var(--color-bg)',
        animation: 'panel-slide-in 600ms var(--ease-emerge) both',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          padding: 'var(--space-2xl)',
          textAlign: 'center',
        }}
      >
        {/* Loader: show when downloading so the screen isn’t blank */}
        {phase === 'downloading' && (
          <div
            role="status"
            aria-label="Downloading"
            style={{
              width: 36,
              height: 36,
              margin: '0 auto var(--space-xl)',
              borderRadius: '50%',
              border: '3px solid var(--color-border)',
              borderTopColor: 'var(--color-focus)',
              animation: 'loader-spin 0.9s var(--ease-flow) infinite',
            }}
          />
        )}

        {/* Headline */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 'var(--text-xl)',
            lineHeight: 'var(--leading-snug)',
            color: 'var(--color-focus)',
            marginBottom: 'var(--space-lg)',
            letterSpacing: 'var(--tracking-tight)',
          }}
        >
          {phase === 'error' ? "Something went wrong" : phase === 'ready' ? "You're all set" : 'Preparing Flow'}
        </h1>

        {/* Body */}
        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 'var(--text-base)',
            lineHeight: 'var(--leading-relaxed)',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--space-2xl)',
          }}
        >
          {phase === 'error'
            ? errorMessage ?? 'Please try again later.'
            : phase === 'ready'
              ? 'Flow is ready. Taking you to the app.'
              : 'Downloading support for calm, personalized guidance. This only happens once.'}
        </p>

        {/* Progress bar (indeterminate) or success indicator */}
        {phase === 'downloading' && (
          <div
            role="progressbar"
            aria-label="Downloading"
            style={{
              height: 6,
              borderRadius: 'var(--radius-pill)',
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
              overflow: 'hidden',
            }}
          >
            <div
              className="download-screen-progress"
              style={{
                height: '100%',
                width: '40%',
                background: 'var(--color-focus)',
                borderRadius: 'var(--radius-pill)',
                animation: 'download-shimmer 1.8s var(--ease-flow) infinite',
              }}
            />
          </div>
        )}

        {phase === 'ready' && (
          <div
            style={{
              width: 40,
              height: 40,
              margin: '0 auto',
              borderRadius: '50%',
              background: 'var(--color-calm-surface)',
              border: '2px solid var(--color-calm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'stagger-in 400ms var(--ease-emerge) both',
            }}
          >
            <span style={{ color: 'var(--color-calm)', fontSize: 20 }}>✓</span>
          </div>
        )}

        {phase === 'error' && (
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              setPhase('downloading');
              setErrorMessage(null);
              ensureLlmReady().then((ok) => {
                if (ok) {
                  setPhase('ready');
                  setTimeout(onComplete, 800);
                } else {
                  setPhase('error');
                  setErrorMessage('Download failed. Please check your connection and try again.');
                }
              });
            }}
            style={{ marginTop: 'var(--space-lg)' }}
          >
            Try again
          </button>
        )}
      </div>

      <style>{`
        @keyframes loader-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes download-shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }
      `}</style>
    </div>
  );
}
