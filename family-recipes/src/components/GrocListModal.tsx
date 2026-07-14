import React, { useEffect, useState } from 'react'
import '../styles/GrocListModal.css'
// import { supabase } from "../lib/supabase";
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import { useKitchen } from '../context/KitchenContext';

interface ModalProps {
    onClose: () => void;
}
type ItemStatus = "have_items" | "low_items" | "out_items";


export default function GrocListModal({ onClose }: ModalProps) {
    const { user } = useAuth();
    // const nav = useNavigate();
    const { dirty, setDirty } = useKitchen();

    const cat_options = ["Produce", "Non-Produce Fridge", "Pantry", "Frozen", "Condiments", "Spices"];
    const stat_options = ["have", "low", "out"];

    const [listItems, setListItems] = useState<Item[] | null>(null);

    async function getItems(get_col : string) {
        if (!user) return 1;
        // get list of item ids for logged in user, return 2 if select fails
        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select(get_col)
            .eq("id", user.id)
            .single();
        if (profileError) return 2;
        return profile;
    }

    const createListIds = (must, currList, have, low, out) => {
        // TODO: if currlist includes items in have - remove from list
        // TODO: if items in must are also in low or out, add to list (do not duplicate)
    }

    useEffect(() => {
        async function fetchGroceryList() {
            if (!user) return 1;
            // get list of must have item ids, current grocery list, have/low/out item ids for logged in user, return 2 if select fails
            const must_items = getItems("must_items");
            const curr_list = getItems("grocery_list");
            const have_items = getItems("have_items")
            const low_items = getItems("low_items");
            const out_items = getItems("out_items");
            // create grocery list
            const newList = createListIds(must_items, curr_list, have_items, low_items, out_items);
            // get kitchen items that match the status list of ids, return 1 if select fails
            const { data, error } = await supabase
                .from("kitchen")
                .select("*")
                .in("item_id", newList);
            if (error) return 1;
            // return kitchen items on grocery list
            setListItems(data);
            return data;
        };
        fetchGroceryList();
    }, []);

  return (
    <>
        <div className="modal">
            <h1>Grocery List</h1>
            <div className='list'>
                
            </div>
            <button onClick={onClose}>Close</button>
        </div>
    </>
  )
}
