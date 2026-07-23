import React, { createContext, useContext, useState } from "react";
import { useAuth } from "./useAuth";
import { supabase } from "../lib/supabase";

type RecipeContextType = {
    allRecipes: Recipe[];
    getAllRecipes: () => Promise<void>;
    addRecipeDB: (value: Recipe) => boolean;
    rmRecipeDB: (value: Recipe) => Promise<void>;
    editRecipeDB: (value: Recipe) => Promise<void>;
}

const RecipeContext = createContext<RecipeContextType | null>(null);


export function RecipeProvider({ children } : { children: React.ReactNode; }) {
    const { user } = useAuth();
    const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);

    async function getAllRecipes() {
        // get all recipes, return null if select fails
        const { data, error } = await supabase
            .from("recipes")
            .select(`
                *,
                tags (desc)    
            `);
        if (error) throw Error("Error occured while fetching all recipes and associated tags");
        setAllRecipes(data as Recipe[]);
    }

    async function addRecipeDB(newRecipe: Recipe) {
        // insert recipe
        const { data, error } = await supabase
            .from("recipes")
            .insert({
                name: newRecipe.name,
                ver: newRecipe.ver,
                body: newRecipe.body,
                key_proportions: newRecipe.key_proportions,
                must_items: newRecipe.must_items,
                servings: newRecipe.servings,
                author: newRecipe.author
            })
            .select()
            .single();
        if (error || !data) return false;
        // insert tags (if there are any)
        if (newRecipe.tags) {
            const rid = data.recipe_id;
            const tagRows = newRecipe.tags.map((tag) => ({
                recipe_id: rid,
                desc: tag
            }));
            const { error: tagError } = await supabase
                .from("tags")
                .insert(tagRows);
            if (tagError) return false;
        }
        setAllRecipes((prev) => [...prev, newRecipe]);
        return true;
    }

    async function rmRecipeDB(rmRecipe: Recipe) {
        if (!user) return;
        const { error } = await supabase
            .from("recipes")
            .delete()
            .eq('recipe_id', rmRecipe.recipe_id);
        if (error) throw Error("Error deleting recipe");
        setAllRecipes((prev) => prev.filter((rec) => rec.recipe_id !== rmRecipe.recipe_id));
    }

    async function editRecipeDB(newRecipe: Recipe) {
        if (!user) return;
        const { error } = await supabase
            .from("recipes")
            .update({
                name: newRecipe.name,
                ver: newRecipe.ver,
                body: newRecipe.body,
                key_proportions: newRecipe.key_proportions,
                must_items: newRecipe.must_items,
                servings: newRecipe.servings,
                author: user.id
            })
            .eq('recipe_id', newRecipe.recipe_id);
        if (error) throw Error("Error updating recipe");
        // remove old version of recipe, add new version
        const unchangedRecipes = allRecipes.filter((rec) => rec.recipe_id !== newRecipe.recipe_id);
        setAllRecipes([...unchangedRecipes, newRecipe]);
    }

    return (
        <RecipeContext.Provider
            value = {{
                allRecipes,
                getAllRecipes,
                addRecipeDB,
                rmRecipeDB,
                editRecipeDB
            }}
        >
            {children}
        </RecipeContext.Provider>
    )
}

export function useRecipe() {
    const context = useContext(RecipeContext);

    if (!context) {
        throw new Error("useRecipe must be used inside RecipeProvider");
    }

    return context;
}