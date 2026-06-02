import { useState } from 'react'
import '../styles/Home.css'
import { SearchBox } from './SearchBox'
import { RecipeCard } from './RecipeCard';
import { useEffect } from "react";
import { supabase } from "../lib/supabase";
// import homeIcon from "../assets/home-icon.jpg"


export default function Home() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
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


    const handleSearch = (query: string) => {
        setSearchQuery(query)
    }

    // TO DO: advanced searches
    // currently filtering based on the search words being part of the name of the recipe
    const filteredRecipes = recipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <>
        <div className="search_heading">
            <h1>What's for dinner?</h1>
        </div>
        <div className='search_box'>
            <SearchBox onSearch={handleSearch} placeholder='Search recipes...'/>
        </div>
        <div className='filter_box'>
            {/* TO DO: get filters from user profile */}
            {/* TO DO: use map function to display filter options */}
            {/* TO DO: search handler for using filters */}
            {/* <img src={homeIcon} className='home_icon'/> */}
            <p className='filter'>in my kitchen</p>
            <p className='separator'>&middot;</p>
            <p className='filter'>filter placeholder</p>
            <p className='separator'>&middot;</p>
            <p className='filter'>filter placeholder</p>
        </div>
        <div className='recipe_results'>
            {loading ? 
                (<p>Loading recipes...</p>)
                : filteredRecipes.length > 0
                    ? filteredRecipes.map((recipe) => (
                        <RecipeCard recipe={recipe}  />
                    ))
                    : (<p>No recipes found matching "{searchQuery}"</p>)
            }
        </div>
    </>
  )
}
