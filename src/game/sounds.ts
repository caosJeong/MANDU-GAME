/**
 * Web Audio 기반 합성 효과음이에요. 오디오 파일 없이 코드만으로 소리를 만들어요.
 * 나중에 실제 음원으로 바꾸려면 playSound 내부만 AudioBuffer 재생으로 교체하면 돼요.
 */
export type SoundType = "tick" | "fold" | "sizzle" | "done" | "burn" | "hidden";

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

export function playSound(type: SoundType) {
  const ac = getContext();
  if (!ac) return;

  switch (type) {
    case "tick":
      beep(ac, { type: "square", from: 880, to: 660, dur: 0.05, gain: 0.06 });
      break;
    case "fold":
      beep(ac, { type: "triangle", from: 520, to: 780, dur: 0.12, gain: 0.14 });
      break;
    case "sizzle": {
      // 화이트 노이즈로 만든 찜통 김 빠지는 소리예요.
      const frames = ac.sampleRate * 0.35;
      const buffer = ac.createBuffer(1, frames, ac.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < frames; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
      const src = ac.createBufferSource();
      const filter = ac.createBiquadFilter();
      const g = ac.createGain();
      filter.type = "bandpass";
      filter.frequency.value = 2400;
      g.gain.value = 0.12;
      src.buffer = buffer;
      src.connect(filter).connect(g).connect(ac.destination);
      src.start();
      break;
    }
    case "done":
      beep(ac, { type: "triangle", from: 523, to: 784, dur: 0.14, gain: 0.16 });
      beep(ac, { type: "triangle", from: 784, to: 1046, dur: 0.18, gain: 0.14, delay: 0.13 });
      break;
    case "burn":
      beep(ac, { type: "sawtooth", from: 320, to: 90, dur: 0.4, gain: 0.16 });
      break;
    case "hidden":
      beep(ac, { type: "triangle", from: 659, to: 880, dur: 0.12, gain: 0.16 });
      beep(ac, { type: "triangle", from: 880, to: 1174, dur: 0.12, gain: 0.16, delay: 0.11 });
      beep(ac, { type: "triangle", from: 1174, to: 1568, dur: 0.26, gain: 0.16, delay: 0.22 });
      break;
  }
}
