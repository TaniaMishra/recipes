import React, { useState } from 'react'
import '../styles/AddRecipe.css'
import TagBox from './TagBox';
import { useNavigate } from "react-router-dom";
import { useRecipe } from '../context/RecipeContext';
import { useAuth } from '../context/useAuth';

export default function AddRecipe() {
    const nav = useNavigate();
    const { addRecipeDB } = useRecipe();
    const { user } = useAuth();

    const [name, setName] = useState<string>("");
    const [ver, setVer] = useState<string>("");
    const [musts, setMusts] = useState<number[]>([]);
    const [body, setBody] = useState<string[]>([]);
    const [keyProps, setKeyProps] = useState<string>("");
    const [svngs, setSvngs] = useState<number>(0);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const [stepsIndex, setStepsIndex] = useState<number>(0);
    const stepsMaxIndex = 30;

    const handleBodyChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const updatedBody = [...body];
        updatedBody[index] = e.target.value;
        setBody(updatedBody);
    }
    const handleStepPlus = () => {
        console.log(stepsIndex);
        if (stepsIndex < stepsMaxIndex) {
            setStepsIndex((prev) => (prev + 1));
        }
    }

    const validateRecipe = () => {
        // author (user logged in)
        if (!user) return false;
        // name (not null)
        if (name.length === 0) return false;
        // body (at least one step that is not blank)
        if (body.length === 0 || !body.some((stp) => stp.length !== 0)) return false;
        // recipe id & date created (automatically added in supabase)
        return true;
    }

    const insertRecipe = async() => {
        console.log("submitted");
        if (!user) return;
        const result = addRecipeDB({
            recipe_id: -55,
            name: name,
            ver: ver,
            body: body,
            key_proportions: keyProps || "",
            must_items: musts,
            servings: svngs || 0,
            author: user.id
        });
        return result;
    }

    const handleSubmitOne = async() => {
        if (!validateRecipe()) {
            console.log("RECIPE INVALID, DID NOT INSERT");
            return;
        }
        const result = await insertRecipe();
        if (!result) {
            console.log("ERROR IN INSERTING RECIPE");
            return;
        }
        nav('/recipes');
    }
    const handleSubmitMore = async() => {
        if (!validateRecipe()) {
            console.log("RECIPE INVALID, DID NOT INSERT");
            return;
        }
        const result = await insertRecipe();
        if (!result) {
            console.log("ERROR IN INSERTING RECIPE");
            return;
        }
        setName("");
        setBody([]);
        setVer("");
        setKeyProps("");
        setMusts([]);
        setSelectedTags([]);
        setSvngs(0);
        setStepsIndex(0);
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
                                    value={body[i]}
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
                <div className='submit_section'>
                    <button onClick={handleSubmitOne} className='form_btn'>Submit Recipe</button>
                    <button onClick={handleSubmitMore} className='form_btn'>Submit Recipe & Add Another</button>
                </div>
            </div>
        </div>
    </>
  )
}
