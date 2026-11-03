import { useId } from "react";

// The Power FC crest, redrawn as a vector so it stays sharp at every size.
export default function FcCrest({ className = "", title }: { className?: string; title?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      viewBox="0 0 628 800"
      className={`aspect-[628/800] ${className}`}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <defs>
      <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#f7f8f8"/><stop offset="0.35" stopColor="#b9bdbd"/>
      <stop offset="0.6" stopColor="#8e9494"/><stop offset="1" stopColor="#d9dcdc"/>
      </linearGradient>
      <linearGradient id={`${id}-face`} x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0" stopColor="#ffffff"/><stop offset="1" stopColor="#eef0f0"/>
      </linearGradient>
      <linearGradient id={`${id}-gloss`} x1="0" y1="0" x2="0.5" y2="1">
      <stop offset="0" stopColor="#a7abab"/><stop offset="0.55" stopColor="#d9dcdc"/><stop offset="1" stopColor="#f4f5f5"/>
      </linearGradient>
      <linearGradient id={`${id}-green`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#42e202"/><stop offset="1" stopColor="#42e202"/>
      </linearGradient>
      <linearGradient id={`${id}-grey`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#c9cccc"/><stop offset="1" stopColor="#9ea3a3"/>
      </linearGradient>
      <clipPath id={`${id}-inner`}><path d="M92 118 Q314 88 536 118 L544 330 Q540 585 314 732 Q88 585 84 330 Z"/></clipPath>
      </defs>
      <path d="M30 52 Q314 2 598 52 L612 330 Q606 640 314 796 Q22 640 16 330 Z" fill="#ffffff"/>
      <path d="M42 62 Q314 16 586 62 L599 330 Q593 630 314 782 Q35 630 29 330 Z" fill={`url(#${id}-rim)`}/>
      <path d="M92 118 Q314 88 536 118 L544 330 Q540 585 314 732 Q88 585 84 330 Z" fill={`url(#${id}-face)`}/>
      <g clipPath={`url(#${id}-inner)`}>
      <path d="M60 100 L200 100 Q170 330 560 560 L560 760 L60 760 Z" fill={`url(#${id}-gloss)`}/>
      <path d="M200 100 Q170 330 560 560" fill="none" stroke="#ffffff" strokeWidth="8" opacity="0.8"/>
      </g>
      <path d="M92 118 Q314 88 536 118 L544 330 Q540 585 314 732 Q88 585 84 330 Z" fill="none" stroke="#0d0f0e" strokeWidth="9" strokeLinejoin="round"/>
      <text x="314" y="196" textAnchor="middle" fontFamily="var(--font-audiowide), Audiowide, sans-serif" fontSize="64" fill="#0d0f0e" stroke="#0d0f0e" strokeWidth="1.5" letterSpacing="1" transform="translate(28 0) skewX(-10)">POWER FC</text>
      <path d="M287 278 L341 278 L356 322 L314 352 L272 322 Z" fill="#0d0f0e"/>
      <path d="M224 290 Q236 248 282 232 L298 240 L272 268 L232 280 Z" fill="#0d0f0e"/>
      <path d="M404 290 Q392 248 346 232 L330 240 L356 268 L396 280 Z" fill="#0d0f0e"/>
      <path d="M208 322 L238 338 L250 470 L246 606 L232 470 L222 560 L216 420 Z" fill={`url(#${id}-green)`}/>
      <path d="M420 330 L392 346 L382 470 L372 606 L392 470 L402 540 L410 420 Z" fill={`url(#${id}-grey)`}/>
      <path d="M314 380 L350 408 L346 470 L334 540 L328 690 L320 560 L314 715 L308 560 L300 690 L294 540 L282 470 L278 408 Z" fill="#0d0f0e"/>
    </svg>
  );
}
