import { useState } from "react";
import { INGREDIENTS } from "../game/ingredients";
import { Bowl } from "../components/Bowl";
import type { Filling } from "../game/recipe";
import { triggerHaptic } from "../game/haptics";
import { playSound, unlockAudio } from "../game/sounds";

/**
 * 1단계 — 만두속 만들기.
 * 같은 재료를 여러 번 넣을 수 있어요. 종류뿐 아니라 개수까지 맞아야 정통 만두가 나와요.
 * 정답 여부는 여기서 알려주지 않아요 (힌트는 만두가 완성된 뒤에만 제안해요).
 */
export function FillingStage({ onDone }: { onDone: (filling: Filling) => void }) {
  const [filling, setFilling] = useState<Filling>({});

  const total = Object.values(filling).reduce((a, b) => a + b, 0);

  function add(id: string) {
    unlockAudio();
    triggerHaptic("tap");
    playSound("tick");
    setFilling((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  }

  /** 그릇을 통째로 비워요. 수량까지 맞춰야 해서 처음부터 다시 담는 일이 잦아요. */
  function reset() {
    triggerHaptic("error");
    setFilling({});
  }

  return (
    <div className="stage">
      <div className="stage__titlerow">
        <p className="stage__title">만두속 만들기</p>
        {total > 0 && (
          <button type="button" className="picked__reset" onClick={reset}>
            비우기
          </button>
        )}
      </div>
      <p className="stage__hint">같은 재료를 여러 번 넣어도 돼요. 양까지 맞아야 해요.</p>

      <Bowl filling={filling} />

      <div className="shelf">
        {INGREDIENTS.map((item) => {
          const count = filling[item.id] ?? 0;
          return (
            <button
              key={item.id}
              type="button"
              className={`chip ${count > 0 ? "chip--on" : ""}`}
              onClick={() => add(item.id)}
            >
              <span className="chip__emoji">{item.emoji}</span>
              <span className="chip__name">{item.name}</span>
              {count > 0 && <span className="chip__count">{count}</span>}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="primary-button"
        disabled={total === 0}
        onClick={() => total > 0 && onDone(filling)}
      >
        {total > 0 ? "이 재료로 만두속 만들기" : "재료를 넣어주세요"}
      </button>
    </div>
  );
}
