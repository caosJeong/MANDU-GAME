import { discoveredProgress, type SaveData } from "../storage";

/**
 * 주간 랭킹 화면이에요.
 * 기획서 4.5대로 1단계에서는 서버 없이 "내 이번 주 기록"만 보여줘요.
 *
 * TODO(2단계): 서버 연동 후 userId 기준으로 주간 "최다 히든 발견자" 랭킹을 불러와요.
 *   - 집계 단위는 storage.ts의 currentWeekKey()와 동일하게 맞춰요.
 */
export function RankingScreen({ save, onBack }: { save: SaveData; onBack: () => void }) {
  const { total } = discoveredProgress(save);

  return (
    <div className="screen screen--list">
      <h2 className="result-title">주간 랭킹</h2>
      <p className="ranking-week">{save.weekly.weekKey} · 최다 히든 발견자</p>

      <div className="ranking-me">
        <span className="ranking-me__label">내 이번 주 기록</span>
        <div className="ranking-me__grid">
          <div>
            <strong>{save.weekly.hiddenFound}</strong>
            <span>발견한 히든</span>
          </div>
          <div>
            <strong>{save.weekly.rounds}</strong>
            <span>플레이한 판</span>
          </div>
          <div>
            <strong>{save.weekly.bestScore}</strong>
            <span>최고 점수</span>
          </div>
        </div>
      </div>

      <p className="ranking-note">
        다른 유저와의 순위 비교는 준비 중이에요. 지금 기록은 이번 주가 끝나면 초기화되고, 도감과
        포인트는 그대로 유지돼요. (전체 히든 {total}종)
      </p>

      <button type="button" className="primary-button" onClick={onBack}>
        돌아가기
      </button>
    </div>
  );
}
