import '../styles/SearchRecipeResults.css'
import { RecipeCard } from './RecipeCard';
import { useRecipe } from '../context/RecipeContext';

interface SearchRecipeResultsProps {
    query: string;
    showResults: boolean;
}

export default function SearchRecipeResults({ query, showResults }: SearchRecipeResultsProps) {
    const {allRecipes} = useRecipe();

    // TO DO: advanced searches
    // currently filtering based on the search words being part of the name of the recipe
    const filteredRecipes = allRecipes.filter((rec) =>
        rec.name.toLowerCase().includes(query.toLowerCase())
    );

  return (
    <div className='recipe_list'>
        {showResults ?
            (filteredRecipes.length > 0
                ? filteredRecipes.map((recipe) => (
                    <RecipeCard recipe={recipe}  />
                ))
                : (<p>No recipes found matching "{query}"</p>))
            : <p>Search or filter to view results</p>
        }
    </div>
  )
}
