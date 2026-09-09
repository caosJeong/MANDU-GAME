import { useState } from "react";
import { FillingStage } from "../stages/FillingStage";
import { DoughStage, type DoughKind } from "../stages/DoughStage";
import { ShapeStage, type CookKind, type ShapeKind } from "../stages/ShapeStage";
import type { Filling } from "../game/recipe";

export type RoundInput = {
  filling: Filling;
  dough: DoughKind;
  shape: ShapeKind;
  cook: CookKind;
};

const STEPS = ["만두속", "반죽", "모양"];

/**
 * 메인 플레이 화면이에요.
 * 원작처럼 만두속 → 반죽 → 모양+조리법 세 단계를 고르면 한 판이 끝나요.
 */
export function PlayScreen({ onFinish }: { onFinish: (input: RoundInput) => void }) {
  const [step, setStep] = useState(0);
  const [filling, setFilling] = useState<Filling>({});
  const [dough, setDough] = useState<DoughKind>("normal");

  return (
    <div className="screen screen--play">
      <div className="steps">
        {STEPS.map((name, i) => (
          <span key={name} className="steps__item">
            {i > 0 && <span className="steps__sep">›</span>}
            <span className={`steps__label ${i === step ? "is-on" : ""}`}>
              {i + 1}. {name}
            </span>
          </span>
        ))}
      </div>

      {step === 0 && (
        <FillingStage
          onDone={(next) => {
            setFilling(next);
            setStep(1);
          }}
        />
      )}
      {step === 1 && (
        <DoughStage
          onDone={(kind) => {
            setDough(kind);
            setStep(2);
          }}
        />
      )}
      {step === 2 && (
        <ShapeStage onDone={(shape, cook) => onFinish({ filling, dough, shape, cook })} />
      )}
    </div>
  );
}
