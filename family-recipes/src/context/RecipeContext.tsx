import React, { createContext, useContext, useState } from "react";
import { useAuth } from "./useAuth";
import { supabase } from "../lib/supabase";
import { useKitchen } from "./KitchenContext";

type RecipeContextType = {
    allRecipes: Recipe[];
    getAllRecipes: () => Promise<void>;
    validateRecipe: (arg0: string, arg1: string[]) => boolean;
    addRecipeDB: (value: Recipe) => Promise<boolean>;
    rmRecipeDB: (arg0: number, arg1: string) => Promise<boolean>;
    editRecipeDB: (value: Recipe) => Promise<boolean>;
    parseIngredientsFromRecipe: (arg0: string, arg1: string[]) => Ingredient[];
}

const RecipeContext = createContext<RecipeContextType | null>(null);


export function RecipeProvider({ children } : { children: React.ReactNode; }) {
    const { user } = useAuth();
    const { allItems } = useKitchen();
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
                tags (tag_id, recipe_id, desc),
                substitutions (sub_id, recipe_id, ingredient, sub)
            `);
        if (error) throw Error("Error occured while fetching all recipes and associated tags");
        setAllRecipes(data as Recipe[]);
    }

    // Tag helper functions
    async function addTags(tags_to_add: Tag[], rid: number) {
        const tagRows = tags_to_add.map((tg) => ({
            recipe_id: rid,
            desc: tg.desc
        }));
        const { error: tgAddError } = await supabase
            .from("tags")
            .insert(tagRows)
            .select();
        if (tgAddError) return false;
        return true;
    }
    async function removeTags(tags_to_remove: Tag[], rid: number) {
        const ids_to_remove = tags_to_remove.map((tg) => tg.tag_id);
        const { error: tgRmError } = await supabase
            .from("tags")
            .delete()
            .eq('recipe_id', rid)
            .in("tag_id", ids_to_remove);
        if (tgRmError) return false;
        return true;
    }

    // Substitution helper functions
    async function addSubs(subs_to_add: Sub[], rid: number) {
        const subRows = subs_to_add.map((s) => ({
            recipe_id: rid,
            ingredient: s.ingredient,
            sub: s.sub
        }));
        const { error: subAddError } = await supabase
            .from("substitutions")
            .insert(subRows)
            .select();
        if (subAddError) return false;
        return true;
    }
    async function removeSubs(subs_to_remove: Sub[], rid: number) {
        const ids_to_remove = subs_to_remove.map((s) => s.sub_id);
        const { error: subRmError } = await supabase
            .from("substitutions")
            .delete()
            .eq('recipe_id', rid)
            .in("sub_id", ids_to_remove);
        if (subRmError) return false;
        return true;
    }
    async function updateSubs(subs_to_update: Sub[]) {
        for (const s of subs_to_update) {
            const { error: subUdError } = await supabase
                .from("substitutions")
                .update({
                    sub: s.sub
                })
                .eq("sub_id", s.sub_id);
            if (subUdError) return false;
        }
        return true;
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
                gen_items: newRecipe.gen_items,
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
            const result = await addTags(newRecipe.tags, rid);
            if (!result) return false;
        }
        // insert subs (if there are any)
        if (newRecipe.substitutions) {
            const subRows = newRecipe.substitutions.map((subItm) => ({
                recipe_id: rid,
                ingredient: subItm.ingredient,
                sub: subItm.sub
            }));
            const { error: subError } = await supabase
                .from("substitutions")
                .insert(subRows)
                .select();
            if (subError) return false;
        }
        setAllRecipes((prev) => [...prev, updatedRecipe]);
        return true;
    }

    async function rmRecipeDB(rmRecipeID: number, rmRecipeAuthor: string) {
        if (!user) return false;
        if (user.id !== rmRecipeAuthor) return false;
        const { error } = await supabase
            .from("recipes")
            .delete()
            .eq('recipe_id', rmRecipeID);
        if (error) return false;
        setAllRecipes((prev) => prev.filter((rec) => rec.recipe_id !== rmRecipeID));
        return true;
    }

    async function editRecipeDB(newRecipe: Recipe) {
        // update recipe
        const { data, error } = await supabase
            .from("recipes")
            .update({
                name: newRecipe.name,
                ver: newRecipe.ver,
                body: newRecipe.body,
                key_proportions: newRecipe.key_proportions,
                must_items: newRecipe.must_items,
                gen_items: newRecipe.gen_items,
                servings: newRecipe.servings,
            })
            .eq('recipe_id', newRecipe.recipe_id)
            .select();
        if (error || !data) return false;
        // update tags (if changed)
        const { data: tags, error: tagsError } = await supabase
            .from("tags")
            .select("tag_id, recipe_id, desc")
            .eq("recipe_id", newRecipe.recipe_id);
        if (tagsError || !tags) return false;
        // remove and add tags by comparing descriptions
        const oldTagDescs = new Set(tags.map((t) => t.desc));
        const newTagDescs = new Set(newRecipe.tags?.map((t) => t.desc));
        const tagsToRemove = tags.filter((oldTag) => !newTagDescs.has(oldTag.desc));
        const tagsToAdd = newRecipe.tags?.filter((newTag) => !oldTagDescs.has(newTag.desc));
        if (tagsToRemove.length > 0) {
            const result = await removeTags(tagsToRemove, newRecipe.recipe_id);
            if (!result) return false;
        }
        if (tagsToAdd && tagsToAdd.length > 0) {
            const result = await addTags(tagsToAdd, newRecipe.recipe_id);
            if (!result) return false;
        }
        // update subs (if changed)
        const { data: subs, error: subsError } = await supabase
            .from("substitutions")
            .select("sub_id, recipe_id, ingredient, sub")
            .eq("recipe_id", newRecipe.recipe_id);
        if (subsError || !subs) return false;
        // remove, add, and update subs by comparing ingredient id and substitute description
        const oldSubsMap = new Map(subs.map((s) => [s.ingredient, s]));
        const newSubsMap = new Map(newRecipe.substitutions?.map((s) => [s.ingredient, s]));
        const subsToRemove = subs.filter((oldSub) => !newSubsMap.has(oldSub.ingredient));
        const subsToAdd = newRecipe.substitutions?.filter((newSub) => !oldSubsMap.has(newSub.ingredient));
        const subsToUpdate = newRecipe.substitutions?.filter((newSub) => {
            const oldSub = oldSubsMap.get(newSub.ingredient);
            return oldSub && oldSub.sub !== newSub.sub;
        }).map((newSub) => {
            const oldSub = oldSubsMap.get(newSub.ingredient);
            return {
                sub_id: oldSub?.sub_id,
                recipe_id: oldSub?.recipe_id,
                ingredient: oldSub?.ingredient,
                sub: newSub.sub
            };
        });
        if (subsToRemove.length > 0) {
            const result = await removeSubs(subsToRemove, newRecipe.recipe_id);
            if (!result) return false;
        }
        if (subsToAdd && subsToAdd.length > 0) {
            const result = await addSubs(subsToAdd, newRecipe.recipe_id);
            if (!result) return false;
        }
        if (subsToUpdate && subsToUpdate.length > 0) {
            const result = await updateSubs(subsToUpdate);
            if (!result) return false;
        }                
        // remove old version of recipe, add new version
        const unchangedRecipes = allRecipes.filter((rec) => rec.recipe_id !== newRecipe.recipe_id);
        setAllRecipes([...unchangedRecipes, newRecipe]);
        return true;
    }

    // TODO: remove duplicate items
    // TODO: handle duplicate items in different categories
    // TODO: BUG: "rice flour" ends up being put in as a "rice" ingredient and "rice flour" ingredient
    // TODO: how to handle duplicate items in different categories?
    // (ex. bread in freezer vs bread in pantry - both show up as ingredients)
    const parseIngredientsFromRecipe = (keyProps: string, body: string[]) => {
        const ings = [] as Ingredient[];
        const consolidatedBody = keyProps + " " + body.join(" ").toLowerCase();
        allItems.forEach((itm) => {
            if (consolidatedBody.includes(itm.item.toLowerCase())) {
                ings.push({
                    item: itm.item,
                    item_id: itm.item_id,
                    must: false,
                    sub: ""
                })
            }
        });
        return ings;
    }


    return (
        <RecipeContext.Provider
            value = {{
                allRecipes,
                getAllRecipes,
                validateRecipe,
                addRecipeDB,
                rmRecipeDB,
                editRecipeDB,
                parseIngredientsFromRecipe
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