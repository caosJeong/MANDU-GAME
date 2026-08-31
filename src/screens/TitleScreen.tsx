import { discoveredProgress, type SaveData } from "../storage";

/**
 * 타이틀 화면이에요.
 * 정책상 진입 직후 바텀시트/모달을 자동으로 띄우지 않고, 배너도 여기엔 붙이지 않아요 (기획서 4.2).
 */
export function TitleScreen({
  save,
  onStart,
  onOpenCollection,
  onOpenRanking,
}: {
  save: SaveData;
  onStart: () => void;
  onOpenCollection: () => void;
  onOpenRanking: () => void;
}) {
  const progress = discoveredProgress(save);

  return (
    <div className="screen screen--title">
      <div className="title-logo">
        <span className="title-logo__emoji">🥟</span>
        <h1 className="title-logo__text">만두 만들기</h1>
        <p className="title-logo__sub">반죽부터 찜통까지, 한 판 3분</p>
      </div>

      <div className="title-stats">
        <div>
          <strong>{save.points.toLocaleString()}</strong>
          <span>포인트</span>
        </div>
        <div>
          <strong>
            {progress.found}/{progress.total}
          </strong>
          <span>히든 만두</span>
        </div>
      </div>

      <button type="button" className="primary-button primary-button--big" onClick={onStart}>
        시작하기
      </button>
      <div className="title-links">
        <button type="button" className="ghost-button" onClick={onOpenCollection}>
          📖 도감
        </button>
        <button type="button" className="ghost-button" onClick={onOpenRanking}>
          🏆 주간 랭킹
        </button>
      </div>
    </div>
  );
}
