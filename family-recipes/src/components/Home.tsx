import { useState, useEffect } from 'react'
import '../styles/Home.css'
import SearchBox from './SearchBox'
import SearchRecipeResults from './SearchRecipeResults';
import { useRecipe } from '../context/RecipeContext';

export default function Home() {
    const {allRecipes, getAllRecipes} = useRecipe();
        
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filterPreset, setFilterPreset] = useState<number>(-1);
    const [showResults, setShowResults] = useState<boolean>(false);

    useEffect(() => {
        if (allRecipes.length === 0) getAllRecipes();
    }, [allRecipes, getAllRecipes]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query.trim() === "") {
            setShowResults(false);
        } else {
            setShowResults(true)
        }
    }

    const handleFilter = (preset: number) => {
        setFilterPreset(preset);
        setShowResults(true)
    }

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
        <SearchRecipeResults query={searchQuery} showResults={showResults}/>
    </>
  )
}
