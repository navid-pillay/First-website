import type { CSSProperties } from "react";

// Full-pitch tactics board: passes draw in and the X's and O's pulse (Power Soccer hero).
export default function TacticsBoard() {
  return (
      <svg className="hero-bg" aria-hidden="true" focusable="false" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round">
      <g className="pitch">
      <rect x="20" y="20" width="1160" height="560"/>
      <line x1="600" y1="20" x2="600" y2="580"/>
      <circle cx="600" cy="300" r="80"/><circle cx="600" cy="300" r="3"/>
      <rect x="20" y="140" width="170" height="320"/><rect x="20" y="225" width="60" height="150"/>
      <path d="M190 248 A70 70 0 0 1 190 352"/>
      <rect x="1010" y="140" width="170" height="320"/><rect x="1120" y="225" width="60" height="150"/>
      <path d="M1010 248 A70 70 0 0 0 1010 352"/>
      </g>
      <circle className="mark" style={{ "--d": "6.0s", "--delay": "-0.0s" } as CSSProperties} cx="150" cy="90" r="10"/>
      <path className="mark" style={{ "--d": "7.7s", "--delay": "-2.3s" } as CSSProperties} d="M220 60L240 80M240 60L220 80"/>
      <path className="mark" style={{ "--d": "9.4s", "--delay": "-4.6s" } as CSSProperties} d="M130 410L150 430M150 410L130 430"/>
      <circle className="mark" style={{ "--d": "6.1s", "--delay": "-0.8s" } as CSSProperties} cx="260" cy="470" r="10"/>
      <path className="mark" style={{ "--d": "7.8s", "--delay": "-1.4s" } as CSSProperties} d="M320 180L340 200M340 180L320 200"/>
      <circle className="mark" style={{ "--d": "9.5s", "--delay": "-2.0s" } as CSSProperties} cx="380" cy="330" r="10"/>
      <path className="mark" style={{ "--d": "6.2s", "--delay": "-1.4s" } as CSSProperties} d="M410 510L430 530M430 510L410 530"/>
      <circle className="mark" style={{ "--d": "7.9s", "--delay": "-0.3s" } as CSSProperties} cx="470" cy="140" r="10"/>
      <path className="mark" style={{ "--d": "9.6s", "--delay": "-8.8s" } as CSSProperties} d="M510 400L530 420M530 400L510 420"/>
      <path className="mark" style={{ "--d": "6.3s", "--delay": "-1.8s" } as CSSProperties} d="M680 150L700 170M700 150L680 170"/>
      <circle className="mark" style={{ "--d": "8.0s", "--delay": "-7.0s" } as CSSProperties} cx="730" cy="470" r="10"/>
      <path className="mark" style={{ "--d": "9.7s", "--delay": "-5.9s" } as CSSProperties} d="M810 290L830 310M830 290L810 310"/>
      <circle className="mark" style={{ "--d": "6.4s", "--delay": "-2.0s" } as CSSProperties} cx="880" cy="520" r="10"/>
      <path className="mark" style={{ "--d": "8.1s", "--delay": "-5.6s" } as CSSProperties} d="M930 190L950 210M950 190L930 210"/>
      <circle className="mark" style={{ "--d": "9.8s", "--delay": "-2.8s" } as CSSProperties} cx="1040" cy="250" r="10"/>
      <path className="mark" style={{ "--d": "6.5s", "--delay": "-2.0s" } as CSSProperties} d="M1090 470L1110 490M1110 470L1090 490"/>
      <circle className="mark" style={{ "--d": "8.2s", "--delay": "-4.0s" } as CSSProperties} cx="1140" cy="90" r="10"/>
      <path className="mark" style={{ "--d": "9.9s", "--delay": "-9.4s" } as CSSProperties} d="M290 320L310 340M310 320L290 340"/>
      <g className="play" style={{ "--delay": "0.0s" } as CSSProperties}>
      <path className="line" pathLength="1" d="M1000 95Q640 30 240 250"/>
      <polygon className="head" points="240,250 253.2,232.5 261.9,248.2"/>
      </g>
      <g className="play" style={{ "--delay": "2.0s" } as CSSProperties}>
      <path className="line" pathLength="1" d="M235 255Q170 262 105 262"/>
      <polygon className="head" points="105,262 125.0,253.0 125.0,271.0"/>
      </g>
      <g className="play" style={{ "--delay": "4.0s" } as CSSProperties}>
      <path className="line" pathLength="1" d="M760 385Q800 190 985 115"/>
      <polygon className="head" points="985,115 969.8,130.9 963.1,114.2"/>
      </g>
      <g className="play" style={{ "--delay": "6.0s" } as CSSProperties}>
      <path className="line" pathLength="1" d="M1000 135Q985 320 785 400"/>
      <polygon className="head" points="785,400 800.2,384.2 806.9,400.9"/>
      </g>
      <g className="play" style={{ "--delay": "8.0s" } as CSSProperties}>
      <path className="line" pathLength="1" d="M1110 110Q1180 250 1070 420"/>
      <polygon className="head" points="1070,420 1073.3,398.3 1088.4,408.1"/>
      </g>
      <g className="play" style={{ "--delay": "10.0s" } as CSSProperties}>
      <path className="line" pathLength="1" d="M1190 330Q1120 330 1085 400"/>
      <polygon className="head" points="1085,400 1085.9,378.1 1102.0,386.1"/>
      </g>
      <circle className="ball" style={{ "--delay": "2s" } as CSSProperties} cx="90" cy="262" r="11"/>
      </svg>
  );
}
