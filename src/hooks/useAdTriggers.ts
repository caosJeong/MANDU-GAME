/**
 * 기획서 4.2 트리거 포인트를 그대로 옮긴 로직이에요.
 * - 판마다 30~40% 확률로 "포인트 2배" 버튼 노출 (매판 고정 노출은 이탈 위험)
 * - 히든 발견 시 확정 노출 (감정 고조 시점)
 * - 연속 3~5판마다 "다음 판 재료 추가" 제안, 간격은 매번 랜덤 (패턴 학습 방지)
 *
 * 여기서 만드는 건 "버튼을 보여줄지" 뿐이에요. 실제 재생은 사용자가 눌렀을 때만 일어나요.
 */
import { useCallback, useRef } from "react";

const DOUBLE_POINTS_CHANCE = 0.35; // 30~40% 구간
const MIN_STREAK_GAP = 3;
const MAX_STREAK_GAP = 5;

export type AdOffers = {
  /** "광고 보고 포인트 2배" */
  doublePoints: boolean;
  /** "영상 보고 도감 확정 등록 + 보너스 포인트" */
  hiddenBonus: boolean;
  /** "광고 시청 시 다음 판 재료 추가" */
  extraIngredients: boolean;
};

function nextGap() {
  return MIN_STREAK_GAP + Math.floor(Math.random() * (MAX_STREAK_GAP - MIN_STREAK_GAP + 1));
}

export function useAdTriggers() {
  const roundsSinceStreakOfferRef = useRef(0);
  const nextStreakGapRef = useRef(nextGap());

  /** 한 판이 끝난 시점에 한 번만 호출해서 이번 결과 화면에 띄울 제안을 정해요. */
  const rollOffers = useCallback((foundHidden: boolean): AdOffers => {
    roundsSinceStreakOfferRef.current += 1;

    const extraIngredients = roundsSinceStreakOfferRef.current >= nextStreakGapRef.current;
    if (extraIngredients) {
      roundsSinceStreakOfferRef.current = 0;
      nextStreakGapRef.current = nextGap(); // 간격도 매번 랜덤화해요
    }

    return {
      doublePoints: Math.random() < DOUBLE_POINTS_CHANCE,
      hiddenBonus: foundHidden,
      extraIngredients,
    };
  }, []);

  return { rollOffers };
}
