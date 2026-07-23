import "../styles/RecipeCard.css"
import { Link } from "react-router-dom";


interface RecipeCardProps {
    recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
    return (
        <Link className='recipe_card' to={`/recipes/${recipe.recipe_id}`} key={recipe.recipe_id}>
            <h2>{recipe.name}</h2>
            {recipe.tags?.map((tag) => (
                <p key={tag.tag_id} className="tag">{tag.desc}</p>
            ))}
        </Link>
    )
}