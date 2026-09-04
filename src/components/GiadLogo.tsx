import React from 'react';

interface GiadLogoProps {
  className?: string;
  variant?: 'full' | 'symbol' | 'horizontal';
  isLight?: boolean;
}

export const GiadLogo: React.FC<GiadLogoProps> = ({
  className = 'h-10',
  variant = 'full',
  isLight = true,
}) => {
  const primaryColor = isLight ? '#FFFFFF' : '#001B52';
  const logoEmblemColor = isLight ? '#FFFFFF' : '#001B52';
  const logoDotColor = '#00ADEF';
  const accentColor = '#0084CA';
  const subtleTextColor = isLight ? 'rgba(255, 255, 255, 0.75)' : '#64748B';

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3.5 select-none ${className}`}>
      {/* Official Giad Emblem (Transparent Background Vector) */}
      <svg
        viewBox="0 0 520 320"
        className="h-full w-auto shrink-0 aspect-[52/32]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="شعار مجموعة جياد للصناعات الهندسية الرسمي"
      >
        {/* Outer Ellipse Ring */}
        <ellipse
          cx="260"
          cy="150"
          rx="155"
          ry="92"
          stroke={logoEmblemColor}
          strokeWidth="19"
          fill="none"
        />

        {/* Vibrant Cyan Innovation Dot / Eye of "ج" */}
        <ellipse
          cx="312"
          cy="155"
          rx="64"
          ry="44"
          fill={logoDotColor}
        />

        {/* Stylized Arabic "ج" (Geem) Arrow & Swoosh */}
        <path
          d="M 162 104 
             C 208 113, 298 113, 360 104 
             C 320 120, 270 135, 242 138 
             C 208 158, 162 196, 122 234
             C 144 214, 178 186, 204 163 
             C 222 147, 233 140, 235 134
             C 204 130, 176 120, 162 104 Z"
          fill={logoEmblemColor}
        />
      </svg>

      {variant !== 'symbol' && (
        <div className="flex flex-col justify-center leading-tight">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span
              style={{ color: primaryColor }}
              className="text-base sm:text-lg md:text-xl font-bold tracking-tight font-sans whitespace-nowrap"
            >
              مجموعة جـيـاد
            </span>
            <span
              style={{ color: accentColor }}
              className="text-[10px] sm:text-xs font-bold px-1.5 py-0.2 rounded bg-[#0084CA]/15 border border-[#0084CA]/30 font-mono"
            >
              GIAD
            </span>
          </div>
          <span
            style={{ color: subtleTextColor }}
            className="text-[9px] sm:text-[10px] md:text-[11px] font-medium tracking-wide mt-0.5 whitespace-nowrap"
          >
            للصناعات الهندسية <span className="hidden sm:inline">| Engineering Industries</span>
          </span>
        </div>
      )}
    </div>
  );
};
