import type { CSSProperties } from "react";

// A 4-3-3 shape that shifts as a unit while its passing network draws in (Power FC hero).
export default function Formation() {
  return (
      <svg className="hero-bg" aria-hidden="true" focusable="false" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round">
      <g className="pitch">
      <rect x="20" y="20" width="1160" height="560"/>
      <line x1="600" y1="20" x2="600" y2="580"/>
      <circle cx="600" cy="300" r="80"/>
      <rect x="20" y="140" width="170" height="320"/><rect x="1010" y="140" width="170" height="320"/>
      </g>
      <g className="team">
      <line className="link" pathLength="1" style={{ "--delay": "0.0s" } as CSSProperties} x1="110" y1="300" x2="250" y2="230"/>
      <line className="link" pathLength="1" style={{ "--delay": "1.6s" } as CSSProperties} x1="250" y1="230" x2="270" y2="110"/>
      <line className="link" pathLength="1" style={{ "--delay": "3.2s" } as CSSProperties} x1="270" y1="110" x2="450" y2="180"/>
      <line className="link" pathLength="1" style={{ "--delay": "4.8s" } as CSSProperties} x1="450" y1="180" x2="420" y2="300"/>
      <line className="link" pathLength="1" style={{ "--delay": "6.4s" } as CSSProperties} x1="420" y1="300" x2="450" y2="420"/>
      <line className="link" pathLength="1" style={{ "--delay": "8.0s" } as CSSProperties} x1="450" y1="420" x2="680" y2="480"/>
      <line className="link" pathLength="1" style={{ "--delay": "9.6s" } as CSSProperties} x1="680" y1="480" x2="720" y2="300"/>
      <line className="link" pathLength="1" style={{ "--delay": "11.2s" } as CSSProperties} x1="720" y1="300" x2="680" y2="120"/>
      <line className="link" pathLength="1" style={{ "--delay": "12.8s" } as CSSProperties} x1="680" y1="120" x2="450" y2="180"/>
      <line className="link" pathLength="1" style={{ "--delay": "14.4s" } as CSSProperties} x1="450" y1="180" x2="720" y2="300"/>
      <circle className="mark" style={{ "--d": "6.0s", "--delay": "0.0s" } as CSSProperties} cx="110" cy="300" r="10"/>
      <circle className="mark" style={{ "--d": "7.3s", "--delay": "5.6s" } as CSSProperties} cx="270" cy="110" r="10"/>
      <circle className="mark" style={{ "--d": "8.6s", "--delay": "5.2s" } as CSSProperties} cx="250" cy="230" r="10"/>
      <circle className="mark" style={{ "--d": "9.9s", "--delay": "4.8s" } as CSSProperties} cx="250" cy="370" r="10"/>
      <circle className="mark" style={{ "--d": "7.2s", "--delay": "0.4s" } as CSSProperties} cx="270" cy="490" r="10"/>
      <circle className="mark" style={{ "--d": "8.5s", "--delay": "0.0s" } as CSSProperties} cx="450" cy="180" r="10"/>
      <circle className="mark" style={{ "--d": "9.8s", "--delay": "9.4s" } as CSSProperties} cx="420" cy="300" r="10"/>
      <circle className="mark" style={{ "--d": "7.1s", "--delay": "2.3s" } as CSSProperties} cx="450" cy="420" r="10"/>
      <circle className="mark" style={{ "--d": "8.4s", "--delay": "3.2s" } as CSSProperties} cx="680" cy="120" r="10"/>
      <circle className="mark" style={{ "--d": "9.7s", "--delay": "4.1s" } as CSSProperties} cx="720" cy="300" r="10"/>
      <circle className="mark" style={{ "--d": "7.0s", "--delay": "4.0s" } as CSSProperties} cx="680" cy="480" r="10"/>
      </g>
      <g className="opponents">
      <path d="M1081 291L1099 309M1099 291L1081 309"/>
      <path d="M921 111L939 129M939 111L921 129"/>
      <path d="M941 231L959 249M959 231L941 249"/>
      <path d="M941 351L959 369M959 351L941 369"/>
      <path d="M921 471L939 489M939 471L921 489"/>
      <path d="M811 131L829 149M829 131L811 149"/>
      <path d="M831 241L849 259M849 241L831 259"/>
      <path d="M831 341L849 359M849 341L831 359"/>
      <path d="M811 451L829 469M829 451L811 469"/>
      <path d="M731 211L749 229M749 211L731 229"/>
      <path d="M731 371L749 389M749 371L731 389"/>
      </g>
      </svg>
  );
}
