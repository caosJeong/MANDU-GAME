# 만두 만들기 🥟

토스 앱인토스(Apps in Toss) 미니앱용 캐주얼 요리 게임.
반죽 → 재료 조합 → 빚기 → 화력 조절 조리 4단계로 만두를 만들고, 히든 레시피를 도감에 모아요.

## 실행

```bash
npm install
npm run dev
```

http://localhost:5174 에서 열려요.

## 스크립트

| 명령 | 설명 |
|---|---|
| `npm run dev` | 로컬 개발 서버 |
| `npm run build` | 타입체크 + 프로덕션 번들 (`dist/`) |
| `npm run ait:build` | 앱인토스 `.ait` 번들 생성 |

## 배포 전 체크리스트

- [ ] 콘솔에서 미니앱 등록 후 `apps-in-toss.config.ts`의 `appName` 교체
- [ ] `src/ads/policy.ts`의 `AD_GROUP_IDS`를 실제 광고 그룹 ID로 교체 (지금은 `TEST_*` 플레이스홀더)
- [ ] 앱 아이콘 / 스크린샷 / 개인정보처리방침 등록
- [ ] QR 테스트로 실기기 확인 (햅틱, 광고, 나가기 동작)

자세한 개발 컨텍스트는 [CLAUDE.md](./CLAUDE.md) 참고.
