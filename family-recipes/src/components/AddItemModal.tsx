import React, { useState } from 'react'
import '../styles/AddRecipe.css'
// import { useEffect } from "react";
// import { supabase } from "../lib/supabase";
import { supabase } from '../lib/supabase';

export default function AddItemModal() {
    const [item, setItem] = useState<string>("");
    const [ctg, setCtg] = useState<string>("");
    const [status, setStatus] = useState<string>("");

    const handleItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setItem(e.target.value);
    };
    const handleCtgChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCtg(e.target.value);
    };
    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatus(e.target.value);
    };

    // TO DO: validate before insert
    const validateItem = () => {
        return true;
    }

    const addItem = async(): Promise<InsertResult> => {
        console.log("submitted");
        // format BMs into individual strings        
        const { data, error } = await supabase
            .from("kitchen")
            .insert({
                item: item,
                category: ctg
            })
            .select()
            .single();
        if (error) {
            console.log("ERROR ADDING ITEM", error)
            return 0;
        } else if (data) {
            console.log("SUCCESS!");
            return 1;
        }
        return 0;
    }
    const handleAddItem = async() => {
        if (validateItem()) {
            const result = await addItem();
            if (result == 1) {
                console.log("GOOD")
            }
        } else {
            console.log("ITEM INVALID, DID NOT INSERT");
        }
    }

    const cat_options = ["Pantry", "Fridge"];
    const stat_options = ["have", "low", "out"];

  return (
    <>
        <div className="modal">
            <h1>Add Kitchen Item</h1>
            <div className='add_form'>
                <input type="text"
                    value={item}
                    onChange={handleItemChange}
                    placeholder="Item Name"
                    className="add_text_input"
                />
                <select className='add_dropdown' value={ctg} onChange={handleCtgChange}>
                    {cat_options.map((cat_opt) => (
                            <option key={cat_opt} value={cat_opt}>{cat_opt}</option>
                    ))}
                </select>
                <select className='add_dropdown' value={status} onChange={handleStatusChange}>
                    {stat_options.map((stat_opt) => (
                            <option key={stat_opt} value={stat_opt}>{stat_opt}</option>
                    ))}
                </select>
                <button onClick={handleAddItem}>Add Item</button>
            </div>
        </div>
    </>
  )
}
