# 목업 아트보드 공용 조각
# 색은 원작 고향만두 플래시 게임 화면에서 직접 샘플링했어요
# (배경 보라 #B068CC, 테이블 노랑 #F5DD85, 빨강 #E30208, 초록 #1AC213, 진갈색 #520002).
FONT = '-apple-system, BlinkMacSystemFont, "Pretendard", "Apple SD Gothic Neo", "Noto Sans KR", sans-serif'

BG      = "#B068CC"   # 벽 보라
BG_DEEP = "#8E4FAA"   # 그림자·배너
PANEL   = "#FFF6E4"   # 크림 패널
CARD    = "#FFFDF2"
LINE    = "#D8B98E"
INK     = "#522030"
MUTED   = "#8A6A5C"
RED     = "#E30208"   # 주요 버튼
YELLOW  = "#F5DD85"   # 선택·강조
GREEN   = "#1AC213"

WATERMARK = "%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27132%27%20height%3D%27104%27%3E%3Ctext%20x%3D%276%27%20y%3D%2734%27%20font-family%3D%27sans-serif%27%20font-size%3D%2721%27%20font-weight%3D%27700%27%20fill%3D%27%23BE7DD6%27%20transform%3D%27rotate%28-12%206%2034%29%27%3E%EB%9A%B1%EB%83%A5%EB%A7%8C%EB%91%90%3C%2Ftext%3E%3Ctext%20x%3D%2762%27%20y%3D%2788%27%20font-family%3D%27sans-serif%27%20font-size%3D%2721%27%20font-weight%3D%27700%27%20fill%3D%27%23BE7DD6%27%20transform%3D%27rotate%28-12%2062%2088%29%27%3E%EB%9A%B1%EB%83%A5%EB%A7%8C%EB%91%90%3C%2Ftext%3E%3C%2Fsvg%3E"

# 만두를 든 고양이 캐릭터 (viewBox 240 x 256)
# 머리+귀는 이음매에 외곽선이 새지 않도록 하나의 합집합 path 로 그려요.
HEAD = ("M63.6 75.5 L60 12 L99.5 39.6 A60 60 0 0 1 140.5 39.6 L180 12 L176.4 75.5 "
        "A60 60 0 1 1 63.6 75.5 Z")
MANDU = ("M65 182 A11 11 0 0 1 87 182 A11 11 0 0 1 109 182 A11 11 0 0 1 131 182 "
         "A11 11 0 0 1 153 182 A11 11 0 0 1 175 182 A55 53 0 0 1 65 182 Z")

FACES = {
  "normal": '''<circle cx="100" cy="92" r="7" fill="#522030"/>
    <circle cx="140" cy="92" r="7" fill="#522030"/>
    <path d="M108 106 A6 6 0 0 0 120 106 A6 6 0 0 0 132 106" fill="none" stroke="#522030" stroke-width="4.5" stroke-linecap="round"/>''',
  "happy": '''<path d="M90 96 A11 11 0 0 1 110 96" fill="none" stroke="#522030" stroke-width="5" stroke-linecap="round"/>
    <path d="M130 96 A11 11 0 0 1 150 96" fill="none" stroke="#522030" stroke-width="5" stroke-linecap="round"/>
    <path d="M108 108 A6 6 0 0 0 120 108 A6 6 0 0 0 132 108" fill="none" stroke="#522030" stroke-width="4.5" stroke-linecap="round"/>''',
  "surprised": '''<circle cx="99" cy="90" r="10" fill="#522030"/>
    <circle cx="141" cy="90" r="10" fill="#522030"/>
    <ellipse cx="120" cy="111" rx="7" ry="9" fill="none" stroke="#522030" stroke-width="4.5"/>''',
  "sad": '''<circle cx="100" cy="95" r="6.5" fill="#522030"/>
    <circle cx="140" cy="95" r="6.5" fill="#522030"/>
    <path d="M105 79 L92 85" fill="none" stroke="#522030" stroke-width="4.5" stroke-linecap="round"/>
    <path d="M135 79 L148 85" fill="none" stroke="#522030" stroke-width="4.5" stroke-linecap="round"/>
    <path d="M110 113 A13 13 0 0 1 130 113" fill="none" stroke="#522030" stroke-width="4.5" stroke-linecap="round"/>''',
}

def cat(face="normal", w=200, mandu="#f7dcb2"):
    """만두를 든 고양이. mandu 로 만두 색만 바꿀 수 있어요(실패 화면은 칙칙하게)."""
    h = round(w * 256 / 240)
    return f'''<svg viewBox="0 0 240 256" width="{w}" height="{h}" aria-hidden="true">
    <g stroke="#522030" stroke-width="5" stroke-linejoin="round" stroke-linecap="round">
      <path d="M176 208 C222 212 232 166 208 148" fill="none" stroke="#522030" stroke-width="21"/>
      <path d="M176 208 C222 212 232 166 208 148" fill="none" stroke="#fff6e8" stroke-width="12"/>
      <ellipse cx="120" cy="188" rx="72" ry="58" fill="#fff6e8"/>
      <path d="{HEAD}" fill="#fff6e8"/>
      <path d="M50 92 L78 92" stroke-width="4"/>
      <path d="M52 104 L79 101" stroke-width="4"/>
      <path d="M190 92 L162 92" stroke-width="4"/>
      <path d="M188 104 L161 101" stroke-width="4"/>
      <path d="{MANDU}" fill="{mandu}"/>
      <ellipse cx="66" cy="204" rx="21" ry="17" fill="#fff6e8"/>
      <path d="M60 190 L60 196" stroke-width="4"/>
      <path d="M72 190 L72 196" stroke-width="4"/>
      <ellipse cx="174" cy="204" rx="21" ry="17" fill="#fff6e8"/>
      <path d="M168 190 L168 196" stroke-width="4"/>
      <path d="M180 190 L180 196" stroke-width="4"/>
    </g>
    <ellipse cx="84" cy="110" rx="12" ry="8.5" fill="#f6a88c" opacity="0.85"/>
    <ellipse cx="156" cy="110" rx="12" ry="8.5" fill="#f6a88c" opacity="0.85"/>
    {FACES[face]}
  </svg>'''


def page(inner, height=844, banner=True, home=True):
    """보라 벽 위에 크림 패널을 얹은 구조 — 플래시 시절 게임 레이아웃이에요."""
    hdr_left = ('<div style="padding: 8px 10px; font-size: 14px; color: #F3E2FA; font-weight: 700;">← 홈</div>'
                if home else '<span></span>')
    bn = (f'''
  <div style="flex: 0 0 auto; min-height: 60px; display: flex; align-items: center; justify-content: center; background: {BG_DEEP};">
    <span style="font-size: 11px; color: #E3C9F0;">배너 광고 영역</span>
  </div>''' if banner else '')
    return f'''<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  <style>
    body {{ margin: 0; font-family: {FONT}; word-break: keep-all; }}
    a {{ color: {RED}; }} a:hover {{ color: #B0181C; }}
  </style>
</helmet>
<div style="width: 390px; min-height: {height}px; background-color: {BG}; background-image: url(&quot;data:image/svg+xml,{WATERMARK}&quot;); color: {INK}; display: flex; flex-direction: column;">

  <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px;">
    {hdr_left}
    <div style="padding: 8px 10px; font-size: 14px; color: #F3E2FA; font-weight: 700;">나가기 ✕</div>
  </div>

  <div style="flex: 1; display: flex; flex-direction: column; margin: 0 10px 10px; background: {PANEL}; border: 3px solid {INK}; border-radius: 18px; box-shadow: 0 5px 0 #7A3F94;">
{inner}
  </div>{bn}
</div>
</x-dc>
</body>
</html>
'''


def steps(active):
    """1·2·3 단계 표시줄"""
    out = []
    for i, name in enumerate(["만두속", "반죽", "모양"], start=1):
        on = i == active
        color = RED if on else "#B79E86"
        weight = "700" if on else "500"
        out.append(f'<span style="font-size: 13px; color: {color}; font-weight: {weight};">{i}. {name}</span>')
    sep = '<span style="font-size: 13px; color: #D8B98E;">›</span>'
    return '<div style="display: flex; align-items: center; gap: 8px;">' + sep.join(out) + '</div>'
