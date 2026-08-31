import type { StatusKind } from "@/lib/status";
import { statusColorVar } from "@/lib/status";

export function StatusIcon({ kind }: { kind: StatusKind }) {
  const color = statusColorVar(kind);
  const common = {
    width: 12,
    height: 12,
    viewBox: "0 0 16 16",
    fill: "none",
    className: "mr-1 inline-block align-[-1px]",
  };

  if (kind === "good") {
    return (
      <svg {...common}>
        <path
          d="M3 8.5L6.5 12L13 4.5"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (kind === "critical") {
    return (
      <svg {...common}>
        <path
          d="M4 4L12 12M12 4L4 12"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (kind === "serious" || kind === "warning") {
    return (
      <svg {...common}>
        <path
          d="M8 2L14.5 13.5H1.5L8 2Z"
          stroke={color}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <line x1="8" y1="6.5" x2="8" y2="9.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="8" cy="11.5" r="0.9" fill={color} />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <line x1="3" y1="8" x2="13" y2="8" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
