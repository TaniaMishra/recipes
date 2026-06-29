import React, { useState } from 'react'
import '../styles/AddRecipe.css'
// import { useEffect } from "react";
// import { supabase } from "../lib/supabase";
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/useAuth';

interface ModalProps {
    onClose: () => void;
}
type ItemStatus = "have_items" | "low_items" | "out_items";


export default function AddItemModal({ onClose }: ModalProps) {
    const { user } = useAuth();

    const cat_options = ["Pantry", "Fridge"];
    const stat_options = ["have", "low", "out"];

    const [item, setItem] = useState<string>("");
    const [ctg, setCtg] = useState<string>(cat_options[0]);
    const [status, setStatus] = useState<string>(stat_options[0]);

    const [valid, setValid] = useState<boolean>(false);

    // TO DO: validate item
    const validateItem = (newItem : string) => {
        if (newItem.length > 0 && cat_options.includes(ctg) && stat_options.includes(status)) {
            return true;
        }
        console.log(item, ctg, status);
        return false;
    }

    const handleItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setItem(e.target.value);
        setValid(validateItem(e.target.value));
    };
    const handleCtgChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCtg(e.target.value);
        setValid(validateItem(item));
    };
    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatus(e.target.value);
        setValid(validateItem(item));
    };

    const handleAddItem = async() => {
        // ensure user is logged in, return 1 if error
        if (!user) return 1;
        console.log("submitted");
        // add item to kitchen table, return 1 if error
        const { data, error } = await supabase
            .from("kitchen")
            .insert({
                item: item,
                category: ctg
            })
            .select()
            .single();
        if (error || !data) {
            console.log("ERROR ADDING ITEM", error)
            return 1;
        }
        // get current list of items from profile, return 2 if error
        const iid = data.item_id;
        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("have_items, low_items, out_items")
            .eq("id", user.id)
            .single();
        if (profileError || !profile) {
            console.log("ERROR GETTING CURRENT PROFILE DATA", profileError);
            return 2;
        }
        // create updated lists to insert
        const removeItem = (lst: number[] = []) =>
            lst.filter(id => id !== iid);
        const updatedLists = {
            have_items:
            // if status & not null - remove item, add item
            // if status & null - list of item
            // if not status & not null - remove item
            // if not status & null - keep same
                status === "have" && profile.have_items
                    ? [...removeItem(profile.have_items), iid]
                    : status === "have" && !profile.have_items
                        ? [iid]
                        : []
            low_items:
                status === "low"
                    ? [...removeItem(profile.low_items), iid]
                    : removeItem(profile.low_items),

            out_items:
                status === "out"
                    ? [...removeItem(profile.out_items), iid]
                    : removeItem(profile.out_items),
        };
        // update list of items in profile, return 2 if error
        const { error: profileInsertError } = await supabase
            .from("profiles")
            .update(updatedLists)
            .eq("id", user.id);
        if (profileInsertError) {
            console.log("ERROR INSERTING STATUS INTO PROFILE", profileInsertError);
            return 2;
        }
        // SUCCESS - return 0
        return 0;
    }

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
                {valid ? <button onClick={handleAddItem}>Add Item</button> : <></>}
            </div>
            <button onClick={onClose}>Close</button>
        </div>
    </>
  )
}
