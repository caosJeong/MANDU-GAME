from _parts import cat, page, steps, RED, INK, MUTED, CARD, LINE, YELLOW, PANEL

# ---------- 재료 14종 ----------
# 정답 7종과 수량은 실제 해태 고향만두 표시 원재료의 "함량 내림차순" 순서를 따랐어요.
# 공개된 수치는 돼지고기 13% 하나뿐이라, 나머지는 표시 순서를 12번의 선택으로 환산한 값입니다.
RECIPE = [("🥩","돼지고기",3), ("🫓","두부",2), ("🧅","양파",2),
          ("🌿","부추",2), ("🥬","대파",1), ("🧄","마늘",1), ("🍜","당면",1)]
WRONG  = [("🥚","계란"),("🍫","초콜릿"),("🌶️","매운고추"),("🧀","치즈"),
          ("🥫","고추장"),("🥄","마요네즈"),("🍬","젤리")]

ORDER = ["돼지고기","계란","두부","초콜릿","양파","매운고추","부추","치즈",
         "대파","고추장","마늘","마요네즈","당면","젤리"]
EMOJI = dict([(n, e) for e, n, _ in RECIPE] + [(n, e) for e, n in WRONG])

# 지금 고른 상태 (중복 선택 시연)
PICKED = {"돼지고기": 2, "부추": 1, "두부": 1}

def chip(name):
    e = EMOJI[name]
    n = PICKED.get(name, 0)
    if n:
        bg, bd, label = YELLOW, INK, f"color: {INK}; font-weight: 700;"
    else:
        bg, bd, label = CARD, LINE, f"color: {MUTED};"
    badge = ''
    if n:
        badge = (f'<span style="position: absolute; top: -7px; right: -7px; min-width: 22px; height: 22px; '
                 f'border-radius: 11px; background: {RED}; color: #FFF6E4; border: 2px solid {INK}; font-size: 11px; '
                 f'font-weight: 700; display: flex; align-items: center; justify-content: center;">{n}</span>')
    return (f'        <div style="position: relative; background: {bg}; border: 2px solid {bd}; '
            'border-radius: 14px; padding: 10px 4px 8px; display: flex; flex-direction: column; '
            'align-items: center; gap: 3px;">\n'
            f'          <span style="font-size: 24px;">{e}</span>\n'
            f'          <span style="font-size: 11px; {label}">{name}</span>\n'
            f'          {badge}\n        </div>')

shelf = "\n".join(chip(n) for n in ORDER)

picked_pills = "".join(
    f'<span style="background: {YELLOW}; border: 2px solid {INK}; border-radius: 9px; padding: 3px 9px; '
    f'font-size: 12px; font-weight: 700;">{EMOJI[n]} {n} ×{c}</span>'
    for n, c in PICKED.items())

inner = f'''
  <div style="flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 12px; padding: 12px 16px 16px;">
    {steps(1)}

    <div style="display: flex; flex-direction: column; gap: 10px; flex: 1; min-height: 0;">
      <p style="margin: 0; font-size: 18px; font-weight: 700;">만두속 만들기</p>
      <p style="margin: 0; font-size: 13px; color: {MUTED}; line-height: 1.5;">같은 재료를 여러 번 넣을 수 있어요. 양까지 맞아야 그 맛이 나요.</p>

      <div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; align-content: start;">
{shelf}
      </div>

      <div style="background: {CARD}; border: 2px solid {LINE}; border-radius: 14px; padding: 10px 12px; display: flex; flex-direction: column; gap: 8px;">
        <span style="font-size: 12px; color: {MUTED};">지금 만두속 · 4번 넣음</span>
        <div style="display: flex; flex-wrap: wrap; gap: 6px;">{picked_pills}</div>
      </div>

      <div style="flex: 1;"></div>
      <div style="background: {RED}; color: #FFF6E4; border: 3px solid {INK}; box-shadow: 0 4px 0 #7A0104; border-radius: 14px; padding: 14px; font-size: 16px; font-weight: 700; text-align: center;">이 재료로 만두속 만들기</div>
    </div>
  </div>'''
open("Filling.dc.html","w").write(page(inner))

# ---------- 2. 반죽 ----------
def choice(title, desc, on):
    bg = YELLOW if on else CARD
    bd = INK if on else LINE
    return f'''        <div style="display: flex; align-items: center; gap: 12px; background: {bg}; border: 2px solid {bd}; border-radius: 14px; padding: 13px;">
          <span style="flex: 1; font-size: 15px; font-weight: 700;">{title}</span>
          <span style="font-size: 12px; color: {MUTED};">{desc}</span>
        </div>'''

paw = '''<svg viewBox="0 0 100 100" width="72" height="72" style="position: absolute; %POS%" aria-hidden="true">
          <ellipse cx="51" cy="63" rx="27" ry="23" fill="#fff6e8" stroke="#522030" stroke-width="4"/>
          <circle cx="24" cy="38" r="10" fill="#fff6e8" stroke="#522030" stroke-width="4"/>
          <circle cx="42" cy="26" r="10" fill="#fff6e8" stroke="#522030" stroke-width="4"/>
          <circle cx="61" cy="26" r="10" fill="#fff6e8" stroke="#522030" stroke-width="4"/>
          <circle cx="79" cy="38" r="10" fill="#fff6e8" stroke="#522030" stroke-width="4"/>
          <ellipse cx="51" cy="63" rx="13" ry="11" fill="#f6a88c" opacity="0.55"/>
        </svg>'''

inner = f'''
  <div style="flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 12px; padding: 12px 16px 16px;">
    {steps(2)}

    <div style="display: flex; flex-direction: column; gap: 10px; flex: 1; min-height: 0;">
      <p style="margin: 0; font-size: 18px; font-weight: 700;">만두피 반죽하기</p>
      <p style="margin: 0; font-size: 13px; color: {MUTED}; line-height: 1.5;">반죽에 따라 만두피 두께가 달라져요. 맛에는 영향이 없어요.</p>

      <div style="min-height: 185px; border-radius: 16px; border: 2px solid {LINE}; background: repeating-linear-gradient(45deg, #F2E4C4, #F2E4C4 12px, #EBD9B0 12px, #EBD9B0 24px); display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden;">
        <div style="width: 146px; height: 146px; background: #F7E2C4; border: 3px solid #C9A46E; border-radius: 50%;"></div>
        {paw.replace("%POS%", "left: 92px; top: 62px; transform: rotate(-16deg);")}
        {paw.replace("%POS%", "right: 92px; top: 62px; transform: rotate(16deg) scaleX(-1);")}
      </div>

      <div style="display: flex; flex-direction: column; gap: 8px;">
{choice("밀가루 많이", "두툼한 만두피", False)}
{choice("알맞게", "보통 만두피", True)}
{choice("물 많이", "얇은 만두피", False)}
      </div>

      <div style="flex: 1;"></div>
      <div style="background: {RED}; color: #FFF6E4; border: 3px solid {INK}; box-shadow: 0 4px 0 #7A0104; border-radius: 14px; padding: 14px; font-size: 16px; font-weight: 700; text-align: center;">반죽 끝내기</div>
    </div>
  </div>'''
open("Dough.dc.html","w").write(page(inner))
print("Filling, Dough written")
