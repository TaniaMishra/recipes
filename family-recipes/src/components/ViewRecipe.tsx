/* eslint-disable react-hooks/set-state-in-effect */
import '../styles/ViewRecipe.css'
import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { useRecipe } from '../context/RecipeContext';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';

export default function ViewRecipe() {
    const nav = useNavigate();
    const { recipeID } = useParams();
    const { user } = useAuth();
    const { allRecipes, getAllRecipes } = useRecipe();

    const [recipe, setRecipe] = useState<Recipe>();

    useEffect(() => {
        if (!recipeID) {
            nav('/recipes');
            return;
        }
        if (allRecipes.length === 0) {
            getAllRecipes();
            return;
        }
        const rid = parseInt(recipeID);
        const rec = allRecipes.find((r) => r.recipe_id === rid);
        if (!rec) return;
        setRecipe(rec);
    }, [recipeID, allRecipes, getAllRecipes]);

    const navToEdit = () => {
        nav(`/edit-recipe/${recipeID}`);
    }

    return (
        <>
            {recipe ?
                (<div className='recipe'>
                    <div className='recipe_heading'>
                        <h1>{recipe.name}</h1>
                        {recipe.ver ? <p>Version: {recipe.ver}</p> : <></>}
                    </div>
                    <div className='recipe_info'>
                        <ul className='tag_lst'>
                            {recipe.tags?.map((tag, i) => (
                                <li key={tag.tag_id} className="tag">{i >= 1 ? ", " : ""}{tag.desc}</li>
                            ))}
                        </ul>
                        {recipe.key_proportions ? <p>Key Proportions: {recipe.key_proportions}</p> : <></>}
                        {recipe.servings && recipe.servings !== 0 ? <p>This recipe makes {recipe.servings} servings.</p> : <></>}
                    </div>
                    <div className='body_box'>
                        <ol>
                            {recipe.body.map((step, i) => (
                                step ? <li key={i}>{step}</li> : <></>
                            ))}
                        </ol>
                    </div>
                    {user && recipe.author === user.id ? <button className='edit_btn' onClick={navToEdit}>Edit Recipe</button> : <></>}
                </div>)
                : (<p>Error loading recipe</p>)
            }
        </>
    )
}
