interface LogoMarkProps {
  size?: number;
  color?: string;
  className?: string;
}

export default function LogoMark({ size = 40, color = 'currentColor', className = '' }: LogoMarkProps) {
  const c = size / 2;
  const r = size * 0.47;
  const ri = size * 0.28;
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      className={className}
      aria-label="MERIDIAN logo mark"
    >
      <polygon
        points={`${c},${c - r} ${c + r},${c} ${c},${c + r} ${c - r},${c}`}
        fill="none"
        stroke={color}
        strokeWidth={size * 0.05}
      />
      <polygon
        points={`${c},${c - ri} ${c + ri},${c} ${c},${c + ri} ${c - ri},${c}`}
        fill={color}
        opacity="0.25"
      />
      <line x1={c} y1={c - r} x2={c} y2={c + r} stroke={color} strokeWidth={size * 0.025} opacity="0.35" />
      <line x1={c - r} y1={c} x2={c + r} y2={c} stroke={color} strokeWidth={size * 0.025} opacity="0.35" />
    </svg>
  );
}
