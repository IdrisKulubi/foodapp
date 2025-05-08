'use client';

import { useEffect, useRef } from 'react';

interface GoogleAdProps {
  adSlot: string;
  adFormat?: 'auto' | 'fluid' | 'rectangle';
  style?: React.CSSProperties;
  className?: string;
}

export default function GoogleAd({
  adSlot,
  adFormat = 'auto',
  style,
  className,
}: GoogleAdProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const pushAd = () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const adsbygoogle = (window as any).adsbygoogle;
        if (adsbygoogle) {
          adsbygoogle.push({});
        }
      };

      if (adRef.current && adRef.current.firstChild) {
        pushAd();
      }
    } catch (err) {
      console.error('Error loading Google Ad:', err);
    }
  }, []);

  return (
    <>
      <div
        ref={adRef}
        style={style}
        className={className}
        aria-label="Advertisement"
        role="complementary"
      >
        <ins
          className="adsbygoogle"
          style={{
            display: 'block',
            textAlign: 'center',
            ...style,
          }}
          data-ad-client="ca-pub-4629350890124291"
          data-ad-slot={adSlot}
          data-ad-format={adFormat}
          data-full-width-responsive="true"
        />
      </div>
    </>
  );
} 