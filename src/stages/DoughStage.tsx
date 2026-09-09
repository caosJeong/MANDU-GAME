import { useState } from "react";
import { Paw } from "../components/Cat";
import { triggerHaptic } from "../game/haptics";
import { playSound } from "../game/sounds";

export type DoughKind = "thick" | "normal" | "thin";

const OPTIONS: { id: DoughKind; title: string; desc: string; label: string }[] = [
  { id: "thick", title: "밀가루 많이", desc: "두툼한 만두피", label: "두툼한 만두피" },
  { id: "normal", title: "알맞게", desc: "보통 만두피", label: "보통 만두피" },
  { id: "thin", title: "물 많이", desc: "얇은 만두피", label: "얇은 만두피" },
];

export function doughLabel(kind: DoughKind): string {
  return OPTIONS.find((o) => o.id === kind)?.label ?? "";
}

/**
 * 2단계 — 만두피 반죽하기.
 * 맛(등급)에는 영향이 없고 완성된 만두의 생김새만 정해요.
 */
export function DoughStage({ onDone }: { onDone: (kind: DoughKind) => void }) {
  const [picked, setPicked] = useState<DoughKind>("normal");

  return (
    <div className="stage">
      <p className="stage__title">만두피 반죽하기</p>
      <p className="stage__hint">반죽에 따라 만두피 두께가 달라져요. 맛에는 영향이 없어요.</p>

      <div className="dough">
        <div className="dough__stack">
          <div className="dough__disc" />
          <span className="dough__paw dough__paw--left">
            <Paw />
          </span>
          <span className="dough__paw dough__paw--right">
            <Paw flip />
          </span>
        </div>
      </div>

      <div className="option-list">
        {OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`option ${picked === option.id ? "option--on" : ""}`}
            onClick={() => {
              triggerHaptic("tap");
              playSound("pick");
              setPicked(option.id);
            }}
          >
            <span className="option__title">{option.title}</span>
            <span className="option__desc">{option.desc}</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        className="primary-button"
        onClick={() => {
          playSound("roll");
          onDone(picked);
        }}
      >
        반죽 끝내기
      </button>
    </div>
  );
}
