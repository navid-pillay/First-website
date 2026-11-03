import type { CSSProperties } from "react";

// A slow 3v3 move: overlap, underlap, passes and a shot; players drift with the play (About hero).
export default function ThreeVThree() {
  return (
      <svg className="hero-bg" aria-hidden="true" focusable="false" viewBox="0 0 1200 340" preserveAspectRatio="xMidYMid slice" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round">
      <g className="pitch">
      <rect x="260" y="50" width="680" height="240"/>
      <line x1="600" y1="50" x2="600" y2="290" strokeDasharray="8 10"/>
      <path d="M260 140H236V200H260"/>
      <path d="M940 140H964V200H940"/>
      <rect x="70" y="60" width="60" height="220"/>
      <line x1="70" y1="87" x2="130" y2="87"/>
      <line x1="70" y1="114" x2="130" y2="114"/>
      <line x1="70" y1="141" x2="130" y2="141"/>
      <line x1="70" y1="168" x2="130" y2="168"/>
      <line x1="70" y1="195" x2="130" y2="195"/>
      <line x1="70" y1="222" x2="130" y2="222"/>
      <line x1="70" y1="249" x2="130" y2="249"/>
      <line x1="70" y1="276" x2="130" y2="276"/>
      </g>
      <polygon className="mark cone" style={{ "--d": "7.0s", "--delay": "0.0s" } as CSSProperties} points="260,41 268,56 252,56"/>
      <polygon className="mark cone" style={{ "--d": "8.3s", "--delay": "6.4s" } as CSSProperties} points="940,41 948,56 932,56"/>
      <polygon className="mark cone" style={{ "--d": "9.6s", "--delay": "5.8s" } as CSSProperties} points="260,281 268,296 252,296"/>
      <polygon className="mark cone" style={{ "--d": "10.9s", "--delay": "5.2s" } as CSSProperties} points="940,281 948,296 932,296"/>
      <polygon className="mark cone" style={{ "--d": "8.2s", "--delay": "0.6s" } as CSSProperties} points="600,41 608,56 592,56"/>
      <polygon className="mark cone" style={{ "--d": "9.5s", "--delay": "0.0s" } as CSSProperties} points="600,281 608,296 592,296"/>
      <polygon className="mark cone" style={{ "--d": "10.8s", "--delay": "10.2s" } as CSSProperties} points="1050,61 1058,76 1042,76"/>
      <polygon className="mark cone" style={{ "--d": "8.1s", "--delay": "2.9s" } as CSSProperties} points="1050,116 1058,131 1042,131"/>
      <polygon className="mark cone" style={{ "--d": "9.4s", "--delay": "3.6s" } as CSSProperties} points="1050,171 1058,186 1042,186"/>
      <polygon className="mark cone" style={{ "--d": "10.7s", "--delay": "4.3s" } as CSSProperties} points="1050,226 1058,241 1042,241"/>
      <polygon className="mark cone" style={{ "--d": "8.0s", "--delay": "5.0s" } as CSSProperties} points="1050,281 1058,296 1042,296"/>
      <g className="run" style={{ "--delay": "1.44s" } as CSSProperties}>
      <path d="M374 162Q470 30 625 72" strokeDasharray="6 9"/>
      <polygon points="625,72 607.7,74.6 611.4,61.1"/>
      </g>
      <g className="run" style={{ "--delay": "6.72s" } as CSSProperties}>
      <path d="M482 244Q590 250 700 190" strokeDasharray="6 9"/>
      <polygon points="700,190 689.3,203.8 682.6,191.5"/>
      </g>
      <g className="seq" style={{ "--delay": "0.96s" } as CSSProperties}>
      <path className="line" pathLength="1" d="M364 168Q420 120 494 107"/>
      <polygon className="head" points="494,107 479.5,116.7 477.0,102.9"/>
      </g>
      <g className="seq" style={{ "--delay": "6.24s" } as CSSProperties}>
      <path className="line" pathLength="1" d="M541 120Q590 120 656 76"/>
      <polygon className="head" points="656,76 646.8,90.8 639.0,79.2"/>
      </g>
      <g className="seq" style={{ "--delay": "11.04s" } as CSSProperties}>
      <path className="line" pathLength="1" d="M706 85Q725 140 707 188"/>
      <polygon className="head" points="707,188 705.9,170.8 719.0,175.8"/>
      </g>
      <g className="seq" style={{ "--delay": "12.96s" } as CSSProperties}>
      <path className="line" pathLength="1" d="M708 188Q840 205 948 172"/>
      <polygon className="head" points="948,172 934.7,183.4 930.7,170.0"/>
      </g>
      <circle className="ball seq-ball" style={{ "--delay": "12.96s" } as CSSProperties} cx="952" cy="170" r="10"/>
      <circle className="player p-o1" r="10"/>
      <circle className="player p-o2" r="10"/>
      <circle className="player p-o3" r="10"/>
      <path className="player p-x1" d="M-10 -10L10 10M10 -10L-10 10"/>
      <path className="player p-x2" d="M-10 -10L10 10M10 -10L-10 10"/>
      <path className="player p-x3" d="M-10 -10L10 10M10 -10L-10 10"/>
      </svg>
  );
}
