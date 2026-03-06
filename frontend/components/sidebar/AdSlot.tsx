import React from 'react';

// ============================================================
// GOOGLE ADSENSE SETUP — HOW TO ACTIVATE ADS
// ============================================================
// Step 1: Sign up at https://www.google.com/adsense
// Step 2: Get your Publisher ID — looks like ca-pub-XXXXXXXXXXXXXXXX
// Step 3: Create ad units in AdSense dashboard; each gives a data-ad-slot ID
// Step 4: Replace the placeholder values in AD_CLIENT and AD_SLOTS below
// Step 5: Set ADS_ENABLED = true in this file
// Step 6: Add the AdSense script to your index.html <head>:
//   <script
//     async
//     src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
//     crossorigin="anonymous"
//   ></script>
// ============================================================

// Flip to true once you have real AdSense credentials configured
const ADS_ENABLED = false;

// Set to false before production deploy to hide empty placeholder boxes.
// During development, keep true so you can see ad placement in the layout.
const DEV_SHOW_PLACEHOLDERS = true;

// ── Replace these with your real AdSense values ──────────────
const AD_CLIENT = 'ca-pub-XXXXXXXXXXXXXXXX'; // Your AdSense Publisher ID

const AD_SLOTS: Record<string, string> = {
  'sidebar-top': 'XXXXXXXXXX',    // Ad Slot ID from AdSense dashboard
  'sidebar-bottom': 'XXXXXXXXXX', // Ad Slot ID from AdSense dashboard
  'between-blogs': 'XXXXXXXXXX',  // Ad Slot ID from AdSense dashboard
};
// ─────────────────────────────────────────────────────────────

export type AdPosition = 'sidebar-top' | 'sidebar-bottom' | 'between-blogs';

interface AdSlotProps {
  position: AdPosition;
}

const AdSlot: React.FC<AdSlotProps> = ({ position }) => {
  if (ADS_ENABLED) {
    return (
      <div className="my-3 w-full overflow-hidden">
        {/* Google AdSense Unit — do not modify class name */}
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={AD_CLIENT}
          data-ad-slot={AD_SLOTS[position] ?? 'XXXXXXXXXX'}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  if (DEV_SHOW_PLACEHOLDERS) {
    return (
      <div
        className="my-3 w-full flex items-center justify-center rounded-md"
        style={{
          border: '1.5px dashed #6c63ff',
          minHeight: 56,
          background: 'rgba(108,99,255,0.04)',
        }}
      >
        <span className="text-xs text-gray-500 font-mono select-none tracking-wide">
          Ad Unit — {position}
        </span>
      </div>
    );
  }

  // ADS_ENABLED = false, DEV_SHOW_PLACEHOLDERS = false → invisible, no layout shift
  return null;
};

export default AdSlot;
