/**
 * 만두를 든 고양이 캐릭터예요.
 *
 * 머리와 귀는 하나의 합집합 path 로 그려요 — 따로 그리면 맞닿는 자리에 외곽선이 남아요.
 * 만두 색만 따로 받을 수 있어서, 실패 화면에서는 칙칙한 색을 넘겨요.
 */

export type CatFace = "normal" | "happy" | "surprised" | "sad";

const HEAD =
  "M63.6 75.5 L60 12 L99.5 39.6 A60 60 0 0 1 140.5 39.6 L180 12 L176.4 75.5 " +
  "A60 60 0 1 1 63.6 75.5 Z";

const MANDU =
  "M65 182 A11 11 0 0 1 87 182 A11 11 0 0 1 109 182 A11 11 0 0 1 131 182 " +
  "A11 11 0 0 1 153 182 A11 11 0 0 1 175 182 A55 53 0 0 1 65 182 Z";

const INK = "#522030";

function Face({ face }: { face: CatFace }) {
  if (face === "happy") {
    return (
      <>
        <path d="M90 96 A11 11 0 0 1 110 96" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <path d="M130 96 A11 11 0 0 1 150 96" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <path d="M108 108 A6 6 0 0 0 120 108 A6 6 0 0 0 132 108" fill="none" stroke={INK} strokeWidth="4.5" strokeLinecap="round" />
      </>
    );
  }
  if (face === "surprised") {
    return (
      <>
        <circle cx="99" cy="90" r="10" fill={INK} />
        <circle cx="141" cy="90" r="10" fill={INK} />
        <ellipse cx="120" cy="111" rx="7" ry="9" fill="none" stroke={INK} strokeWidth="4.5" />
      </>
    );
  }
  if (face === "sad") {
    return (
      <>
        <circle cx="100" cy="95" r="6.5" fill={INK} />
        <circle cx="140" cy="95" r="6.5" fill={INK} />
        <path d="M105 79 L92 85" fill="none" stroke={INK} strokeWidth="4.5" strokeLinecap="round" />
        <path d="M135 79 L148 85" fill="none" stroke={INK} strokeWidth="4.5" strokeLinecap="round" />
        <path d="M110 113 A13 13 0 0 1 130 113" fill="none" stroke={INK} strokeWidth="4.5" strokeLinecap="round" />
      </>
    );
  }
  return (
    <>
      <circle cx="100" cy="92" r="7" fill={INK} />
      <circle cx="140" cy="92" r="7" fill={INK} />
      <path d="M108 106 A6 6 0 0 0 120 106 A6 6 0 0 0 132 106" fill="none" stroke={INK} strokeWidth="4.5" strokeLinecap="round" />
    </>
  );
}

export function Cat({
  face = "normal",
  width = 200,
  mandu = "#f7dcb2",
}: {
  face?: CatFace;
  width?: number;
  mandu?: string;
}) {
  return (
    <svg viewBox="0 0 240 256" width={width} height={Math.round((width * 256) / 240)} aria-hidden="true">
      <g stroke={INK} strokeWidth="5" strokeLinejoin="round" strokeLinecap="round">
        <path d="M176 208 C222 212 232 166 208 148" fill="none" stroke={INK} strokeWidth="21" />
        <path d="M176 208 C222 212 232 166 208 148" fill="none" stroke="#fff6e8" strokeWidth="12" />
        <ellipse cx="120" cy="188" rx="72" ry="58" fill="#fff6e8" />
        <path d={HEAD} fill="#fff6e8" />
        <path d="M50 92 L78 92" strokeWidth="4" />
        <path d="M52 104 L79 101" strokeWidth="4" />
        <path d="M190 92 L162 92" strokeWidth="4" />
        <path d="M188 104 L161 101" strokeWidth="4" />
        <path d={MANDU} fill={mandu} />
        <ellipse cx="66" cy="204" rx="21" ry="17" fill="#fff6e8" />
        <path d="M60 190 L60 196" strokeWidth="4" />
        <path d="M72 190 L72 196" strokeWidth="4" />
        <ellipse cx="174" cy="204" rx="21" ry="17" fill="#fff6e8" />
        <path d="M168 190 L168 196" strokeWidth="4" />
        <path d="M180 190 L180 196" strokeWidth="4" />
      </g>
      <ellipse cx="84" cy="110" rx="12" ry="8.5" fill="#f6a88c" opacity="0.85" />
      <ellipse cx="156" cy="110" rx="12" ry="8.5" fill="#f6a88c" opacity="0.85" />
      <Face face={face} />
    </svg>
  );
}

/** 반죽 단계에서 반죽을 미는 앞발이에요. */
export function Paw({ width = 72, flip = false }: { width?: number; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={width}
      height={width}
      aria-hidden="true"
      style={{ transform: flip ? "rotate(16deg) scaleX(-1)" : "rotate(-16deg)" }}
    >
      <ellipse cx="51" cy="63" rx="27" ry="23" fill="#fff6e8" stroke={INK} strokeWidth="4" />
      <circle cx="24" cy="38" r="10" fill="#fff6e8" stroke={INK} strokeWidth="4" />
      <circle cx="42" cy="26" r="10" fill="#fff6e8" stroke={INK} strokeWidth="4" />
      <circle cx="61" cy="26" r="10" fill="#fff6e8" stroke={INK} strokeWidth="4" />
      <circle cx="79" cy="38" r="10" fill="#fff6e8" stroke={INK} strokeWidth="4" />
      <ellipse cx="51" cy="63" rx="13" ry="11" fill="#f6a88c" opacity="0.55" />
    </svg>
  );
}
