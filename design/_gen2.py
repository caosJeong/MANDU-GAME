from _parts import cat, page, steps

# ---------- 3. 모양 + 조리법 ----------
SHAPES = [("긴반달", "M20 62 A40 40 0 0 1 100 62 Z", ["굽기"]),
          ("또아리", "", ["찌기", "삶기"]),
          ("쭈그리", "", ["삶기"])]

def shape_card(name, on):
    bg = "#F5DD85" if on else "#FFFDF2"
    bd = "#E30208" if on else "#E8D5B8"
    color = "#B0181C" if on else "#8A6A5C"
    weight = "700" if on else "500"
    if name == "긴반달":
        art = '<path d="M14 52 A46 30 0 0 1 106 52 Z" fill="#fff6e8" stroke="#522030" stroke-width="4" stroke-linejoin="round"/>'
    elif name == "또아리":
        art = ('<circle cx="60" cy="34" r="26" fill="#fff6e8" stroke="#522030" stroke-width="4"/>'
               '<circle cx="60" cy="34" r="9" fill="none" stroke="#522030" stroke-width="4"/>')
    else:
        art = ('<path d="M18 46 A11 11 0 0 1 40 46 A11 11 0 0 1 62 46 A11 11 0 0 1 84 46 '
               'A11 11 0 0 1 106 46 A44 30 0 0 1 18 46 Z" fill="#fff6e8" stroke="#522030" stroke-width="4" stroke-linejoin="round"/>')
    return f'''        <div style="flex: 1; background: {bg}; border: 1.5px solid {bd}; border-radius: 14px; padding: 12px 6px; display: flex; flex-direction: column; align-items: center; gap: 6px;">
          <svg viewBox="0 0 120 66" width="86" height="47" aria-hidden="true">{art}</svg>
          <span style="font-size: 13px; color: {color}; font-weight: {weight};">{name}</span>
        </div>'''

def cook_pill(name, enabled, on=False):
    if not enabled:
        return (f'        <div style="flex: 1; background: #FFFDF2; border: 2px solid #D8B98E; border-radius: 12px; '
                f'padding: 14px; font-size: 14px; text-align: center; color: #B79E86;">{name}</div>')
    bg = "#F5DD85" if on else "#FFFDF2"
    bd = "#E30208" if on else "#E8D5B8"
    col = "#B0181C" if on else "#522030"
    wt = "700" if on else "500"
    return (f'        <div style="flex: 1; background: {bg}; border: 1.5px solid {bd}; border-radius: 12px; '
            f'padding: 14px; font-size: 14px; text-align: center; color: {col}; font-weight: {wt};">{name}</div>')

inner = f'''
  <div style="flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 14px; padding: 8px 20px 24px;">
    {steps(3)}

    <div style="display: flex; flex-direction: column; gap: 12px; flex: 1; min-height: 0;">
      <p style="margin: 0; font-size: 18px; font-weight: 700;">모양 고르고 익히기</p>
      <p style="margin: 0; font-size: 14px; color: #8A6A5C; line-height: 1.5;">모양마다 익히는 방법이 달라요.</p>

      <div style="display: flex; gap: 8px;">
{shape_card("긴반달", False)}
{shape_card("또아리", True)}
{shape_card("쭈그리", False)}
      </div>

      <p style="margin: 4px 0 0; font-size: 13px; color: #8A6A5C;">또아리는 이렇게 익혀요</p>
      <div style="display: flex; gap: 8px;">
{cook_pill("굽기", False)}
{cook_pill("찌기", True, on=True)}
{cook_pill("삶기", True)}
      </div>

      <div style="flex: 1; min-height: 150px; display: flex; align-items: center; justify-content: center; background: #F2E4C4; border: 2px solid #D8B98E; border-radius: 16px; padding: 10px 0;">
        {cat("happy", w=186)}
      </div>

      <div style="background: #E30208; color: #FFF6E4; border: 3px solid #522030; box-shadow: 0 4px 0 #7A0104; border-radius: 14px; padding: 14px; font-size: 16px; font-weight: 700; text-align: center;">만두 완성하기</div>
    </div>
  </div>'''
open("Shape.dc.html","w").write(page(inner, height=900))

# ---------- 결과: 성공 / 신메뉴 / 실패 ----------
def result_page(face, headline, sub, body, cta_primary, extra_cta="", height=844, mandu="#f7dcb2"):
    return page(f'''
  <div style="flex: 1; display: flex; flex-direction: column; gap: 14px; padding: 8px 20px 24px; align-items: stretch;">
    <div style="display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 18px 0 6px;">
      {cat(face, w=168, mandu=mandu)}
      <h2 style="margin: 4px 0 0; font-size: 22px; text-align: center;">{headline}</h2>
      <p style="margin: 0; font-size: 14px; color: #8A6A5C; text-align: center; line-height: 1.5;">{sub}</p>
    </div>
{body}
    <div style="flex: 1;"></div>
{extra_cta}    <div style="background: #E30208; color: #FFF6E4; border: 3px solid #522030; box-shadow: 0 4px 0 #7A0104; border-radius: 14px; padding: 14px; font-size: 16px; font-weight: 700; text-align: center;">{cta_primary}</div>
    <div style="display: flex; gap: 10px;">
      <div style="flex: 1; background: #FFFDF2; border: 2px solid #D8B98E; border-radius: 12px; padding: 12px; font-size: 14px; text-align: center;">📖 도감</div>
      <div style="flex: 1; background: #FFFDF2; border: 2px solid #D8B98E; border-radius: 12px; padding: 12px; font-size: 14px; text-align: center;">🏠 홈</div>
    </div>
  </div>''', height=height)

recipe_box = '''    <div style="background: #FFFDF2; border: 2px solid #D8B98E; border-radius: 14px; padding: 14px; display: flex; flex-direction: column; gap: 8px;">
      <span style="font-size: 12px; color: #8A6A5C;">오늘의 만두속</span>
      <span style="font-size: 14px; line-height: 1.7;">🥩 돼지고기 ×3 · 🫓 두부 ×2 · 🧅 양파 ×2 · 🌿 부추 ×2 · 🥬 대파 ×1 · 🧄 마늘 ×1 · 🍜 당면 ×1</span>
      <span style="font-size: 13px; color: #B0181C; font-weight: 700;">또아리 · 찌기 · 보통 만두피</span>
    </div>
'''
open("Success.dc.html","w").write(result_page(
    "happy", "정통 만두 완성!",
    "할머니 만두 그대로예요.<br>손님이 한 접시 더 시켰어요.",
    recipe_box, "한 판 더"))

newmenu_box = '''    <div style="background: #F5DD85; border: 2px solid #522030; border-radius: 14px; padding: 14px; display: flex; flex-direction: column; gap: 8px;">
      <span style="font-size: 12px; color: #B0181C; font-weight: 700;">도감에 등록됐어요</span>
      <span style="font-size: 16px; font-weight: 700;">🧀 매콤치즈 만두</span>
      <span style="font-size: 13px; color: #8A6A5C;">🧀 치즈 · 🥫 고추장 · 🌶️ 매운고추</span>
    </div>
'''
hint_then_share = '''    <div style="display: flex; align-items: center; gap: 10px; width: 100%; background: #FDF3D2; border: 2px solid #522030; border-radius: 14px; padding: 13px;">
      <span style="font-size: 10px; font-weight: 700; border: 1px solid #8A6A5C; border-radius: 4px; padding: 1px 4px; color: #8A6A5C;">광고</span>
      <span style="flex: 1; font-size: 14px; font-weight: 700;">광고 보고 힌트 보기</span>
      <span style="font-size: 12px; color: #8A6A5C;">재료 하나의 양</span>
    </div>
    <div style="display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; background: #FFFDF2; border: 2px solid #522030; color: #B0181C; border-radius: 14px; padding: 14px; font-size: 14px; font-weight: 700;">자랑하기</div>
'''
open("NewMenu.dc.html","w").write(result_page(
    "surprised", "오! 신메뉴로 등재",
    "정통은 아닌데… 이거 팔아도 되겠는데요?",
    newmenu_box, "한 판 더", extra_cta=hint_then_share))

fail_ad = '''    <div style="display: flex; align-items: center; gap: 10px; width: 100%; background: #FDF3D2; border: 2px solid #522030; border-radius: 14px; padding: 13px;">
      <span style="font-size: 10px; font-weight: 700; border: 1px solid #8A6A5C; border-radius: 4px; padding: 1px 4px; color: #8A6A5C;">광고</span>
      <span style="flex: 1; font-size: 14px; font-weight: 700;">광고 보고 힌트 보기</span>
      <span style="font-size: 12px; color: #8A6A5C;">재료 하나의 양</span>
    </div>
'''
open("Fail.dc.html","w").write(result_page(
    "sad", "손님이 그냥 나갔어요",
    "이 맛이 아니래요.<br>재료를 다시 골라볼까요?",
    "", "다시 만들기", extra_cta=fail_ad, mandu="#ded0bd"))
print("Shape, Success, NewMenu, Fail written")
