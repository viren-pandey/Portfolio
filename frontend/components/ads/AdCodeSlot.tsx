import React, { useEffect, useRef } from 'react';

interface AdCodeSlotProps {
  code: string;
  className?: string;
}

const AdCodeSlot: React.FC<AdCodeSlotProps> = ({ code, className }) => {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !code.trim()) return;

    host.innerHTML = code;

    // script tags injected via innerHTML do not execute; recreate them.
    const scripts = Array.from(host.querySelectorAll('script'));
    scripts.forEach((oldScript) => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      newScript.textContent = oldScript.textContent;
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });

    return () => {
      host.innerHTML = '';
    };
  }, [code]);

  if (!code.trim()) return null;

  return <div ref={hostRef} className={className} />;
};

export default AdCodeSlot;
