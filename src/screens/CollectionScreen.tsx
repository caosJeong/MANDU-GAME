import { ingredientEmoji, ingredientName } from "../game/ingredients";
import { NEW_MENUS, RECIPE, RECIPE_IDS } from "../game/recipe";
import { hintProgress, menuProgress, type SaveData } from "../storage";

/**
 * 도감 화면이에요.
 * 위쪽은 정통 레시피 진행도(광고로 알아낸 재료만 공개), 아래쪽은 만들어 본 신메뉴예요.
 */
export function CollectionScreen({ save, onBack }: { save: SaveData; onBack: () => void }) {
  const menus = menuProgress(save);
  const hints = hintProgress(save);
  const showAll = save.clearedRecipe;

  return (
    <div className="screen screen--list">
      <h2 className="result-title result-title--left">도감</h2>

      <div className="recipe-card">
        <div className="recipe-card__head">
          <strong>정통 만두 레시피</strong>
          <span>{showAll ? "완성!" : `${hints.found} / ${hints.total} 알아냄`}</span>
        </div>
        <div className="recipe-card__slots">
          {RECIPE_IDS.map((id) =>
            showAll || save.revealed.includes(id) ? (
              <span key={id} className="slot slot--on">
                {ingredientEmoji(id)} {ingredientName(id)} ×{RECIPE[id]}
              </span>
            ) : (
              <span key={id} className="slot">
                ?
              </span>
            ),
          )}
        </div>
      </div>

      <div className="collection-progress">
        <div className="progress">
          <div
            className="progress__fill"
            style={{ width: `${(menus.found / menus.total) * 100}%` }}
          />
        </div>
        <span>
          내가 만든 신메뉴 {menus.found}/{menus.total}
        </span>
      </div>

      <ul className="collection">
        {NEW_MENUS.map((menu) => {
          const owned = save.discovered.includes(menu.id);
          return (
            <li key={menu.id} className={`collection__item ${owned ? "is-owned" : ""}`}>
              <span className="collection__emoji">{owned ? menu.emoji : "❓"}</span>
              <span className="collection__body">
                <strong>{owned ? menu.name : "???"}</strong>
                <small>
                  {owned
                    ? menu.ingredients.map(ingredientName).join(" · ")
                    : `힌트: ${menu.hint}`}
                </small>
              </span>
            </li>
          );
        })}
      </ul>

      <button type="button" className="primary-button" onClick={onBack}>
        돌아가기
      </button>
    </div>
  );
}
