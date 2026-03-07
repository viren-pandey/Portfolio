import React, { useEffect, useRef } from 'react';

const ADSENSE_SCRIPT_BASE = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';

type AdSenseWindow = Window & {
  adsbygoogle?: Array<Record<string, unknown>>;
  __adsenseScriptPromise?: Promise<void>;
};

function ensureAdSenseScript(client: string): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();

  const w = window as AdSenseWindow;
  if (w.__adsenseScriptPromise) return w.__adsenseScriptPromise;

  const existing = document.querySelector<HTMLScriptElement>(`script[src*="${ADSENSE_SCRIPT_BASE}"]`);
  if (existing) {
    w.__adsenseScriptPromise = Promise.resolve();
    return w.__adsenseScriptPromise;
  }

  w.__adsenseScriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = `${ADSENSE_SCRIPT_BASE}?client=${encodeURIComponent(client)}`;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load AdSense script'));
    document.head.appendChild(script);
  });

  return w.__adsenseScriptPromise;
}

interface AdSenseUnitProps {
  enabled: boolean;
  client: string;
  slot: string;
  className?: string;
  style?: React.CSSProperties;
}

const AdSenseUnit: React.FC<AdSenseUnitProps> = ({
  enabled,
  client,
  slot,
  className,
  style,
}) => {
  const adRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!enabled || !client || !slot) return;
    if (!adRef.current) return;

    let cancelled = false;

    ensureAdSenseScript(client)
      .then(() => {
        if (cancelled || !adRef.current) return;

        // Avoid duplicate push calls for an already initialized ad element.
        if (adRef.current.getAttribute('data-adsbygoogle-status')) return;

        const w = window as AdSenseWindow;
        try {
          (w.adsbygoogle = w.adsbygoogle || []).push({});
        } catch (err) {
          console.warn('AdSense render error:', err);
        }
      })
      .catch((err) => {
        console.warn('AdSense script load error:', err);
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, client, slot]);

  if (!enabled || !client || !slot) return null;

  return (
    <ins
      ref={(el) => {
        adRef.current = el;
      }}
      className={className ?? 'adsbygoogle'}
      style={{ display: 'block', ...style }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
};

export default AdSenseUnit;
