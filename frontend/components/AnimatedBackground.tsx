import React, { useEffect, useRef, useState } from 'react';

/**
 * Apple-style ambient backdrop: a soft violet/blue gradient mesh that gives
 * the frosted-glass cards something luminous to blur.
 * One slow transform animation (desktop only), GPU-composited, no canvas.
 */
const AnimatedBackground: React.FC = () => {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setShow(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!show) return null;

  return (
    <div ref={ref} className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Gradient mesh, the color that shows through the glass */}
      <div
        className="mesh-blob w-[600px] h-[600px] -top-48 -left-36"
        style={{ background: 'radial-gradient(closest-side, rgba(139, 92, 246, 0.42), rgba(217, 70, 239, 0.14), transparent)' }}
      />
      <div
        className="mesh-blob w-[560px] h-[560px] top-[22%] -right-48"
        style={{ background: 'radial-gradient(closest-side, rgba(59, 130, 246, 0.38), rgba(34, 211, 238, 0.14), transparent)', animationDelay: '-9s' }}
      />
      <div
        className="mesh-blob w-[520px] h-[520px] top-[52%] left-[18%]"
        style={{ background: 'radial-gradient(closest-side, rgba(236, 72, 153, 0.30), rgba(139, 92, 246, 0.16), transparent)', animationDelay: '-17s' }}
      />
      <div
        className="mesh-blob w-[460px] h-[460px] bottom-[-160px] right-[10%]"
        style={{ background: 'radial-gradient(closest-side, rgba(16, 185, 129, 0.26), rgba(59, 130, 246, 0.12), transparent)', animationDelay: '-4s' }}
      />
      <div
        className="mesh-blob w-[380px] h-[380px] top-[8%] left-[38%]"
        style={{ background: 'radial-gradient(closest-side, rgba(244, 114, 182, 0.20), transparent)', animationDelay: '-12s' }}
      />

      {/* Faint dot grid for structure */}
      <div className="dot-grid absolute inset-x-0 top-0 h-[720px]" />
    </div>
  );
};

export default AnimatedBackground;
