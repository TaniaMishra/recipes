import '../styles/ViewRecipe.css'
import { useEffect } from "react";
import { useParams } from 'react-router-dom';
import { useRecipe } from '../context/RecipeContext';

export default function ViewRecipe() {
    const { recipeID } = useParams();
    const { allRecipes, getAllRecipes } = useRecipe();

    useEffect(() => {
        if (allRecipes.length === 0) getAllRecipes();
    }, []);

    if (!recipeID) return;
    const rid = parseInt(recipeID);
    const recipe = allRecipes.find((r) => r.recipe_id === rid);

    return (
        <>
            {recipe ?
                (<div className='recipe'>
                    <div className='recipe_heading'>
                        <h1>{recipe.name}</h1>
                        <p>{recipe.tags}</p>
                    </div>
                    <div className='whitespace-pre-line'>
                        <p>{recipe.body}</p>
                    </div>
                </div>)
                : (<p>Error loading recipe</p>)
            }
        </>
    )
}
