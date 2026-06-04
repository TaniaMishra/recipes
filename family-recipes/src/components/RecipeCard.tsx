import "../styles/RecipeCard.css"
import { Link } from "react-router-dom";


interface RecipeCardProps {
    recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
    return (
        <Link className='recipe_card' to={`/recipes/${recipe.recipe_id}`}>
            <h2>{recipe.name}</h2>
            {recipe.tags 
            ? recipe.tags.map((tag) => (
                    <p key={tag} className="tag">{tag}</p>
                ))
            : <p>No tags</p>
            }
        </Link>
    )
}