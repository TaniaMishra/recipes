import React, { createContext, useContext, useState } from "react";
import { useAuth } from "./useAuth";
import { supabase } from "../lib/supabase";

type RecipeContextType = {
    allRecipes: Recipe[];
    getAllRecipes: () => Promise<void>;
    validateRecipe: (arg0: string, arg1: string[]) => boolean;
    addRecipeDB: (value: Recipe) => Promise<boolean>;
    rmRecipeDB: (value: Recipe) => Promise<void>;
    editRecipeDB: (value: Recipe) => Promise<boolean>;
}

const RecipeContext = createContext<RecipeContextType | null>(null);


export function RecipeProvider({ children } : { children: React.ReactNode; }) {
    const { user } = useAuth();
    const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);

    function validateRecipe(name: string, body: string[]) {
        // author (user logged in)
        if (!user) return false;
        // name (not null)
        if (name.length === 0) return false;
        // body (at least one step that is not blank)
        if (body.length === 0 || !body.some((stp) => stp && stp.length > 0)) return false;
        // recipe id & date created (automatically added in supabase)
        return true;
    }

    async function getAllRecipes() {
        // get all recipes, return null if select fails
        const { data, error } = await supabase
            .from("recipes")
            .select(`
                *,
                tags (tag_id, recipe_id, desc)    
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
        const rid = data.recipe_id;
        const updatedRecipe = newRecipe;
        updatedRecipe.recipe_id = rid;
        // insert tags (if there are any)
        if (newRecipe.tags) {
            const tagRows = newRecipe.tags.map((tag) => ({
                recipe_id: rid,
                desc: tag.desc
            }));
            const { error: tagError } = await supabase
                .from("tags")
                .insert(tagRows)
                .select();
            if (tagError) return false;
        }
        // insert subs (if there are any)
        if (newRecipe.subs) {
            const subRows = newRecipe.subs.map((subItm) => ({
                recipe_id: rid,
                ingredient: subItm.ingredient,
                sub: subItm.sub
            }));
            console.log("sub rows: ", subRows);
            const { error: subError } = await supabase
                .from("substitutions")
                .insert(subRows)
                .select();
            if (subError) {
                console.log("error with adding subs")
                return false;
            }
        }
        setAllRecipes((prev) => [...prev, updatedRecipe]);
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
        console.log("new recipe: ", newRecipe);
        const { data: existing } = await supabase
            .from("recipes")
            .select("recipe_id, author")
            .eq("recipe_id", newRecipe.recipe_id);
            console.log(existing);

        const { data, error } = await supabase
            .from("recipes")
            .update({
                name: newRecipe.name,
                ver: newRecipe.ver,
                body: newRecipe.body,
                key_proportions: newRecipe.key_proportions,
                must_items: newRecipe.must_items,
                servings: newRecipe.servings,
            })
            .eq('recipe_id', newRecipe.recipe_id)
            .select();
        if (error || !data) {
            console.log("error", error);
            return false;
        }
        console.log("data from update", data);
        // TODO: handle tag updates
        // remove old version of recipe, add new version
        const unchangedRecipes = allRecipes.filter((rec) => rec.recipe_id !== newRecipe.recipe_id);
        setAllRecipes([...unchangedRecipes, newRecipe]);
        console.log("returning true");
        return true;
    }

    return (
        <RecipeContext.Provider
            value = {{
                allRecipes,
                getAllRecipes,
                validateRecipe,
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