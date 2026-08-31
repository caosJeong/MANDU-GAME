# 만두 만들기 — 프로젝트 컨텍스트 (Claude Code용)

작성 기준일: 2026-08-31

## 한 줄 요약

반죽 → 재료 조합 → 빚기 → 화력 조절 조리로 만두를 만드는 캐주얼 미니게임.
토스 앱인토스(Apps in Toss) 미니앱, WebView SDK(`@apps-in-toss/web-framework`) + Vite + React.
쥬니버 슈게임 '황진이 고향만두' 계승 + 재료 조합/히든 레시피 수집 요소 추가.

## 지금 상태

- **로컬 구현 완료, 콘솔 미등록.** workspaceId/miniAppId 없음 — 아직 `miniapp_create`를 하지 않았다.
- 기획서 원본: `~/Downloads/만두게임_기획서_1.md` (보완본. `만두게임_기획서.md`는 구버전)
- 빌드 통과(`npm run build`), 로컬에서 전체 게임 루프 1판 완주 검증 완료
  (주문 4개 소화 → 히든 3종 발견 → 도감 3/8 등록 → 225P 지급 → localStorage 저장 확인)
- 광고 그룹 ID는 아직 플레이스홀더(`TEST_*`)라 광고는 unsupported로 떨어지고 보상도 지급되지 않는다.

## 확정된 결정 사항

기획서 4.5에 명시된 것 + 구현하며 정한 것.

- **전면(인터스티셜) 광고 미사용.** 배너(상시) + 보상형(선택) 이원화만 사용
- **배너 노출 화면**: 타이틀 X / 플레이·결과·도감·랭킹 O / 로딩·팝업 X (`src/ads/policy.ts`의 `BANNER_ALLOWED_SCREENS`가 단일 진실 공급원)
- **재료 선택 2~4개.** 기획 초안은 3~4개였으나 히든 레시피에 2개 조합(초코+딸기, 사과+계피)이 있어 최소 2개
- **주간 랭킹은 1단계 로컬 기록.** 서버 연동은 TODO
- **히든 도감 등록은 광고와 무관하게 자동.** 기획서 4.3의 "영상 보고 도감 확정 등록"은 3.3의 "자동 등록"과 충돌해서, 등록은 자동으로 하고 광고는 **보너스 포인트만** 주도록 구현했다. (기획 확인 필요)
- **히든 레시피 8종으로 시작.** 기획서 8번 "몇 개로 시작할지" 미확정 상태의 잠정치

## 프로젝트 구조

```
mandu-game/
├── apps-in-toss.config.ts      # appName, brand — 콘솔 등록 후 appName 교체 필요
├── src/
│   ├── App.tsx                  # 화면 라우팅 + 라운드/포인트/광고 보상 상태
│   ├── platform.ts              # Screen.close(나가기), SafeArea, User.getAnonymousKey
│   ├── storage.ts               # localStorage 저장 (도감/포인트/주간기록/userId)
│   ├── game/
│   │   ├── ingredients.ts        # 재료 15종 속성치(짠맛/감칠맛/신선도) + 궁합 쌍 테이블
│   │   ├── recipes.ts            # 히든 레시피 8종, 정확 조합 매칭
│   │   ├── orders.ts             # 손님 주문 3~5개 생성 + 의도 판정
│   │   ├── scoring.ts            # 상/중/하/히든 등급 판정, 포인트 계산
│   │   ├── haptics.ts            # Device.triggerHaptic 래퍼 (브라우저 폴백)
│   │   └── sounds.ts             # Web Audio 합성 효과음
│   ├── stages/                   # 4단계 미니게임
│   │   ├── DoughStage.tsx        # 반죽 탭 3회 → 밀대 드래그로 두께 맞추기
│   │   ├── FillingStage.tsx      # 재료 2~4개 선택
│   │   ├── FoldStage.tsx         # 왕복 마커 타이밍 탭 3회
│   │   └── CookStage.tsx         # 누르면 화력 UP, 초록 구간 유지, 94 넘으면 태움
│   ├── screens/                  # Title / Play / Result / Collection / Ranking
│   ├── ads/
│   │   ├── policy.ts             # 광고 그룹 ID + 정책 가드 + 배너 허용 화면
│   │   ├── bridge.ts             # 토스 브릿지 없는 환경 안전 가드
│   │   └── BannerSlot.tsx        # 하단 고정 배너 슬롯
│   └── hooks/
│       ├── useRewardedAd.ts      # 보상형 load→show→재load
│       ├── useTossBanner.ts      # 배너 attach/destroy
│       └── useAdTriggers.ts      # 기획서 4.3 트리거 확률/간격
└── .claude/launch.json
```

## 게임 규칙 / 주요 수치

- **반죽**: 3번 탭해 푼 뒤 드래그. 두께 100→0, 드래그 2.4px당 1 감소. 이상치 50, 초록 구간 38~62, 18 이하면 찢어짐(재시도 + 20점 감점)
- **빚기**: 1.4초 주기 왕복 마커, 중앙(0.5)에서 멀수록 감점, 3회 평균
- **조리**: 화력 상승 58/초, 하강 40/초. 적정 구간 45~78에서만 익음(30%/초), 94 이상이면 탐. 22초 제한
- **등급**: `filling*0.5 + (반죽+빚기+조리)/3*0.5` → 78↑ 상 / 55↑ 중 / 그 외 하, 히든은 조합 정확 매칭 시 확정
- **포인트**: 상 30 / 중 20 / 하 10 / 히든 60, 주문 적중 +15, 광고 히든 보너스 +30
- **광고 트리거**: 포인트 2배 35% 확률, 히든 발견 시 확정, 재료 슬롯 +1은 3~5판 랜덤 간격

## 검증 방법

브라우저 패널이 숨겨져 있으면 `requestAnimationFrame`이 멈춰서 빚기/조리 단계가 진행되지 않는다.
자동 검증할 때는 콘솔에서 아래 폴리필을 먼저 끼우고 화면을 재마운트할 것.

```js
window.requestAnimationFrame = (cb) => setTimeout(() => cb(performance.now()), 16);
```

## 다음 할 일 (우선순위 순)

1. **콘솔에 미니앱 등록** — `miniapp_create` → 발급된 appName을 `apps-in-toss.config.ts`에 반영.
   워크스페이스는 사업자당 1개 제한이 있으니 `hair-plucking-app`이 쓰는 workspaceId(61095) 재사용 여부 먼저 확인
2. **게임/비게임 분류 결정** — 이건 명백히 게임이라 `hair-plucking-app`(비게임)과 다르게 등록해야 한다
3. **인앱 광고 신청** → 배너/보상형 광고 그룹 ID 발급받아 `src/ads/policy.ts`의 `AD_GROUP_IDS` 교체
4. 밸런싱 (기획서 8번): 재료 속성치 수치, 히든 레시피 최종 개수, 포인트 → 리워드 전환 비율
5. 앱 아이콘/스크린샷/개인정보처리방침 준비 → 앱 정보 검토 요청 제출
6. 승인 후 `npm run build` → `npx ait build` → `bundle_upload` → QR 테스트 → 출시
7. (후속) 주간 랭킹 서버 연동 — 집계 주 키는 `storage.ts`의 `currentWeekKey()`와 맞출 것

## 로컬 개발

```bash
npm install
npm run dev   # http://localhost:5174
```

로컬 브라우저에는 토스 브릿지가 없어서 광고/햅틱/나가기는 자동으로 비활성화(햅틱은 navigator.vibrate 폴백)된다.
게임 로직은 그대로 테스트 가능하다.
