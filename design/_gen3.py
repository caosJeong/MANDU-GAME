from _parts import cat, page

# ---------- 타이틀 ----------
inner = f'''
  <div style="flex: 1; display: flex; flex-direction: column; gap: 14px; justify-content: center; text-align: center; padding: 8px 20px 24px;">
    <div style="display: flex; flex-direction: column; align-items: center;">
      {cat("normal", w=196)}
      <h1 style="margin: 8px 0 4px; font-size: 32px; letter-spacing: -1px;">뚱냥만두</h1>
      <p style="margin: 0; color: #8A6A5C; font-size: 14px;">할머니가 알려준 그 만두</p>
    </div>

    <div style="height: 8px;"></div>

    <div style="background: #E30208; color: #FFF6E4; border: 3px solid #522030; box-shadow: 0 5px 0 #7A0104; border-radius: 16px; padding: 16px; font-size: 18px; font-weight: 700;">시작하기</div>
    <div style="display: flex; gap: 10px;">
      <div style="flex: 1; background: #FFFDF2; border: 2px solid #D8B98E; border-radius: 12px; padding: 12px; font-size: 14px;">📖 도감</div>
    </div>
  </div>'''
open("Main.dc.html","w").write(page(inner, banner=False, home=False))

# ---------- 도감 ----------
NEW_MENUS = [
    ("🧀", "매콤치즈 만두", "🧀 치즈 · 🥫 고추장 · 🌶️ 매운고추", True),
    ("🥚", "에그마요 만두", "🥚 계란 · 🥄 마요네즈", True),
    ("❓", "???", "힌트: 달기만 한 두 가지", False),
    ("❓", "???", "힌트: 고기 없이 담백하게", False),
    ("❓", "???", "힌트: 매운 것에 고기를 더하면", False),
    ("❓", "???", "힌트: 고양이도 인상을 찌푸린 조합", False),
]

rows = []
for emoji, name, desc, owned in NEW_MENUS:
    bd = "#E30208" if owned else "#E8D5B8"
    rows.append(f'''      <li style="display: flex; align-items: center; gap: 12px; background: #FFFDF2; border: 1px solid {bd}; border-radius: 14px; padding: 12px 14px;">
        <span style="font-size: 28px;">{emoji}</span>
        <span style="display: flex; flex-direction: column; gap: 2px;">
          <strong>{name}</strong>
          <small style="font-size: 12px; color: #8A6A5C;">{desc}</small>
        </span>
      </li>''')

# 정통 레시피 진행 카드 — 광고로 알아낸 재료만 공개
known = ["🥩 돼지고기 ×3", "🧄 마늘 ×1"]
slots = "".join(
    f'<span style="background: #F5DD85; border: 2px solid #522030; border-radius: 8px; padding: 4px 8px; font-size: 12px; color: #B0181C; font-weight: 700;">{k}</span>'
    for k in known
) + "".join(
    '<span style="background: #F7EDD9; border: 1px dashed #C9AE8C; border-radius: 8px; padding: 4px 10px; font-size: 12px; color: #A8907C;">?</span>'
    for _ in range(5)
)

inner = f'''
  <div style="flex: 1; display: flex; flex-direction: column; gap: 14px; padding: 8px 20px 24px;">
    <h2 style="margin: 4px 0 0; font-size: 20px;">도감</h2>

    <div style="background: #FFFDF2; border: 2px solid #D8B98E; border-radius: 14px; padding: 14px; display: flex; flex-direction: column; gap: 10px;">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <strong style="font-size: 15px;">정통 만두 레시피</strong>
        <span style="font-size: 13px; color: #B0181C; font-weight: 700;">2 / 7 알아냄</span>
      </div>
      <div style="display: flex; flex-wrap: wrap; gap: 6px;">{slots}</div>
    </div>

    <div style="display: flex; flex-direction: column; gap: 6px; font-size: 13px; color: #8A6A5C;">
      <div style="height: 12px; border-radius: 6px; background: #E8D5B8; overflow: hidden;">
        <div style="height: 100%; width: 33.3%; background: #E30208;"></div>
      </div>
      <span>내가 만든 신메뉴 2/6</span>
    </div>

    <ul style="list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px;">
{chr(10).join(rows)}
    </ul>

    <div style="flex: 1;"></div>
    <div style="background: #E30208; color: #FFF6E4; border: 3px solid #522030; box-shadow: 0 4px 0 #7A0104; border-radius: 14px; padding: 14px; font-size: 16px; font-weight: 700; text-align: center;">돌아가기</div>
  </div>'''
open("Collection.dc.html","w").write(page(inner, height=900))
print("Main, Collection written")
