import { HIDDEN_RECIPES, recipeIngredientNames } from "../game/recipes";
import { discoveredProgress, type SaveData } from "../storage";

/**
 * 도감 화면이에요. 아직 못 찾은 히든은 "?"로 표시하고 힌트만 보여줘요 (기획서 6번 리텐션 설계).
 */
export function CollectionScreen({ save, onBack }: { save: SaveData; onBack: () => void }) {
  const { found, total } = discoveredProgress(save);

  return (
    <div className="screen screen--list">
      <h2 className="result-title">히든 만두 도감</h2>

      <div className="collection-progress">
        <div className="progress">
          <div className="progress__fill" style={{ width: `${(found / total) * 100}%` }} />
        </div>
        <span>
          전체 히든 만두 {found}/{total}개 수집
        </span>
      </div>

      <ul className="collection">
        {HIDDEN_RECIPES.map((recipe) => {
          const owned = save.discovered.includes(recipe.id);
          return (
            <li key={recipe.id} className={`collection__item ${owned ? "is-owned" : ""}`}>
              <span className="collection__emoji">{owned ? recipe.emoji : "❓"}</span>
              <span className="collection__body">
                <strong>{owned ? recipe.name : "???"}</strong>
                <small>{owned ? recipeIngredientNames(recipe) : `힌트: ${recipe.hint}`}</small>
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
