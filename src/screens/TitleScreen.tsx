import { Cat } from "../components/Cat";

/**
 * 타이틀 화면이에요.
 * 정책상 진입 직후 바텀시트/모달을 자동으로 띄우지 않고, 배너도 여기엔 붙이지 않아요 (기획서 4.2).
 */
export function TitleScreen({
  onStart,
  onOpenCollection,
}: {
  onStart: () => void;
  onOpenCollection: () => void;
}) {
  return (
    <div className="screen screen--title">
      <div className="title-logo">
        <Cat width={196} />
        <h1 className="title-logo__text">뚱냥만두</h1>
        <p className="title-logo__sub">할머니가 알려준 그 만두</p>
      </div>

      <button type="button" className="primary-button primary-button--big" onClick={onStart}>
        시작하기
      </button>
      <div className="title-links">
        <button type="button" className="ghost-button" onClick={onOpenCollection}>
          📖 도감
        </button>
      </div>
    </div>
  );
}
