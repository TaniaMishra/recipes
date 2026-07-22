import React, { useState } from 'react'
import '../styles/AddRecipe.css'
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/useAuth';
import { useKitchen } from '../context/KitchenContext';

interface ModalProps {
    onClose: () => void;
}

export default function AddItemModal({ onClose }: ModalProps) {
    const { user } = useAuth();
    const { ctgTitles, allItems, setAllItems, kitchenItemsByCat, setKitchenItemsByCat, setDirty } = useKitchen();

    const stat_options = ["have", "low", "out"];

    const [item, setItem] = useState<string>("");
    const [ctg, setCtg] = useState<string>(ctgTitles[0]);
    const [status, setStatus] = useState<string>(stat_options[0]);

    const [valid, setValid] = useState<boolean>(false);

    // validate every time input fields are changed
    const validateItem = (newItem : string) => {
        if (newItem.length > 0 && ctgTitles.includes(ctg) && stat_options.includes(status)) {
            return true;
        }
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

    const getItemId = async() => {
        // if item exists with same name and same category - return existing item id
        const matching = allItems.filter((itm) => (itm.item === item && itm.category === ctg));
        if (matching.length === 1) return matching[0].item_id;
        // if item doesn't exist or if item exists with a different category - return created item id
        const { data, error } = await supabase
            .from("kitchen")
            .insert({
                item: item,
                category: ctg
            })
            .select()
            .single();
        if (error || !data) return;
        const newList = [
            ...allItems, 
            {
                item_id: data["item_id"],
                item: data["item"],
                category: data["category"] 
            }
        ];
        setAllItems(newList);
        return data.item_id;
    }

    const getNewStatusList = (iid : number, status_to_check : "have" | "low" | "out") => {
        const status_to_check_list = kitchenItemsByCat[ctgTitles.indexOf(ctg)][status_to_check]
        // if item in kitchen - don't change list if has same status, delete from list if has different status
        const exists = status_to_check_list.filter((itm) => itm.item_id === iid);
        if (exists.length > 0) {
            if (status === status_to_check) return status_to_check_list;
            setDirty(true);
            return status_to_check_list.filter((itm) => itm.item_id !== iid);
        }
        // if item not in kitchen - don't change list if not updating correct status, add to list if updating correct status
        if (status !== status_to_check) return status_to_check_list;
        setDirty(true);
        return [...status_to_check_list, {
            item: item,
            item_id: iid,
            category: ctg
        }]
    }

    const handleAddItem = async() => {
        if (!user) return;
        const iid = await getItemId();
        // update status lists for item's category - sets dirty state as needed
        const newHaveListForCtg = getNewStatusList(iid, "have");
        const newLowListForCtg = getNewStatusList(iid, "low");
        const newOutListForCtg = getNewStatusList(iid, "out");
        // update kibc state
        const newKIBC = kitchenItemsByCat.map((category, i) => {
            if (i === ctgTitles.indexOf(ctg))
                return {
                    have: newHaveListForCtg,
                    low: newLowListForCtg,
                    out: newOutListForCtg
                };
            else return category;
        });
        setKitchenItemsByCat(newKIBC)
        onClose();
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
                    {ctgTitles.map((cat_opt) => (
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
