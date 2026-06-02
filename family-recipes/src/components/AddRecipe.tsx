import { useState } from 'react'
import '../styles/AddRecipe.css'
// import { useEffect } from "react";
// import { supabase } from "../lib/supabase";


export default function AddRecipe() {
    const [name, setName] = useState<string>("");
    const [ver, setVer] = useState<string>("");
    const [bm1, setBM1] = useState<string>("");
    const [bm2, setBM2] = useState<string>("");
    const [bm3, setBM3] = useState<string>("");
    const [musts, setMusts] = useState<number[]>([]);
    const [body, setBody] = useState<string>("");
    const [tags, setTags] = useState<string[]>([]);

    // WAY TO ADD TO LIST STATE
    // const addTag = () => {
    //     setTags(tags => [...tags, 'NEW ITEM']);
    // };

  return (
    <>
        <div className="add_card">
            <h1>Add Recipe</h1>
            <div className='add_form'>
                <input type="text"
                    value={name}
                    // onChange={handleNameChange}
                    placeholder="Recipe Name"
                    className="add_text_input"
                />
            </div>
        </div>
    </>
  )
}
