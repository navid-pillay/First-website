import type { CSSProperties } from "react";

// Free kicks curling into the corners: green circle for a goal, red for the miss (Contact hero).
export default function FreeKicks() {
  return (
      <svg className="hero-bg" aria-hidden="true" focusable="false" viewBox="0 0 1200 340" preserveAspectRatio="xMaxYMid slice" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round">
      <g className="pitch">
      <line x1="0" y1="270" x2="1200" y2="270"/>
      <path d="M700 270V60H1080V270"/>
      </g>
      <g className="net">
      <line x1="738" y1="60" x2="738" y2="270"/>
      <line x1="776" y1="60" x2="776" y2="270"/>
      <line x1="814" y1="60" x2="814" y2="270"/>
      <line x1="852" y1="60" x2="852" y2="270"/>
      <line x1="890" y1="60" x2="890" y2="270"/>
      <line x1="928" y1="60" x2="928" y2="270"/>
      <line x1="966" y1="60" x2="966" y2="270"/>
      <line x1="1004" y1="60" x2="1004" y2="270"/>
      <line x1="1042" y1="60" x2="1042" y2="270"/>
      <line x1="700" y1="95" x2="1080" y2="95"/>
      <line x1="700" y1="130" x2="1080" y2="130"/>
      <line x1="700" y1="165" x2="1080" y2="165"/>
      <line x1="700" y1="200" x2="1080" y2="200"/>
      <line x1="700" y1="235" x2="1080" y2="235"/>
      </g>
      <path className="mark" style={{ "--d": "7s", "--delay": "0.0s" } as CSSProperties} d="M445 235L465 255M465 235L445 255"/>
      <path className="mark" style={{ "--d": "8s", "--delay": "-1.6s" } as CSSProperties} d="M480 235L500 255M500 235L480 255"/>
      <path className="mark" style={{ "--d": "9s", "--delay": "-3.2s" } as CSSProperties} d="M515 235L535 255M535 235L515 255"/>
      <path className="mark" style={{ "--d": "10s", "--delay": "-4.8s" } as CSSProperties} d="M550 235L570 255M570 235L550 255"/>
      <circle className="mark" style={{ "--d": "6s" } as CSSProperties} cx="170" cy="300" r="12"/>
      <g className="kick goal" style={{ "--delay": "0s" } as CSSProperties}>
      <path className="line" pathLength="1" d="M182 292Q330 -60 728 88"/>
      <circle className="end" cx="728" cy="88" r="12"/>
      </g>
      <g className="kick goal" style={{ "--delay": "5s" } as CSSProperties}>
      <path className="line" pathLength="1" d="M182 292Q720 360 1052 246"/>
      <circle className="end" cx="1052" cy="246" r="12"/>
      </g>
      <g className="kick miss" style={{ "--delay": "10s" } as CSSProperties}>
      <path className="line" pathLength="1" d="M182 292Q720 -40 1140 150"/>
      <circle className="end" cx="1140" cy="150" r="12"/>
      </g>
      <g className="kick goal" style={{ "--delay": "15s" } as CSSProperties}>
      <path className="line" pathLength="1" d="M182 292Q560 -70 1052 88"/>
      <circle className="end" cx="1052" cy="88" r="12"/>
      </g>
      </svg>
  );
}
