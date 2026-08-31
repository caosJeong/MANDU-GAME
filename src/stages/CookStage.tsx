import { useEffect, useRef, useState } from "react";
import { triggerHaptic } from "../game/haptics";
import { playSound } from "../game/sounds";

const HEAT_UP_PER_SEC = 58;
const HEAT_DOWN_PER_SEC = 40;
const BAND_MIN = 45;
const BAND_MAX = 78;
const BURN_AT = 94;
const COOK_PER_SEC = 30; // 적정 화력에서 익는 속도 (약 3.3초면 완성)
const TIME_LIMIT_MS = 22000;

/**
 * 4단계 — 조리(찜).
 * 버튼을 누르면 화력이 오르고 떼면 내려가요. 초록 구간을 유지해야 익고,
 * 빨간 구간까지 올리면 타 버려요 (슈게임 특유의 긴장감).
 */
export function CookStage({ onDone }: { onDone: (score: number) => void }) {
  const [heat, setHeat] = useState(0);
  const [progress, setProgress] = useState(0);
  const [burned, setBurned] = useState(false);

  const holdingRef = useRef(false);
  const heatRef = useRef(0);
  const progressRef = useRef(0);
  const inBandMsRef = useRef(0);
  const totalMsRef = useRef(0);
  const wasInBandRef = useRef(false);
  const finishedRef = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    let raf = 0;
    let last = performance.now();

    function finish(score: number, didBurn: boolean) {
      if (finishedRef.current) return;
      finishedRef.current = true;
      if (didBurn) {
        setBurned(true);
        triggerHaptic("error");
        playSound("burn");
      } else {
        triggerHaptic("success");
        playSound("done");
      }
      // 탄 경우엔 잠깐 결과를 보여준 뒤 넘어가요.
      window.setTimeout(() => onDoneRef.current(score), didBurn ? 700 : 300);
    }

    function tick(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      totalMsRef.current += dt * 1000;

      heatRef.current = Math.max(
        0,
        Math.min(100, heatRef.current + (holdingRef.current ? HEAT_UP_PER_SEC : -HEAT_DOWN_PER_SEC) * dt),
      );

      const inBand = heatRef.current >= BAND_MIN && heatRef.current <= BAND_MAX;
      if (inBand) {
        inBandMsRef.current += dt * 1000;
        progressRef.current = Math.min(100, progressRef.current + COOK_PER_SEC * dt);
        if (!wasInBandRef.current) playSound("sizzle");
      }
      wasInBandRef.current = inBand;

      setHeat(heatRef.current);
      setProgress(progressRef.current);

      if (heatRef.current >= BURN_AT) {
        const ratio = inBandMsRef.current / Math.max(1, totalMsRef.current);
        finish(Math.max(5, Math.round(ratio * 40)), true);
        return;
      }
      if (progressRef.current >= 100) {
        const ratio = inBandMsRef.current / Math.max(1, totalMsRef.current);
        finish(Math.max(30, Math.min(100, Math.round(ratio * 115))), false);
        return;
      }
      if (totalMsRef.current >= TIME_LIMIT_MS) {
        finish(Math.round(progressRef.current * 0.5), false);
        return;
      }
      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const heatState = burned ? "burn" : heat >= BURN_AT - 12 ? "danger" : heat >= BAND_MIN && heat <= BAND_MAX ? "good" : "low";

  return (
    <div className="stage">
      <p className="stage__title">4. 찜통에 올리기</p>
      <p className="stage__hint">
        {burned ? "앗, 타버렸어요!" : "버튼을 눌러 화력을 올리고, 초록 구간을 유지하세요"}
      </p>

      <div className="steamer">
        <span className={`steamer__mandu steamer__mandu--${heatState}`}>
          {burned ? "🥟💨" : "🥟"}
        </span>
      </div>

      <div className="gauge gauge--vertical">
        <div className="gauge__band gauge__band--cook" />
        <div className="gauge__band gauge__band--burn" />
        <div className="gauge__marker gauge__marker--h" style={{ bottom: `${heat}%` }} />
      </div>

      <div className="progress">
        <div className="progress__fill" style={{ width: `${progress}%` }} />
      </div>
      <p className="stage__status">익은 정도 {Math.round(progress)}%</p>

      <button
        type="button"
        className="primary-button primary-button--hold"
        onPointerDown={() => {
          holdingRef.current = true;
          triggerHaptic("tickWeak");
        }}
        onPointerUp={() => (holdingRef.current = false)}
        onPointerCancel={() => (holdingRef.current = false)}
        onPointerLeave={() => (holdingRef.current = false)}
      >
        🔥 누르는 동안 화력 UP
      </button>
    </div>
  );
}
