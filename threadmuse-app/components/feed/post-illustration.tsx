import type { IllustrationKind } from "@/types";
import { hashSeed, seededRng } from "@/lib/utils";

/**
 * Per-kind generated SVG illustration. Replaces real artwork until Phase 3
 * gives us Supabase storage URLs to slot in. Deterministic from `seed` so the
 * same post always renders the same image (SSR / hydration safe).
 *
 * Rendered inline (not <img>) so we keep all the perf benefits of a static
 * server component — no extra network requests on page load.
 */

const tints = [
  "#f5cfc0", "#f7c0aa", "#eda692", "#f4a890",
  "#e8b4c8", "#d9a4a4", "#fadccb", "#f7d1b8",
  "#e89280", "#f0bba6",
] as const;

const t = (i: number) => tints[i % tints.length] as string;

export function PostIllustration({
  kind,
  seed,
  className,
}: {
  kind: IllustrationKind;
  /** Anything stable per-post — uuid string, numeric id, or hash. */
  seed: number | string;
  className?: string;
}) {
  const rng = seededRng(seed);
  const pick = (n: number) => Math.floor(rng() * n);
  // Stable numeric form of the seed for arithmetic + SVG ids. UUIDs and
  // numeric ids both flow through this so callers never have to convert.
  const num = hashSeed(seed);

  switch (kind) {
    case "crochet": {
      const bg = t(pick(tints.length));
      const dots: React.JSX.Element[] = [];
      for (let y = 0; y < 14; y++) {
        for (let x = 0; x < 9; x++) {
          const odd = (x + y) % 2;
          dots.push(
            <circle
              key={`${x}-${y}`}
              cx={20 + x * 32}
              cy={20 + y * 28}
              r={odd ? 8 : 6}
              fill={odd ? "#fff" : "rgba(255,255,255,0.55)"}
            />,
          );
        }
      }
      return (
        <svg
          viewBox="0 0 300 420"
          preserveAspectRatio="xMidYMid slice"
          className={className}
          style={{ background: bg, display: "block" }}
          width="100%"
          height="100%"
          aria-hidden
        >
          {dots}
        </svg>
      );
    }

    case "wallpaper": {
      const c1 = t(pick(tints.length));
      const c2 = t(pick(tints.length));
      const gid = `g${num}`;
      const variant = pick(3);
      return (
        <svg
          viewBox="0 0 300 540"
          preserveAspectRatio="xMidYMid slice"
          className={className}
          width="100%" height="100%" aria-hidden
          style={{ display: "block" }}
        >
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={c1} />
              <stop offset="1" stopColor={c2} />
            </linearGradient>
          </defs>
          <rect width="300" height="540" fill={`url(#${gid})`} />
          {variant === 0 &&
            [...Array(6)].map((_, i) => (
              <circle
                key={i}
                cx={50 + i * 50}
                cy={200 + Math.sin(i) * 80}
                r={70 - i * 6}
                fill="rgba(255,255,255,0.18)"
              />
            ))}
          {variant === 1 &&
            [...Array(8)].map((_, i) => (
              <path
                key={i}
                d={`M ${20 + i * 36} 540 Q ${36 + i * 36} ${280 + i * 12} ${52 + i * 36} 540`}
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1.2"
                fill="none"
              />
            ))}
          {variant === 2 && (
            <g opacity="0.55">
              {[...Array(20)].map((_, i) => {
                const x = 30 + (i % 5) * 60;
                const y = 60 + Math.floor(i / 5) * 110;
                return (
                  <path
                    key={i}
                    d={`M${x} ${y} q12 -28 24 0 q12 28 -12 28 q-24 0 -12 -28 z`}
                    fill="rgba(255,255,255,0.5)"
                  />
                );
              })}
            </g>
          )}
        </svg>
      );
    }

    case "print": {
      const accent = t(pick(tints.length));
      return (
        <svg
          viewBox="0 0 300 400"
          preserveAspectRatio="xMidYMid slice"
          className={className}
          width="100%" height="100%" aria-hidden
          style={{ background: "#faf6ef", display: "block" }}
        >
          <g fontFamily="Poppins, serif">
            <text x="40" y="160" fontSize="86" fontWeight="700" fill={accent} letterSpacing="-3">
              Bloom.
            </text>
            <line x1="40" y1="200" x2="220" y2="200" stroke={accent} strokeWidth="2" />
            <text x="40" y="240" fontSize="14" fill="#2a2420" letterSpacing="3">
              A FLORAL STUDY · NO.{(num * 7) % 99}
            </text>
            <text x="40" y="340" fontSize="11" fill="#7a6f66" letterSpacing="2">
              ARCHIVAL PRINT · 11×14"
            </text>
          </g>
        </svg>
      );
    }

    case "planner": {
      const bg = t(pick(tints.length));
      return (
        <svg
          viewBox="0 0 300 360"
          preserveAspectRatio="xMidYMid slice"
          className={className}
          width="100%" height="100%" aria-hidden
          style={{ background: "#fff", display: "block" }}
        >
          <rect x="0" y="0" width="300" height="56" fill={bg} />
          <text x="20" y="36" fontFamily="Poppins" fontSize="20" fontWeight="600" fill="#2a2420">
            Weekly Plan
          </text>
          {[...Array(7)].map((_, i) => (
            <g key={i}>
              <text
                x="20"
                y={94 + i * 36}
                fontFamily="Inter"
                fontSize="11"
                fill="#7a6f66"
                letterSpacing="1.5"
              >
                {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"][i]}
              </text>
              <line
                x1="60"
                y1={91 + i * 36}
                x2="280"
                y2={91 + i * 36}
                stroke="rgba(42,36,32,0.12)"
              />
              {i % 3 === 0 && (
                <rect
                  x="62"
                  y={80 + i * 36}
                  width={50 + (num * 13) % 80}
                  height="14"
                  rx="3"
                  fill={bg}
                  opacity="0.7"
                />
              )}
            </g>
          ))}
        </svg>
      );
    }

    case "embroidery": {
      const c = t(pick(tints.length));
      const c2 = t(pick(tints.length));
      const dots: React.JSX.Element[] = [];
      for (let y = 0; y < 18; y++) {
        for (let x = 0; x < 12; x++) {
          const dx = x - 6;
          const dy = y - 9;
          const r2 = dx * dx + dy * dy;
          if (r2 < 30) {
            dots.push(
              <rect
                key={`${x}-${y}`}
                x={20 + x * 22}
                y={20 + y * 22}
                width="6"
                height="6"
                fill={r2 < 12 ? c : c2}
                transform={`rotate(45 ${23 + x * 22} ${23 + y * 22})`}
              />,
            );
          }
        }
      }
      return (
        <svg
          viewBox="0 0 300 440"
          preserveAspectRatio="xMidYMid slice"
          className={className}
          width="100%" height="100%" aria-hidden
          style={{ background: "#f4ede0", display: "block" }}
        >
          {dots}
        </svg>
      );
    }

    case "knit": {
      const bg = t(pick(tints.length));
      const rows: React.JSX.Element[] = [];
      for (let y = 0; y < 11; y++) {
        for (let x = 0; x < 8; x++) {
          rows.push(
            <path
              key={`${x}-${y}`}
              d={`M${15 + x * 38} ${18 + y * 38} q19 -8 36 0 q-18 24 -36 0z`}
              fill={(x + y) % 2 ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.25)"}
            />,
          );
        }
      }
      return (
        <svg
          viewBox="0 0 300 420"
          preserveAspectRatio="xMidYMid slice"
          className={className}
          width="100%" height="100%" aria-hidden
          style={{ background: bg, display: "block" }}
        >
          {rows}
        </svg>
      );
    }

    case "svg": {
      const c1 = t(pick(tints.length));
      const c2 = t(pick(tints.length));
      const c3 = t(pick(tints.length));
      return (
        <svg
          viewBox="0 0 300 340"
          preserveAspectRatio="xMidYMid slice"
          className={className}
          width="100%" height="100%" aria-hidden
          style={{ background: "#fff9f4", display: "block" }}
        >
          <circle cx="100" cy="120" r="60" fill={c1} />
          <rect x="140" y="60" width="120" height="120" fill={c2} opacity="0.85" />
          <path d="M60 220 L150 280 L240 220 L150 160 Z" fill={c3} opacity="0.8" />
        </svg>
      );
    }

    case "sticker": {
      return (
        <svg
          viewBox="0 0 300 320"
          preserveAspectRatio="xMidYMid slice"
          className={className}
          width="100%" height="100%" aria-hidden
          style={{ background: "#fff", display: "block" }}
        >
          {[...Array(7)].map((_, i) => {
            const x = 30 + (i % 4) * 65 + (i % 2) * 18;
            const y = 40 + Math.floor(i / 4) * 130;
            const c = t(pick(tints.length));
            const shape = pick(4);
            const shapes = [
              <circle key="c" r="32" fill={c} stroke="#fff" strokeWidth="4" />,
              <rect key="r" x="-30" y="-30" width="60" height="60" rx="14" fill={c} stroke="#fff" strokeWidth="4" />,
              <path
                key="s"
                d="M0 -32 L9 -10 L32 -8 L14 6 L20 30 L0 18 L-20 30 L-14 6 L-32 -8 L-9 -10 z"
                fill={c}
                stroke="#fff"
                strokeWidth="4"
              />,
              <path key="e" d="M0 -28 Q26 -28 26 0 Q26 28 0 28 Q-26 28 -26 0 Q-26 -28 0 -28z" fill={c} stroke="#fff" strokeWidth="4" />,
            ];
            return (
              <g key={i} transform={`translate(${x} ${y}) rotate(${rng() * 24 - 12})`}>
                {shapes[shape]}
              </g>
            );
          })}
        </svg>
      );
    }

    case "ai": {
      const c1 = t(pick(tints.length));
      const c2 = t(pick(tints.length));
      const c3 = t(pick(tints.length));
      const gid = `ai${num}`;
      return (
        <svg
          viewBox="0 0 300 440"
          preserveAspectRatio="xMidYMid slice"
          className={className}
          width="100%" height="100%" aria-hidden
          style={{ display: "block" }}
        >
          <defs>
            <radialGradient id={`${gid}a`} cx="0.3" cy="0.3">
              <stop offset="0" stopColor={c1} />
              <stop offset="1" stopColor={c2} stopOpacity="0" />
            </radialGradient>
            <radialGradient id={`${gid}b`} cx="0.7" cy="0.8">
              <stop offset="0" stopColor={c3} />
              <stop offset="1" stopColor={c2} stopOpacity="0" />
            </radialGradient>
            <filter id={`${gid}blur`}>
              <feGaussianBlur stdDeviation="20" />
            </filter>
          </defs>
          <rect width="300" height="440" fill={c2} />
          <g filter={`url(#${gid}blur)`}>
            <circle cx={70 + rng() * 60} cy={120 + rng() * 60} r="120" fill={`url(#${gid}a)`} />
            <circle cx={200 + rng() * 60} cy={300 + rng() * 60} r="140" fill={`url(#${gid}b)`} />
          </g>
        </svg>
      );
    }

    case "home": {
      const bg = t(pick(tints.length));
      const vase = t((pick(tints.length) + 2) % tints.length);
      return (
        <svg
          viewBox="0 0 300 380"
          preserveAspectRatio="xMidYMid slice"
          className={className}
          width="100%" height="100%" aria-hidden
          style={{ background: "#faf6ef", display: "block" }}
        >
          <rect width="300" height="270" fill="#f4ede0" />
          <rect y="270" width="300" height="110" fill="#dccab1" />
          <rect x="80" y="60" width="140" height="160" fill="#fff" stroke="#2a2420" strokeWidth="3" />
          <rect x="100" y="80" width="100" height="120" fill={bg} />
          <circle cx="150" cy="140" r="36" fill="#fff" opacity="0.6" />
          <ellipse cx="60" cy="290" rx="22" ry="8" fill="#2a2420" opacity="0.18" />
          <path d="M44 290 q4 -50 16 -50 q12 0 16 50z" fill={vase} />
        </svg>
      );
    }

    default:
      return null;
  }
}
