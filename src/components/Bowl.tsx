import { INGREDIENT_BY_ID } from "../game/ingredients";
import type { Filling } from "../game/recipe";

/**
 * 만두속 그릇이에요. 고른 재료가 **다져져서** 그릇을 채워요 (원작의 재료 그릇 화면).
 *
 * 재료를 담을수록 조각이 늘고 무더기가 넓게 퍼져서, 정답 수량(12번)을 채우면
 * 그릇이 가득 찹니다. 조각 자리는 순번으로 정해서 리렌더에도 튀지 않아요.
 */

/** 재료 하나당 조각 몇 개로 보일지. 그릇이 차 보이게 넉넉히 잡아요. */
const BITS_PER_UNIT = 7;
const MAX_BITS = 110;
/** 이 수량을 채우면 무더기가 최대 크기가 돼요 (정통 레시피 총량). */
const FULL_AT = 12;

/** 무더기가 퍼질 최대 범위 (그릇 박스 기준 %). */
const CENTER_X = 50;
const CENTER_Y = 47;
const SPREAD_X = 34;
const SPREAD_Y = 21;

/** 황금각 나선 — 원 안에 점을 고르게 흩어 놓아요. 뭉치거나 줄이 지지 않아요. */
const GOLDEN_ANGLE = 2.399963;

function wobble(seed: number, range: number): number {
  const n = Math.sin(seed * 12.9898) * 43758.5453;
  return (n - Math.floor(n) - 0.5) * range;
}

export function Bowl({ filling }: { filling: Filling }) {
  // 넣은 횟수만큼 재료를 펼쳐요 (돼지고기 ×3 이면 세 번).
  const units: string[] = [];
  for (const [id, count] of Object.entries(filling)) {
    for (let i = 0; i < count; i++) units.push(id);
  }

  const bitCount = Math.min(units.length * BITS_PER_UNIT, MAX_BITS);
  // 조금 담았을 땐 가운데 작게, 많이 담을수록 그릇 전체로 퍼져요.
  const fullness = Math.min(1, units.length / FULL_AT);
  const spreadX = SPREAD_X * (0.45 + 0.55 * fullness);
  const spreadY = SPREAD_Y * (0.45 + 0.55 * fullness);

  const bits = [];
  for (let i = 0; i < bitCount; i++) {
    // 서로 다른 재료가 섞여 보이도록 순번을 건너뛰며 고릅니다.
    const id = units[(i * 5 + 2) % units.length];
    const item = INGREDIENT_BY_ID[id];
    if (!item) continue;

    const r = Math.sqrt((i + 0.5) / bitCount);
    const theta = i * GOLDEN_ANGLE;
    bits.push({
      key: `${i}-${id}`,
      id,
      cut: item.cut,
      color: item.color,
      x: CENTER_X + spreadX * r * Math.cos(theta) + wobble(i, 2.5),
      y: CENTER_Y + spreadY * r * Math.sin(theta) + wobble(i + 99, 2.5),
      rot: wobble(i + 7, 160),
    });
  }
  // 위에 있는 조각을 먼저 그려야 아래 조각이 겹쳐 올라와 쌓인 느낌이 나요.
  bits.sort((a, b) => a.y - b.y);

  return (
    <div className="bowl">
      <svg className="bowl__art" viewBox="0 0 260 160" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <path
          d="M14 56 C20 126 62 150 130 150 C198 150 240 126 246 56 Z"
          fill="#e4edee"
          stroke="#522030"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <ellipse cx="130" cy="56" rx="116" ry="32" fill="#f2f8f8" stroke="#522030" strokeWidth="3.5" />
        <ellipse cx="130" cy="58" rx="100" ry="24" fill="#cfe0e2" />
      </svg>

      {bits.map((bit) => (
        <span
          key={bit.key}
          className={`bit bit--${bit.cut}`}
          style={{
            left: `${bit.x}%`,
            top: `${bit.y}%`,
            background: bit.color,
            transform: `translate(-50%, -50%) rotate(${bit.rot}deg)`,
          }}
        />
      ))}

      {units.length === 0 && <span className="bowl__empty">재료를 골라 담아요</span>}
    </div>
  );
}
