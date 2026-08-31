import { useRef, useState } from "react";
import { triggerHaptic } from "../game/haptics";
import { playSound, unlockAudio } from "../game/sounds";

const KNEAD_TAPS = 3;
const IDEAL_THICKNESS = 50; // 0(가장 얇음) ~ 100(가장 두꺼움)
const TEAR_THRESHOLD = 18; // 이보다 얇아지면 찢어져요
const TEAR_PENALTY = 20;
const PX_PER_THICKNESS = 2.4; // 드래그 픽셀당 얇아지는 정도

/**
 * 1단계 — 만두피 만들기.
 * 반죽을 몇 번 눌러 푼 뒤, 밀대를 좌우로 드래그해 두께를 맞춰요.
 * 너무 얇으면 찢어지고(재시도 + 감점), 너무 두꺼우면 점수가 깎여요.
 */
export function DoughStage({ onDone }: { onDone: (score: number) => void }) {
  const [taps, setTaps] = useState(0);
  const [thickness, setThickness] = useState(100);
  const [torn, setTorn] = useState(0);
  const [rolling, setRolling] = useState(false);
  const lastXRef = useRef(0);

  const kneaded = taps >= KNEAD_TAPS;
  const inGoodBand = thickness >= 38 && thickness <= 62;

  function knead() {
    unlockAudio();
    triggerHaptic("tickMedium");
    playSound("tick");
    setTaps((prev) => prev + 1);
  }

  function startRoll(event: React.PointerEvent<HTMLDivElement>) {
    if (!kneaded) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    lastXRef.current = event.clientX;
    setRolling(true);
  }

  function moveRoll(event: React.PointerEvent<HTMLDivElement>) {
    if (!rolling) return;
    const dx = Math.abs(event.clientX - lastXRef.current);
    lastXRef.current = event.clientX;
    if (dx < 1) return;

    setThickness((prev) => {
      const next = Math.max(0, prev - dx / PX_PER_THICKNESS);
      if (next <= TEAR_THRESHOLD) {
        // 찢어졌어요 — 반죽을 다시 뭉쳐서 재시도해요.
        triggerHaptic("error");
        playSound("burn");
        setTorn((count) => count + 1);
        setRolling(false);
        return 100;
      }
      if (Math.floor(prev / 10) !== Math.floor(next / 10)) triggerHaptic("tickWeak");
      return next;
    });
  }

  function endRoll() {
    if (!rolling) return;
    setRolling(false);
    const accuracy = Math.max(0, 100 - Math.abs(thickness - IDEAL_THICKNESS) * 3.2);
    const score = Math.max(0, Math.round(accuracy - torn * TEAR_PENALTY));
    triggerHaptic(score >= 60 ? "success" : "basicWeak");
    playSound("fold");
    onDone(score);
  }

  return (
    <div className="stage">
      <p className="stage__title">1. 만두피 만들기</p>
      <p className="stage__hint">
        {kneaded
          ? "밀대를 좌우로 문질러 반죽을 미세요. 초록 구간에서 손을 떼면 성공!"
          : `반죽을 ${KNEAD_TAPS - taps}번 더 눌러 풀어주세요`}
      </p>

      <div
        className={`dough ${kneaded ? "dough--rolling" : ""}`}
        onPointerDown={kneaded ? startRoll : knead}
        onPointerMove={moveRoll}
        onPointerUp={endRoll}
        onPointerCancel={endRoll}
      >
        <div
          className="dough__disc"
          style={{
            width: `${120 + (100 - thickness) * 1.4}px`,
            height: `${120 + (100 - thickness) * 1.4}px`,
            opacity: 0.55 + (100 - thickness) / 240,
          }}
        />
        {kneaded && <span className="dough__roller">🥢</span>}
      </div>

      <div className="gauge">
        <div className="gauge__band gauge__band--dough" />
        <div className="gauge__marker" style={{ left: `${100 - thickness}%` }} />
      </div>
      <p className={`stage__status ${inGoodBand ? "stage__status--good" : ""}`}>
        두께 {Math.round(thickness)} {inGoodBand ? "— 지금 떼세요!" : ""}
        {torn > 0 && ` · 찢어짐 ${torn}회`}
      </p>
    </div>
  );
}
