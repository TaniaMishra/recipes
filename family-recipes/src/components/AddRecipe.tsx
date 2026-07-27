import React, { useEffect, useState } from 'react'
import '../styles/AddRecipe.css'
import TagBox from './TagBox';
import { useNavigate } from "react-router-dom";
import { useRecipe } from '../context/RecipeContext';
import { useAuth } from '../context/useAuth';
import { useKitchen } from '../context/KitchenContext';
import ReviewIngredients from './ReviewIngredients';

// TODO: substitutions

// TODO: how to handle duplicate items in different categories?
type Ingredient = {
    item: string;
    item_id: number;
    must: boolean;
    sub: string;
}

export default function AddRecipe() {
    const nav = useNavigate();
    const { validateRecipe, addRecipeDB } = useRecipe();
    const { user } = useAuth();
    const { allItems, fetchAllitems } = useKitchen();

    const [name, setName] = useState<string>("");
    const [ver, setVer] = useState<string>("");
    const [body, setBody] = useState<string[]>([]);
    const [keyProps, setKeyProps] = useState<string>("");
    const [svngs, setSvngs] = useState<number>(0);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const [stepsIndex, setStepsIndex] = useState<number>(0);
    const stepsMaxIndex = 30;

    const [tryAgain, setTryAgain] = useState<boolean>(false);

    
    const [reviewIngModal, setReviewIngModal] = useState<boolean>(false);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);

    useEffect(() => {
        if (allItems.length === 0) fetchAllitems();
    }, []);

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

    // TODO: parse from key proportions
    // TODO: remove duplicate items
    // TODO: handle duplicate items in different categories
    const parseIngredients = () => {
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
        console.log(ings);
        setIngredients([...ings]);
    }

    const handleReview = () => {
        if (!validateRecipe(name, body)) {
            console.log("RECIPE INVALID, CANNOT PARSE");
            setTryAgain(true);
            return;
        }
        parseIngredients();
        setReviewIngModal(true);
        setTryAgain(false);
    }

    const insertRecipe = async() => {
        if (!user) return false;
        const formatted_tags = selectedTags.map((tag) => (
            { desc: tag }
        ));
        const formatted_subs = ingredients.filter((ing) => ing.sub.length > 0).map((ing) => (
            { ingredient: ing.item_id, sub: ing.sub }
        ))
        const formatted_musts = ingredients.filter((ing) => ing.must).map((ing) => ing.item_id);
        const result = await addRecipeDB({
            recipe_id: -55,
            name: name,
            ver: ver,
            body: body,
            key_proportions: keyProps || "",
            must_items: formatted_musts,
            servings: svngs || 0,
            tags: formatted_tags,
            subs: formatted_subs,
            author: user.id
        });
        return result;
    }

    const handleSubmitOne = async() => {
        if (!validateRecipe(name, body)) {
            console.log("RECIPE INVALID, DID NOT INSERT");
            setTryAgain(true);
            return;
        }
        const result = await insertRecipe();
        if (!result) {
            console.log("ERROR IN INSERTING RECIPE");
            setTryAgain(true);
            return;
        }
        nav('/recipes');
    }
    const handleSubmitMore = async() => {
        if (!validateRecipe(name, body)) {
            console.log("RECIPE INVALID, DID NOT INSERT");
            setTryAgain(true);
            return;
        }
        const result = await insertRecipe();
        if (!result) {
            console.log("ERROR IN INSERTING RECIPE");
            setTryAgain(true);
            return;
        }
        setName("");
        setBody([]);
        setVer("");
        setKeyProps("");
        setSelectedTags([]);
        setSvngs(0);
        setStepsIndex(0);
        setIngredients([]);
        setTryAgain(false);
        setReviewIngModal(false);
    }

  return (
    <>
        <div className="add_card">
            <h1>Add Recipe</h1>
            <div className='add_form'>
                <div className='add_form_section'>
                    <p className='add_form_title'>Recipe Name</p>
                    <input type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Recipe Name"
                        className="add_text_input"
                    />
                </div>
                <div className='add_form_section'>
                    <p className='add_form_title'>Version</p>
                    <input type="text"
                        value={ver}
                        onChange={(e) => setVer(e.target.value)}
                        placeholder="Version"
                        className="add_text_input"
                    />
                </div>
                <div className='add_form_section'>
                    <p className='add_form_title'>Key Proportions</p>
                    <input type="text"
                        value={keyProps}
                        onChange={(e) => setKeyProps(e.target.value)}
                        placeholder="Key Proportions"
                        className="add_text_input"
                    />
                </div>
                <div className='add_form_section'>
                    <p className='add_form_title'>Servings</p>
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
                {reviewIngModal ? <ReviewIngredients ingredients={ingredients} setIngredients={setIngredients}/> : <></>}
                <div className='submit_section'>
                    {reviewIngModal
                        ? (<div>
                            <button onClick={handleSubmitOne} className='form_btn'>Submit Recipe</button>
                            <button onClick={handleSubmitMore} className='form_btn'>Submit Recipe & Add Another</button>
                        </div>)
                        : <button onClick={handleReview} className='form_btn'>Review Ingredients</button>
                    }
                    
                </div>
                {tryAgain ?
                    <p>The recipe is unable to be added. A name and at least 1 non-empty step is required to add a recipe. Make sure you have the required elements before trying again.</p>
                    : <></>
                }
            </div>
        </div>
    </>
  )
}
