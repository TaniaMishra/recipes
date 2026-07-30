import { useState, useEffect } from 'react'
import '../styles/Home.css'
import SearchBox from './SearchBox'
import SearchRecipeResults from './SearchRecipeResults';
import { useRecipe } from '../context/RecipeContext';
import { useAuth } from '../context/useAuth';

export default function Home() {
    const {user, userProfile} = useAuth();
    const {allRecipes, getAllRecipes} = useRecipe();
        
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filterSelection, setFilterSelection] = useState<string | null>(null);
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

    const handleFilter = (index: number) => {
        setFilterSelection(userProfile?.saved_filters[index] ?? null);
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
        {userProfile && userProfile.saved_filters
            ? <div className='filter_box'>
                {userProfile.saved_filters.map((filter, index) => (<>
                    {index > 0 ? <p className='separator'>&middot;</p> : <></>}
                    <p className='filter' key={index} onClick={() => handleFilter(index)}>{filter}</p>
                </>))}
                {/* <p className='filter'>in my kitchen</p>
                <p className='separator'>&middot;</p>
                <p className='filter'>filter placeholder</p>
                <p className='separator'>&middot;</p>
                <p className='filter'>filter placeholder</p> */}
            </div>
            : <></>
        }
        <SearchRecipeResults query={searchQuery} filter={filterSelection} showResults={showResults}/>
    </>
  )
}
