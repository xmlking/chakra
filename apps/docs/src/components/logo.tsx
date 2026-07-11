interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  const colorCSSRule = `
    svg {
      --logo-color: var(--primary);
    }
  `;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 500 500"
      width="100%"
      height="100%"
      className={className}
    >
      <style>{colorCSSRule}</style>
      <defs>
        <filter id="drop-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.3" floodColor="#000000" />
        </filter>

        <g id="logo-tooth">
          <polygon points="250,30 245,65 255,65" fill="var(--logo-color)" />
        </g>
        <g id="logo-spoke">
          <polygon points="250,152 241,92 250,65 259,92" fill="var(--logo-color)" />
        </g>
      </defs>

      <g stroke="none" filter="url(#drop-shadow)">
        {/* Outer Rim Ring Structure */}
        <path
          d="M250,55 A195,195 0 1,0 251,55 Z M250,75 A175,175 0 1,1 249,75 Z"
          fill="var(--logo-color)"
          opacity="1"
        />

        {/* 108 Serrations Representation (36 geometrically balanced nodes) */}
        <g>
          <use href="#logo-tooth" transform="rotate(0 250 250)" />
          <use href="#logo-tooth" transform="rotate(10 250 250)" />
          <use href="#logo-tooth" transform="rotate(20 250 250)" />
          <use href="#logo-tooth" transform="rotate(30 250 250)" />
          <use href="#logo-tooth" transform="rotate(40 250 250)" />
          <use href="#logo-tooth" transform="rotate(50 250 250)" />
          <use href="#logo-tooth" transform="rotate(60 250 250)" />
          <use href="#logo-tooth" transform="rotate(70 250 250)" />
          <use href="#logo-tooth" transform="rotate(80 250 250)" />
          <use href="#logo-tooth" transform="rotate(90 250 250)" />
          <use href="#logo-tooth" transform="rotate(100 250 250)" />
          <use href="#logo-tooth" transform="rotate(110 250 250)" />
          <use href="#logo-tooth" transform="rotate(120 250 250)" />
          <use href="#logo-tooth" transform="rotate(130 250 250)" />
          <use href="#logo-tooth" transform="rotate(140 250 250)" />
          <use href="#logo-tooth" transform="rotate(150 250 250)" />
          <use href="#logo-tooth" transform="rotate(160 250 250)" />
          <use href="#logo-tooth" transform="rotate(170 250 250)" />
          <use href="#logo-tooth" transform="rotate(180 250 250)" />
          <use href="#logo-tooth" transform="rotate(190 250 250)" />
          <use href="#logo-tooth" transform="rotate(200 250 250)" />
          <use href="#logo-tooth" transform="rotate(210 250 250)" />
          <use href="#logo-tooth" transform="rotate(220 250 250)" />
          <use href="#logo-tooth" transform="rotate(230 250 250)" />
          <use href="#logo-tooth" transform="rotate(240 250 250)" />
          <use href="#logo-tooth" transform="rotate(250 250 250)" />
          <use href="#logo-tooth" transform="rotate(260 250 250)" />
          <use href="#logo-tooth" transform="rotate(270 250 250)" />
          <use href="#logo-tooth" transform="rotate(280 250 250)" />
          <use href="#logo-tooth" transform="rotate(290 250 250)" />
          <use href="#logo-tooth" transform="rotate(300 250 250)" />
          <use href="#logo-tooth" transform="rotate(310 250 250)" />
          <use href="#logo-tooth" transform="rotate(320 250 250)" />
          <use href="#logo-tooth" transform="rotate(330 250 250)" />
          <use href="#logo-tooth" transform="rotate(340 250 250)" />
          <use href="#logo-tooth" transform="rotate(350 250 250)" />
        </g>

        {/* 8 Primary Geometric Directional Weapons Points */}
        <g>
          <use href="#logo-spoke" transform="rotate(0 250 250)" />
          <use href="#logo-spoke" transform="rotate(45 250 250)" />
          <use href="#logo-spoke" transform="rotate(90 250 250)" />
          <use href="#logo-spoke" transform="rotate(135 250 250)" />
          <use href="#logo-spoke" transform="rotate(180 250 250)" />
          <use href="#logo-spoke" transform="rotate(225 250 250)" />
          <use href="#logo-spoke" transform="rotate(270 250 250)" />
          <use href="#logo-spoke" transform="rotate(315 250 250)" />
        </g>

        {/* Inner Core Hub Ring Structure */}
        <path
          d="M250,135 A115,115 0 1,0 251,135 Z M250,147 A103,103 0 1,1 249,147 Z"
          fill="var(--logo-color)"
        />

        {/* Central Sharp Focal Disc Ring */}
        <path
          d="M250,175 A75,75 0 1,0 251,175 Z M250,210 A40,40 0 1,1 249,210 Z"
          fill="var(--logo-color)"
          opacity="1"
        />

        {/* Pure Center Point Anchor Hole */}
        <circle cx="250" cy="250" r="18" fill="var(--logo-color)" />
      </g>
    </svg>
  );
}
