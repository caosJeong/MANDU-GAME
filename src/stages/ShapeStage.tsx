import { useState } from "react";
import { Cat } from "../components/Cat";
import { triggerHaptic } from "../game/haptics";
import { playSound } from "../game/sounds";

export type ShapeKind = "halfmoon" | "ring" | "crumple";
export type CookKind = "fry" | "steam" | "boil";

const COOK_NAMES: Record<CookKind, string> = { fry: "굽기", steam: "찌기", boil: "삶기" };

/** 원작처럼 모양마다 가능한 조리법이 달라요. */
const SHAPES: { id: ShapeKind; name: string; cooks: CookKind[] }[] = [
  { id: "halfmoon", name: "긴반달", cooks: ["fry"] },
  { id: "ring", name: "또아리", cooks: ["steam", "boil"] },
  { id: "crumple", name: "쭈그리", cooks: ["boil"] },
];

const ALL_COOKS: CookKind[] = ["fry", "steam", "boil"];

export function shapeLabel(shape: ShapeKind, cook: CookKind): string {
  const name = SHAPES.find((s) => s.id === shape)?.name ?? "";
  return `${name} · ${COOK_NAMES[cook]}`;
}

function ShapeArt({ id }: { id: ShapeKind }) {
  if (id === "halfmoon") {
    return (
      <svg viewBox="0 0 120 66" width="86" height="47" aria-hidden="true">
        <path d="M14 52 A46 30 0 0 1 106 52 Z" fill="#fff6e8" stroke="#522030" strokeWidth="4" strokeLinejoin="round" />
      </svg>
    );
  }
  if (id === "ring") {
    return (
      <svg viewBox="0 0 120 66" width="86" height="47" aria-hidden="true">
        <circle cx="60" cy="34" r="26" fill="#fff6e8" stroke="#522030" strokeWidth="4" />
        <circle cx="60" cy="34" r="9" fill="none" stroke="#522030" strokeWidth="4" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 66" width="86" height="47" aria-hidden="true">
      <path
        d="M18 46 A11 11 0 0 1 40 46 A11 11 0 0 1 62 46 A11 11 0 0 1 84 46 A11 11 0 0 1 106 46 A44 30 0 0 1 18 46 Z"
        fill="#fff6e8"
        stroke="#522030"
        strokeWidth="4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** 3단계 — 모양 고르고 익히기. 맛에는 영향이 없고 완성된 만두의 생김새만 정해요. */
export function ShapeStage({ onDone }: { onDone: (shape: ShapeKind, cook: CookKind) => void }) {
  const [shape, setShape] = useState<ShapeKind>("ring");
  const [cook, setCook] = useState<CookKind>("steam");

  const current = SHAPES.find((s) => s.id === shape)!;

  function pickShape(next: ShapeKind) {
    triggerHaptic("tap");
    setShape(next);
    // 모양을 바꾸면 그 모양으로 못 하는 조리법은 첫 번째 것으로 되돌려요.
    const cooks = SHAPES.find((s) => s.id === next)!.cooks;
    if (!cooks.includes(cook)) setCook(cooks[0]);
  }

  return (
    <div className="stage">
      <p className="stage__title">모양 고르고 익히기</p>
      <p className="stage__hint">모양마다 익히는 방법이 달라요.</p>

      <div className="shape-row">
        {SHAPES.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`shape ${shape === option.id ? "shape--on" : ""}`}
            onClick={() => pickShape(option.id)}
          >
            <ShapeArt id={option.id} />
            <span className="shape__name">{option.name}</span>
          </button>
        ))}
      </div>

      <p className="stage__caption">{current.name}는 이렇게 익혀요</p>
      <div className="cook-row">
        {ALL_COOKS.map((id) => {
          const enabled = current.cooks.includes(id);
          return (
            <button
              key={id}
              type="button"
              className={`cook ${cook === id && enabled ? "cook--on" : ""}`}
              disabled={!enabled}
              onClick={() => {
                triggerHaptic("tap");
                setCook(id);
              }}
            >
              {COOK_NAMES[id]}
            </button>
          );
        })}
      </div>

      <div className="workbench">
        <Cat face="happy" width={186} />
      </div>

      <button
        type="button"
        className="primary-button"
        onClick={() => {
          playSound("done");
          onDone(shape, cook);
        }}
      >
        만두 완성하기
      </button>
    </div>
  );
}
