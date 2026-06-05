import React, { useState } from 'react'
import '../styles/AddRecipe.css'
// import { useEffect } from "react";
// import { supabase } from "../lib/supabase";
import TagBox from './TagBox';
import { supabase } from '../lib/supabase';

type BM = {
    msm: number,
    unit: string,
    svg: number
}

export default function AddRecipe() {
    const [name, setName] = useState<string>("");
    const [ver, setVer] = useState<string>("");
    const [bms, setBMs] = useState<BM[]>([
        {msm: 0, unit: "", svg: 0},
        {msm: 0, unit: "", svg: 0},
        {msm: 0, unit: "", svg: 0}
    ]);
    const [musts, setMusts] = useState<number[]>([]);
    const [body, setBody] = useState<string>("");
    const [tags, setTags] = useState<string[]>([]);

    const [bmIndex, setBMindex] = useState<number>(0);
    const bmMaxIndex = 2

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };
    const handleVerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVer(e.target.value);
    };
    const handleBMchange = (index: number, field: string, value: string | number) => {
        setBMs((prev) => (
            prev.map((item, i) => (
                i === index ?
                    {...item,
                        [field]: field === "msm" || field === "svg" ?
                            Number(value)
                            : value
                    }
                : item
            ))
        ));
    };
    const handleBMplus = () => {
        console.log(bmIndex);
        if (bmIndex < bmMaxIndex) {
            setBMindex((prev) => (prev + 1))
        }
    }
    // const handleBM1unit = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //     setBM1((prevState) => ({
    //         ...prevState,
    //         unit: e.target.value
    //     }));
    // };
    // const handleBM1svg = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //     setBM1((prevState) => ({
    //         ...prevState,
    //         svg: Number(e.target.value)
    //     }));
    // };
    const handleBodyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBody(e.target.value);
    }
    const handleSubmit = async() => {
        console.log("submitted");
        const { data, error } = await supabase
            .from("recipes")
            .insert({
                name: name,
                ver: ver,
                body: body
            })
            .select();
        if (error) {
            console.log("ERROR INSERTING RECIPE", error)
        } else if (data) {
            console.log("SUCCESS!")
        }
    }

    const measurements = [0, 0.25, 0.33, 0.5, 0.66, 0.75, 1, 1.25, 1.33, 1.5, 1.66, 1.75, 2, 2.25, 2.33, 2.5, 2.66, 2.75, 3];
    const units = ["cup", "tbsp"];

  return (
    <>
        <div className="add_card">
            <h1>Add Recipe</h1>
            <div className='add_form'>
                <input type="text"
                    value={name}
                    onChange={handleNameChange}
                    placeholder="Recipe Name"
                    className="add_text_input"
                />
                <input type="text"
                    value={ver}
                    onChange={handleVerChange}
                    placeholder="Version"
                    className="add_text_input"
                />
                {bmIndex <= bmMaxIndex ?
                    (Array.from({ length: (bmIndex+1) }).map((_, i) => 
                        (<div className='add_bm' key={i}>
                            <select className='add_dropdown' defaultValue="def" onChange={(e) => handleBMchange(0, 'msm', e.target.value)}>
                                <option value="def" disabled>Quantity</option>
                                {measurements.map((val, index) => (
                                    <option key={index} value={val}>{val}</option>
                                ))}
                            </select>
                            <select className='add_dropdown' defaultValue="def" onChange={(e) => handleBMchange(0, 'msm', e.target.value)}>
                                <option value="def" disabled>Unit</option>
                                {units.map((val, index) => (
                                    <option key={index} value={val}>{val}</option>
                                ))}
                            </select>
                            <p>=</p>
                            <select className='add_dropdown' defaultValue="def" onChange={(e) => handleBMchange(0, 'msm', e.target.value)}>
                                <option value="def" disabled>Quantity</option>
                                {Array.from({ length: 10 }).map((_, index) => (
                                    <option key={index} value={index}>{index}</option>
                                ))}
                            </select>
                            <p>servings</p>
                            {i === bmMaxIndex ?
                                <></>
                                : <button onClick={handleBMplus}>+</button>
                            }
                        </div>)))
                    : <p></p>
                }
                <input type="text"
                    value={body}
                    onChange={handleBodyChange}
                    placeholder="Recipe Steps"
                    className="add_text_input"
                />
                <TagBox />
                <button onClick={handleSubmit}>Add Recipe</button>
            </div>
        </div>
    </>
  )
}
