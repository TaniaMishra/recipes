import "../styles/RecipeCard.css"
import { Link } from "react-router-dom";


interface RecipeCardProps {
    recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
    return (
        <Link className='recipe_card' to={`/recipes/${recipe.recipe_id}`} key={recipe.recipe_id}>
            <h2>{recipe.name}</h2>
            <div className="recipe_tags">
                {recipe.tags?.map((tag, i) => (
                    <p key={tag.tag_id} className="tag">{i >= 1 ? ", " : ""}{tag.desc}</p>
                ))}
            </div>
        </Link>
    )
}