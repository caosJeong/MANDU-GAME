import { useEffect, useRef, useState } from "react";
import { triggerHaptic } from "../game/haptics";
import { playSound } from "../game/sounds";

const FOLDS = 3;
const SWEEP_MS = 1400; // 마커가 왕복하는 주기

/**
 * 3단계 — 빚기.
 * 좌우로 움직이는 마커가 가운데 초록 구간에 있을 때 눌러 주름을 잡아요. 3번 반복해요.
 */
export function FoldStage({ onDone }: { onDone: (score: number) => void }) {
  const [position, setPosition] = useState(0); // 0~1
  const [results, setResults] = useState<number[]>([]);
  const rafRef = useRef(0);
  const startedAtRef = useRef(performance.now());
  const doneRef = useRef(false);

  useEffect(() => {
    function tick() {
      const elapsed = performance.now() - startedAtRef.current;
      // 삼각파: 0 -> 1 -> 0 왕복
      const phase = (elapsed % SWEEP_MS) / SWEEP_MS;
      setPosition(phase < 0.5 ? phase * 2 : 2 - phase * 2);
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  function fold() {
    if (doneRef.current) return;
    // 가운데(0.5)에 가까울수록 높은 점수예요.
    const accuracy = Math.max(0, 100 - Math.abs(position - 0.5) * 260);
    triggerHaptic(accuracy >= 70 ? "success" : "basicWeak");
    playSound("fold");

    setResults((prev) => {
      const next = [...prev, accuracy];
      if (next.length >= FOLDS) {
        doneRef.current = true;
        const average = next.reduce((a, b) => a + b, 0) / next.length;
        onDone(Math.round(average));
      }
      return next;
    });
  }

  return (
    <div className="stage">
      <p className="stage__title">3. 빚기</p>
      <p className="stage__hint">마커가 가운데에 올 때 눌러 주름을 잡아요 ({results.length}/{FOLDS})</p>

      <div className="gauge gauge--tall">
        <div className="gauge__band gauge__band--fold" />
        <div className="gauge__marker" style={{ left: `${position * 100}%` }} />
      </div>

      <div className="fold-dots">
        {Array.from({ length: FOLDS }, (_, i) => (
          <span key={i} className={`fold-dots__dot ${results[i] != null ? "fold-dots__dot--on" : ""}`} />
        ))}
      </div>

      <button type="button" className="primary-button primary-button--tap" onClick={fold}>
        주름 잡기
      </button>
    </div>
  );
}
