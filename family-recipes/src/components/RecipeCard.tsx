import "../styles/RecipeCard.css"

interface RecipeCardProps {
    recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
    return (
        <div className='recipe_card'>
            <h2>{recipe.name}</h2>
            {recipe.tags 
            ? recipe.tags.map((tag) => (
                    <p key={tag} className="tag">{tag}</p>
                ))
            : <p>No tags</p>
            }
        </div>
    )
}