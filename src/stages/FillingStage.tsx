import { useState } from "react";
import { INGREDIENTS } from "../game/ingredients";
import { intentLabel, type Order } from "../game/orders";
import { triggerHaptic } from "../game/haptics";
import { playSound } from "../game/sounds";

const MIN_PICK = 2; // 히든 레시피에 2개짜리 조합(초코+딸기 등)이 있어서 2개부터 허용해요
const BASE_MAX_PICK = 4;

/**
 * 2단계 — 재료 조합으로 소 만들기.
 * 보상형 광고로 "재료 추가"를 받은 판에서는 최대 선택 개수가 1개 늘어나요.
 */
export function FillingStage({
  order,
  extraSlot,
  onDone,
}: {
  order: Order;
  extraSlot: boolean;
  onDone: (ids: string[]) => void;
}) {
  const [picked, setPicked] = useState<string[]>([]);
  const maxPick = BASE_MAX_PICK + (extraSlot ? 1 : 0);

  function toggle(id: string) {
    setPicked((prev) => {
      if (prev.includes(id)) {
        triggerHaptic("tickWeak");
        return prev.filter((it) => it !== id);
      }
      if (prev.length >= maxPick) {
        triggerHaptic("error");
        return prev;
      }
      triggerHaptic("tap");
      playSound("tick");
      return [...prev, id];
    });
  }

  const canConfirm = picked.length >= MIN_PICK;

  return (
    <div className="stage">
      <p className="stage__title">2. 재료 넣기</p>
      <div className="order-card">
        <span className="order-card__face">{order.customer}</span>
        <span className="order-card__hint">
          “{order.hint}”
          <em>{intentLabel(order.intent)} 계열</em>
        </span>
      </div>
      <p className="stage__hint">
        {MIN_PICK}~{maxPick}개를 골라요{extraSlot ? " (광고 보상: 슬롯 +1)" : ""} · {picked.length}/{maxPick}
      </p>

      <div className="shelf">
        {INGREDIENTS.map((item) => {
          const index = picked.indexOf(item.id);
          return (
            <button
              key={item.id}
              type="button"
              className={`chip ${index >= 0 ? "chip--on" : ""}`}
              onClick={() => toggle(item.id)}
            >
              <span className="chip__emoji">{item.emoji}</span>
              <span className="chip__name">{item.name}</span>
              {index >= 0 && <span className="chip__order">{index + 1}</span>}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="primary-button"
        disabled={!canConfirm}
        onClick={() => canConfirm && onDone(picked)}
      >
        {canConfirm ? "이 재료로 만들기" : `재료를 ${MIN_PICK - picked.length}개 더 골라주세요`}
      </button>
    </div>
  );
}
