import React, { createContext, useContext, useState } from "react";
import { useAuth } from "./useAuth";
import { supabase } from "../lib/supabase";
import { useKitchen } from "./KitchenContext";

type GroceryListContextType = {
    grocListItems: Item[];
    refreshGrocList: () => Promise<void>;
    updateGrocList: () => Promise<void>;
    addItemGrocList: (arg0: Item) => void;
    rmItemGrocList: (arg0: Item) => void;
    grocListDirty: boolean;
    removeHaves: () => void;
}

const GroceryListContext = createContext<GroceryListContextType | null>(null);


export function GroceryListProvider({ children } : { children: React.ReactNode; }) {
    const { user } = useAuth();
    const [grocListDirty, setGrocListDirty] = useState<boolean>(false);
    const [grocListItems, setGrocListItems] = useState<Item[]>([]);

    async function getItems(get_col : string) {
        if (!user) return 1;
        // get list of item ids for logged in user, return null if select fails
        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select(get_col)
            .eq("id", user.id)
            .single();
        if (profileError || !profile) return null;
        if (!profile[get_col]) return [];
        return profile[get_col];
    }

    async function updateGrocList() {
        if (!user) return 1;
        const grocListIds = grocListItems.map((itm) => itm.item_id);
        const { error: profileInsertError } = await supabase
            .from("profiles")
            .update({
                grocery_list: grocListIds
            })
            .eq("id", user.id);
        if (profileInsertError) return 2;
        setGrocListDirty(false);
    }

    async function refreshGrocList() {
        if (!user) return 1;
        // get list of must have item ids, current grocery list, low/out item ids for logged in user, return if fetch failed
        const curr_list = await getItems("grocery_list");
        if (!curr_list) return;
        const must_items = await getItems("must_items");
        if (!must_items) return;
        const low_items = await getItems("low_items");
        if (!low_items) return;
        const out_items = await getItems("out_items");
        if (!out_items) return;
        // if items in must are also in low or out, add to list
        const listMusts = must_items.filter((mst_itm) => {
           if (low_items.includes(mst_itm) || out_items.includes(mst_itm)) return mst_itm;
        });
        // combine list with haves removed and list of must items that are low/out, remove duplicates
        const newListasSet = new Set([...curr_list, ...listMusts]);
        const newList = [...newListasSet];
        // get kitchen items that match the status list of ids, return 2 if select fails
        const { data, error } = await supabase
            .from("kitchen")
            .select("*")
            .in("item_id", newList);
        if (error) return 2;
        // set dirty if currlist != newlist
        if (!curr_list.every((itm) => newListasSet.has(itm))) setGrocListDirty(true);
        // return kitchen items on grocery list
        setGrocListItems(data);
        return data;
    };

    async function removeHaves() {
        // get list of current grocery list and item ids for logged in user, return if fetch failed
        // const curr_list = await getItems("grocery_list");
        // if (!curr_list) return;
        const have_items = await getItems("have_items")
        if (!have_items) return;
        // if currlist includes items in have - remove from list
        // const newList = curr_list.filter((itm) => !have_items.includes(itm));
        setGrocListItems((prev) => prev.filter((itm) => !have_items.includes(itm.item_id)))
        setGrocListDirty(true);
    }

    function addItemGrocList(newItem: Item) {
        // remove if already in list
        const newList = grocListItems.filter((itm) => itm.item_id !== newItem.item_id);
        // add to list
        setGrocListItems([...newList, newItem]);
        setGrocListDirty(true);
    }
    function rmItemGrocList(rmItem: Item) {
        setGrocListItems((prev) => prev.filter((itm) => itm.item_id !== rmItem.item_id));
        setGrocListDirty(true);
    }

    return (
        <GroceryListContext.Provider
            value = {{
                grocListItems,
                refreshGrocList,
                updateGrocList,
                addItemGrocList,
                rmItemGrocList,
                grocListDirty,
                removeHaves
            }}
        >
            {children}
        </GroceryListContext.Provider>
    )
}

export function useGroceryList() {
    const context = useContext(GroceryListContext);

    if (!context) {
        throw new Error("useGroceryList must be used inside GroceryListProvider");
    }

    return context;
}