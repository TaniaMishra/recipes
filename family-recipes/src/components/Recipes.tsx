import '../styles/Recipes.css'
import { RecipeCard } from './RecipeCard';
import { useEffect } from "react";
import { useRecipe } from '../context/RecipeContext';


export default function Recipes() {
    const { getAllRecipes, allRecipes } = useRecipe();

    useEffect(() => {
        getAllRecipes();
    }, []);

  return (
    <>
        <div className="recipes_heading">
            <h1>Londhe Family Recipes</h1>
        </div>
        <a href='/add-recipe' className='add_link'>
            <div className='add_button'>
                Add recipe
            </div>
        </a>
        <div className='recipe_list'>
            {allRecipes.length > 0 ?
                allRecipes.map((recipe) => (
                    <RecipeCard recipe={recipe} key={recipe.recipe_id} />
                ))
                : (<p>No recipes in database</p>)
            }
        </div>
    </>
  )
}
