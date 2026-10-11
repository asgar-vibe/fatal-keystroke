import React from 'react';

interface ScanlineOverlayProps {
  showScanlines?: boolean;
  showVignette?: boolean;
}

export const ScanlineOverlay: React.FC<ScanlineOverlayProps> = ({
  showScanlines = true,
  showVignette = true,
}) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden select-none">
      {/* Scanlines Effect */}
      {showScanlines && (
        <div 
          className="absolute inset-0 scanline-layer opacity-40 mix-blend-screen"
          aria-hidden="true" 
        />
      )}

      {/* CRT Vignette Edge Shadow */}
      {showVignette && (
        <div 
          className="absolute inset-0 crt-vignette opacity-80"
          aria-hidden="true" 
        />
      )}

      {/* Subtle CRT Phosphor Glow Tint */}
      <div 
        className="absolute inset-0 bg-[#00ff66]/[0.012] mix-blend-color-dodge"
        aria-hidden="true" 
      />
    </div>
  );
};
