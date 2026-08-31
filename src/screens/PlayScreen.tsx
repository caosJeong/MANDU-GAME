import { useState } from "react";
import { DoughStage } from "../stages/DoughStage";
import { FillingStage } from "../stages/FillingStage";
import { FoldStage } from "../stages/FoldStage";
import { CookStage } from "../stages/CookStage";
import { judge, type MandiResult, type StageScores } from "../game/scoring";
import type { Order } from "../game/orders";

type Step = "dough" | "filling" | "fold" | "cook";

const EMPTY_STAGES: StageScores = { dough: 0, fold: 0, cook: 0 };

/**
 * 메인 플레이 화면이에요.
 * 주문 하나당 만두피 → 재료 → 빚기 → 조리 4단계를 돌고, 주문을 모두 처리하면 한 판이 끝나요.
 */
export function PlayScreen({
  orders,
  extraSlot,
  onFinish,
}: {
  orders: Order[];
  extraSlot: boolean;
  onFinish: (results: MandiResult[]) => void;
}) {
  const [orderIndex, setOrderIndex] = useState(0);
  const [step, setStep] = useState<Step>("dough");
  const [stages, setStages] = useState<StageScores>(EMPTY_STAGES);
  const [filling, setFilling] = useState<string[]>([]);
  const [results, setResults] = useState<MandiResult[]>([]);

  const order = orders[orderIndex];

  function finishMandu(cookScore: number) {
    const finalStages = { ...stages, cook: cookScore };
    const result = judge(filling, finalStages, order);
    const nextResults = [...results, result];

    if (orderIndex + 1 >= orders.length) {
      onFinish(nextResults);
      return;
    }
    setResults(nextResults);
    setOrderIndex(orderIndex + 1);
    setStages(EMPTY_STAGES);
    setFilling([]);
    setStep("dough");
  }

  return (
    <div className="screen screen--play">
      <div className="play-progress">
        <span>
          주문 {orderIndex + 1} / {orders.length}
        </span>
        <div className="play-progress__dots">
          {orders.map((_, i) => (
            <span key={i} className={`play-progress__dot ${i <= orderIndex ? "is-on" : ""}`} />
          ))}
        </div>
      </div>

      {step === "dough" && (
        <DoughStage
          onDone={(score) => {
            setStages((prev) => ({ ...prev, dough: score }));
            setStep("filling");
          }}
        />
      )}
      {step === "filling" && (
        <FillingStage
          order={order}
          extraSlot={extraSlot}
          onDone={(ids) => {
            setFilling(ids);
            setStep("fold");
          }}
        />
      )}
      {step === "fold" && (
        <FoldStage
          onDone={(score) => {
            setStages((prev) => ({ ...prev, fold: score }));
            setStep("cook");
          }}
        />
      )}
      {step === "cook" && <CookStage onDone={finishMandu} />}
    </div>
  );
}
