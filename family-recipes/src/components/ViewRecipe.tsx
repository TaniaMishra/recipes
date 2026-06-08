import { useState } from 'react'
import '../styles/ViewRecipe.css'
import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useParams } from 'react-router-dom';


export default function ViewRecipe() {
    const { recipeID } = useParams();

    const [recipe, setRecipe] = useState<Recipe>();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchRecipe() {
            setLoading(true);
            const { data, error } = await supabase
                .from("recipes")
                .select("*")
                .eq("recipe_id", recipeID)
                .single();
            if (error) {
                console.log("ERROR FETCHING RECIPE ID", recipeID, error)
            } else if (data) {
                setRecipe(data as Recipe)
            }
            setLoading(false)
        }
        fetchRecipe();
    }, [recipeID]);

    return (
        <>
            {loading ?
                (<p>Loading recipe...</p>)
                : recipe ?
                    (<div className='recipe'>
                        <div className='recipe_heading'>
                            <h1>{recipe.name}</h1>
                            <p>{recipe.tags}</p>
                            <p>{recipe.bm1}, {recipe.bm2}, {recipe.bm3}</p>
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
