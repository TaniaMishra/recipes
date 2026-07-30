/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react'
import '../styles/EditRecipe.css'
import TagBox from './TagBox';
import { useNavigate } from "react-router-dom";
import { useRecipe } from '../context/RecipeContext';
import { useAuth } from '../context/useAuth';
import { useParams } from 'react-router-dom';
import { useKitchen } from '../context/KitchenContext';
import ReviewIngredients from './ReviewIngredients';

export default function EditRecipe() {
    const { recipeID } = useParams();
    const { user } = useAuth();
    const nav = useNavigate();
    const { allRecipes, getAllRecipes, validateRecipe, editRecipeDB, rmRecipeDB, parseIngredientsFromRecipe } = useRecipe();
    const { allItems, fetchAllitems } = useKitchen();

    const [author, setAuthor] = useState<string>("");
    const [id, setId] = useState<number>(-1);

    const [name, setName] = useState<string>("");
    const [ver, setVer] = useState<string>("");
    const [body, setBody] = useState<string[]>([]);
    const [keyProps, setKeyProps] = useState<string>("");
    const [svngs, setSvngs] = useState<number>(0);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);


    const [stepsIndex, setStepsIndex] = useState<number>(0);
    const stepsMaxIndex = 30;

    const [tryAgain, setTryAgain] = useState<boolean>(false);
    
    useEffect(() => {
        if (allItems.length === 0) fetchAllitems();
    }, []);

    useEffect(() => {
        if (!recipeID) {
            nav('/recipes');
            return;
        }
        if (allRecipes.length === 0) {
            getAllRecipes();
            return;
        }
        if (allItems.length === 0) {
            fetchAllitems();
            return;
        }

        const rid = parseInt(recipeID);
        const recipe = allRecipes.find((r) => r.recipe_id === rid);
        if (!recipe) return;

        setAuthor(recipe.author);
        setId(recipe.recipe_id);
        setName(recipe.name);
        setVer(recipe.ver);
        setBody(recipe.body);
        setKeyProps(recipe.key_proportions);
        setSvngs(recipe.servings);
        setSelectedTags(recipe.tags?.map((t) => t.desc) ?? []);
        setStepsIndex(recipe.body.length - 1);
        
        const selected_musts = allItems.filter((itm) => recipe.must_items.includes(itm.item_id));
        const formatted_musts = selected_musts.map((itm) => ({
            item: itm.item,
            item_id: itm.item_id,
            must: true,
            sub: recipe.substitutions?.find((sb) => (sb.recipe_id === recipe.recipe_id) && (sb.ingredient === itm.item_id))?.sub || ""
        }))
        const selected_gens = allItems.filter((itm) => recipe.gen_items.includes(itm.item_id));
        const formatted_gens = selected_gens.map((itm) => ({
            item: itm.item,
            item_id: itm.item_id,
            must: false,
            sub: recipe.substitutions?.find((sb) => (sb.recipe_id === recipe.recipe_id) && (sb.ingredient === itm.item_id))?.sub || ""
        }))
        setIngredients([...formatted_musts, ...formatted_gens]);
    }, [recipeID, allRecipes, getAllRecipes, allItems, fetchAllitems]);


    const handleBodyChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const updatedBody = [...body];
        updatedBody[index] = e.target.value;
        setBody([...updatedBody]);
    }
    const handleStepPlus = () => {
        console.log(stepsIndex);
        if (stepsIndex < stepsMaxIndex) {
            setStepsIndex((prev) => (prev + 1));
        }
    }

    const reParseIngredients = () => {
        const ings = parseIngredientsFromRecipe(keyProps, body);
        return ings;
    }

    const updateRecipe = async() => {
        if (!user || user.id !== author) return false;
        const formatted_tags = selectedTags.map((tag) => (
            { tag_id: -55, recipe_id: -55, desc: tag }
        ));
        const formatted_subs = ingredients.filter((ing) => ing.sub.length > 0).map((ing) => (
            { sub_id: -55, recipe_id: -55, ingredient: ing.item_id, sub: ing.sub }
        ))
        const formatted_musts = ingredients.filter((ing) => ing.must).map((ing) => ing.item_id);
        const formatted_gen_items = ingredients.filter((ing) => !ing.must).map((ing) => ing.item_id);
        const result = await editRecipeDB({
            recipe_id: id,
            name: name,
            ver: ver,
            body: body,
            key_proportions: keyProps || "",
            must_items: formatted_musts,
            gen_items: formatted_gen_items,
            servings: svngs || 0,
            tags: formatted_tags,
            substitutions: formatted_subs,
            author: user.id
        });
        return result;
    }

    const handleSubmit = async() => {
        if (!validateRecipe(name, body)) {
            console.log("RECIPE INVALID, DID NOT UPDATE");
            setTryAgain(true);
            return;
        }
        const result = await updateRecipe();
        if (!result) {
            console.log("ERROR IN UPDATING RECIPE");
            setTryAgain(true);
            return;
        }
        nav(`/recipes/${id}`);
    }

    const handleDelete = async() => {
        const confirmed = window.confirm("Are you sure you want to delete this recipe? This action cannot be undone.");
        if (!confirmed) return;
        
        const result = await rmRecipeDB(id, author);
        if (result) nav("/recipes");
        else console.log("ERROR IN DELETING RECIPE");
    }

  return (
    <>
        <div className="edit_card">
            <h1>Edit Recipe</h1>
            <div className='edit_form'>
                <div className='edit_form_section'>
                    <p className='edit_form_title'>Recipe Name</p>
                    <input type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Recipe Name"
                        className="edit_text_input"
                    />
                </div>
                <div className='edit_form_section'>
                    <p className='edit_form_title'>Version</p>
                    <input type="text"
                        value={ver}
                        onChange={(e) => setVer(e.target.value)}
                        placeholder="Version"
                        className="edit_text_input"
                    />
                </div>
                <div className='edit_form_section'>
                    <p className='edit_form_title'>Key Proportions</p>
                    <input type="text"
                        value={keyProps}
                        onChange={(e) => setKeyProps(e.target.value)}
                        placeholder="Key Proportions"
                        className="edit_text_input"
                    />
                </div>
                <div className='edit_form_section'>
                    <p className='edit_form_title'>Servings</p>
                    <div className='servings_section'>
                        <p>This recipe makes</p>
                        <input type="number"
                            value={svngs}
                            onChange={(e) => setSvngs(parseFloat(e.target.value))}
                            placeholder="Servings"
                            className="number_input"
                        />
                        <p>servings.</p>
                    </div>
                </div>
                <div className='steps_section'>
                    <p className='steps_title'>Recipe Steps</p>
                    {stepsIndex <= stepsMaxIndex ?
                        (Array.from({ length: (stepsIndex+1) }).map((_, i) => 
                            (<div className='step_box' key={i}>
                                <input type="text"
                                    value={body[i] || ""}
                                    onChange={(e) => handleBodyChange(e, i)}
                                    placeholder="Enter step instructions"
                                    className="step_input"
                                />
                                {i === stepsMaxIndex ?
                                    <></>
                                    : <button onClick={handleStepPlus} className='step_plus'>+</button>
                                }
                            </div>)))
                        : <p></p>
                    }
                </div>
                <div className='tags_section'>
                    <p className='tags_title'>Tags</p>
                    <TagBox 
                        selectedTags = {selectedTags}
                        setSelectedTags = {setSelectedTags}
                    />
                </div>
                <ReviewIngredients ingredients={ingredients} setIngredients={setIngredients} reParse={reParseIngredients}/>
                <div className='submit_section'>
                    <button onClick={handleSubmit} className='form_btn'>Update Recipe</button>
                    <button onClick={handleDelete} className='form_btn'>Delete Recipe</button>
                </div>
                {tryAgain ?
                    <p>The recipe is unable to be updated. A name and at least 1 non-empty step is required to add a recipe. Make sure you have the required elements before trying again.</p>
                    : <></>
                }
            </div>
        </div>
    </>
  )
}
