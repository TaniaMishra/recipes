import { useState } from 'react'
import '../styles/Recipes.css'
import { RecipeCard } from './RecipeCard';
import { useEffect } from "react";
import { supabase } from "../lib/supabase";


export default function Recipes() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchRecipes() {
            setLoading(true);
            const { data, error } = await supabase
                .from("recipes")
                .select("*");
            if (error) {
                console.log("ERROR FETCHING RECIPES", error)
            } else if (data) {
                setRecipes(data as Recipe[])
            }
            setLoading(false)
        }
        fetchRecipes();
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
            {loading ? 
                (<p>Loading recipes...</p>)
                : recipes.length > 0
                    ? recipes.map((recipe) => (
                        <RecipeCard recipe={recipe}  />
                    ))
                    : (<p>No recipes in database"</p>)
            }
        </div>
    </>
  )
}
