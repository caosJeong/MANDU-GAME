import { ingredientEmoji } from "../game/ingredients";
import type { Filling } from "../game/recipe";

/**
 * 만두속 그릇이에요. 고른 재료가 하나씩 그릇에 쌓여요 (원작의 재료 그릇 화면).
 *
 * 넣은 횟수만큼 재료가 놓이고, 자리는 아래 SLOTS 순서대로 채워요.
 * 위치를 %로 잡아서 그릇 SVG가 늘어나도 재료가 같이 따라가요.
 */

/** 그릇 안쪽에 재료를 놓을 자리예요 (그릇 박스 기준 %). 안쪽부터 바깥으로 채워요. */
const SLOTS: [number, number][] = [
  [50, 44], [37, 36], [63, 36], [43, 55], [57, 55],
  [28, 45], [72, 45], [50, 29], [35, 64], [65, 64],
  [23, 33], [77, 33], [50, 68], [30, 55], [70, 55],
  [42, 26], [58, 26], [20, 55],
];

const MAX_SHOWN = SLOTS.length;

export function Bowl({ filling }: { filling: Filling }) {
  // 넣은 순서대로 재료 하나당 칸 하나씩 펼쳐요 (돼지고기 ×3 이면 세 개).
  const units: string[] = [];
  for (const [id, count] of Object.entries(filling)) {
    for (let i = 0; i < count; i++) units.push(id);
  }
  const shown = units.slice(0, MAX_SHOWN);
  const overflow = units.length - shown.length;

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

      {shown.map((id, i) => (
        <span
          key={`${id}-${i}`}
          className="bowl__item"
          style={{ left: `${SLOTS[i][0]}%`, top: `${SLOTS[i][1]}%` }}
        >
          {ingredientEmoji(id)}
        </span>
      ))}

      {overflow > 0 && <span className="bowl__more">+{overflow}</span>}
      {units.length === 0 && <span className="bowl__empty">재료를 골라 담아요</span>}
    </div>
  );
}
