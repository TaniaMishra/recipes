import React, { createContext, useContext, useState } from "react";
import { useAuth } from "./useAuth";
import { supabase } from "../lib/supabase";

type GroceryListContextType = {
    grocListItems: Item[];
    getGrocList: () => Promise<void>;
    compileGrocList: () => Promise<void>;
    updateGrocListDB: () => Promise<void>;
    addItemGrocList: (value: Item) => void;
    rmItemGrocList: (value: Item) => void;
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

    async function updateGrocListDB() {
        if (!user) throw Error("No user logged in");
        const grocListIds = grocListItems.map((itm) => itm.item_id);
        const { error: profileInsertError } = await supabase
            .from("profiles")
            .update({
                grocery_list: grocListIds
            })
            .eq("id", user.id);
        if (profileInsertError) throw Error("Error occured while updating grocery list in profiles table");
        setGrocListDirty(false);
    }

    async function getGrocList() {
        const groc_list = await getItems("grocery_list");
        if (!groc_list) return;
        // if new list is same as current list - return
        if ((groc_list.length === grocListItems.length) && (grocListItems.every((itm) => groc_list.includes(itm.item_id)))) return;
        // get kitchen items that match the groc list of ids, throw error if select fails
        const { data, error } = await supabase
            .from("kitchen")
            .select("*")
            .in("item_id", groc_list);
        if (error) throw Error("Error occured while fetching grocery list from kitchen table");
        // update state
        setGrocListDirty(true);
        setGrocListItems(data);
    }

    async function compileGrocList() {
        if (!user) throw Error("No user logged in");
        // get list of must have item ids, low/out item ids for logged in user, throw error fetch failed
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
        // combine list of must items that are low/out with current list, remove duplicates
        const currList = grocListItems.map((itm) => itm.item_id);
        const newListasSet = new Set([...currList, ...listMusts]);
        const newList = [...newListasSet];
        // get kitchen items that match the status list of ids, throw error if select fails
        const { data, error } = await supabase
            .from("kitchen")
            .select("*")
            .in("item_id", newList);
        if (error) throw Error("Error occured while fetching grocery list from kitchen table");
        // set dirty if currlist != newlist
        if ((currList.length !== newList.length) || (!currList.every((itmID) => newListasSet.has(itmID)))) setGrocListDirty(true);
        // return kitchen items on grocery list
        setGrocListItems(data);
    };

    async function removeHaves() {
        // get item ids in stock for logged in user, return if fetch failed
        const have_items = await getItems("have_items")
        if (!have_items) return;
        // remove have items from groc list
        setGrocListItems((prev) => prev.filter((itm) => !have_items.includes(itm.item_id)))
        setGrocListDirty(true);
    }

    function addItemGrocList(newItem: Item) {
        // if already in list - return
        if (grocListItems.some((itm) => itm.item_id === newItem.item_id)) return;
        // add to list
        setGrocListItems([...grocListItems, newItem]);
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
                getGrocList,
                compileGrocList,
                updateGrocListDB,
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