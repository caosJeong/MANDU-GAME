/**
 * Web Audio 기반 합성 효과음이에요. 오디오 파일 없이 코드만으로 소리를 만들어요.
 * 나중에 실제 음원으로 바꾸려면 playSound 내부만 AudioBuffer 재생으로 교체하면 돼요.
 */
export type SoundType =
  /** 일반 버튼 누름 */
  | "tap"
  /** 재료를 그릇에 담을 때 */
  | "toss"
  /** 재료를 하나 뺄 때 */
  | "undo"
  /** 반죽·모양·조리법 같은 보기를 고를 때 */
  | "pick"
  /** 반죽을 미는 소리 */
  | "roll"
  /** 정통 만두 완성 */
  | "success"
  /** 신메뉴 등재 */
  | "newmenu"
  /** 실패 */
  | "fail";

let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  // iOS 웹뷰에서는 사용자 제스처 안에서 resume해야 소리가 나요.
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

/** pointerdown 같은 사용자 제스처 시점에 호출해서 오디오를 미리 활성화해요. */
export function unlockAudio() {
  getContext();
}

function beep(
  ac: AudioContext,
  opts: { type: OscillatorType; from: number; to: number; dur: number; gain: number; delay?: number },
) {
  const t = ac.currentTime + (opts.delay ?? 0);
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = opts.type;
  osc.frequency.setValueAtTime(opts.from, t);
  osc.frequency.exponentialRampToValueAtTime(Math.max(1, opts.to), t + opts.dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(opts.gain, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + opts.dur);
  osc.connect(g).connect(ac.destination);
  osc.start(t);
  osc.stop(t + opts.dur + 0.02);
}

/** 필터를 훑는 화이트 노이즈로 "슝" 하는 바람 소리를 만들어요. */
function swoosh(
  ac: AudioContext,
  opts: { dur: number; from: number; to: number; gain: number; q?: number },
) {
  const t = ac.currentTime;
  const frames = Math.floor(ac.sampleRate * opts.dur);
  const buffer = ac.createBuffer(1, frames, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i += 1) data[i] = Math.random() * 2 - 1;

  const src = ac.createBufferSource();
  const filter = ac.createBiquadFilter();
  const g = ac.createGain();

  src.buffer = buffer;
  filter.type = "bandpass";
  filter.Q.value = opts.q ?? 1.6;
  filter.frequency.setValueAtTime(opts.from, t);
  filter.frequency.exponentialRampToValueAtTime(Math.max(1, opts.to), t + opts.dur);

  // 앞은 빠르게 열고 뒤는 부드럽게 닫아야 "슝"으로 들려요.
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(opts.gain, t + opts.dur * 0.18);
  g.gain.exponentialRampToValueAtTime(0.0001, t + opts.dur);

  src.connect(filter).connect(g).connect(ac.destination);
  src.start(t);
  src.stop(t + opts.dur + 0.02);
}

export function playSound(type: SoundType) {
  const ac = getContext();
  if (!ac) return;

  switch (type) {
    case "tap":
      beep(ac, { type: "sine", from: 660, to: 520, dur: 0.05, gain: 0.07 });
      break;

    case "toss": {
      // 재료를 그릇에 던져 넣는 "슝". 연타해도 기계처럼 들리지 않게 음높이를 조금씩 흔들어요.
      const shift = 0.85 + Math.random() * 0.3;
      swoosh(ac, { dur: 0.17, from: 2600 * shift, to: 700 * shift, gain: 0.1 });
      beep(ac, { type: "sine", from: 420 * shift, to: 240 * shift, dur: 0.09, gain: 0.05 });
      break;
    }

    case "undo":
      // 담을 때와 반대로 올라가는 소리라 "빼는" 느낌이 나요.
      beep(ac, { type: "sine", from: 300, to: 520, dur: 0.08, gain: 0.06 });
      break;

    case "pick":
      beep(ac, { type: "triangle", from: 620, to: 880, dur: 0.07, gain: 0.1 });
      break;

    case "roll":
      // 반죽을 미는 소리. 낮게 훑는 노이즈라 "쓱" 하고 밀리는 느낌이에요.
      swoosh(ac, { dur: 0.3, from: 900, to: 260, gain: 0.09, q: 0.9 });
      break;

    case "success":
      beep(ac, { type: "triangle", from: 523, to: 659, dur: 0.12, gain: 0.16 });
      beep(ac, { type: "triangle", from: 659, to: 784, dur: 0.12, gain: 0.16, delay: 0.11 });
      beep(ac, { type: "triangle", from: 784, to: 1046, dur: 0.3, gain: 0.18, delay: 0.22 });
      break;

    case "newmenu":
      beep(ac, { type: "triangle", from: 659, to: 880, dur: 0.12, gain: 0.16 });
      beep(ac, { type: "triangle", from: 880, to: 1174, dur: 0.12, gain: 0.16, delay: 0.11 });
      beep(ac, { type: "triangle", from: 1174, to: 1568, dur: 0.26, gain: 0.16, delay: 0.22 });
      break;

    case "fail":
      // 두 음이 아래로 처져서 "실패"로 읽혀요.
      beep(ac, { type: "sawtooth", from: 400, to: 300, dur: 0.16, gain: 0.13 });
      beep(ac, { type: "sawtooth", from: 300, to: 150, dur: 0.38, gain: 0.13, delay: 0.15 });
      break;
  }
}
