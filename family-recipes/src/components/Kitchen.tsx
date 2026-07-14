import { useState } from 'react'
import '../styles/Kitchen.css'
import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import AddItemModal from './AddItemModal';
import { useAuth } from '../context/useAuth';


export default function Kitchen() {
    const { user } = useAuth();
    const initialState = () => ({ have: [], low: [], out: [] });

    const [pantry, setPantry] = useState<Record<string, Item[]>>(initialState);
    const [frozen, setFrozen] = useState<Record<string, Item[]>>(initialState);
    const [produce, setProduce] = useState<Record<string, Item[]>>(initialState);
    const [npfridge, setNPFridge] = useState<Record<string, Item[]>>(initialState);
    const [condiments, setCondiments] = useState<Record<string, Item[]>>(initialState);
    const [spices, setSpices] = useState<Record<string, Item[]>>(initialState);

    const [loading, setLoading] = useState<boolean>(true);

    const [addModal, setAddModal] = useState<boolean>(false);

    const filterStatusByProfile = (items: Item[]) => {
      const organizedObj = {have: [], low: [], out: items}
      return organizedObj;
    }

    type ItemStatus = "have_items" | "low_items" | "out_items";

    async function getKitchenItems(status: ItemStatus) {
        // ensure user is logged in, return 1 if error
        if (!user) return 1;
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("have_items, low_items, out_items")
          .eq("id", user.id)
          .single();
        if (profileError || !profile) return 2;
        const ids = profile[status] ?? [];
        const { data, error } = await supabase
            .from("kitchen")
            .select("*")
            .in("item_id", ids);
        if (error) return 1;
        return data;
    }

    useEffect(() => {
        async function fetchAllKitchenItems() {
          setLoading(true);
            const haveItems = await getKitchenItems("have_items");
            const lowItems = await getKitchenItems("low_items");
            const outItems = await getKitchenItems("out_items");
            if (haveItems == 2 || haveItems == 1 || lowItems == 2 || lowItems == 1 || outItems == 2 || outItems == 1) {
                console.log("ERROR FETCHING ITEMS")
            } else {
                console.log("have items:", haveItems);
                setPantry({
                    have: haveItems.filter(item => item.category === 'Pantry'),
                    low: lowItems.filter(item => item.category === 'Pantry'),
                    out: outItems.filter(item => item.category === 'Pantry')
                });
                setFrozen({
                    have: haveItems.filter(item => item.category === 'Frozen'),
                    low: lowItems.filter(item => item.category === 'Frozen'),
                    out: outItems.filter(item => item.category === 'Frozen')
                });
                setProduce({
                    have: haveItems.filter(item => item.category === 'Produce'),
                    low: lowItems.filter(item => item.category === 'Produce'),
                    out: outItems.filter(item => item.category === 'Produce')
                });
                setNPFridge({
                    have: haveItems.filter(item => item.category === 'Non-Produce Fridge'),
                    low: lowItems.filter(item => item.category === 'Non-Produce Fridge'),
                    out: outItems.filter(item => item.category === 'Non-Produce Fridge')
                });
                setCondiments({
                    have: haveItems.filter(item => item.category === 'Condiments'),
                    low: lowItems.filter(item => item.category === 'Condiments'),
                    out: outItems.filter(item => item.category === 'Condiments')
                });
                setSpices({
                    have: haveItems.filter(item => item.category === 'Spices'),
                    low: lowItems.filter(item => item.category === 'Spices'),
                    out: outItems.filter(item => item.category === 'Spices')
                });
                setLoading(false);
            }
        }
        fetchAllKitchenItems();
    }, []);
    
    const items_by_cat = [pantry, frozen, produce, npfridge, condiments, spices];
    const maxRows = Math.max(
        ...items_by_cat.flatMap(ctg => [
            ctg.have?.length ?? 0,
            ctg.low?.length ?? 0,
            ctg.out?.length ?? 0,
        ])
    );

    const cat_titles = ["Pantry", "Fridge", "Produce", "Non-Produce Fridge", "Condiments", "Spices"];

    const closeModal = () => {
      setAddModal(false);
    }

    return (
    <>
        <div>
            <h1>Kitchen</h1>
            {addModal ? <AddItemModal onClose={closeModal}/> : <button onClick={() => setAddModal(true)}>Add Item</button>}
        </div>
        {maxRows === 0 ?
          (<p>No items in kitchen.</p>)
          : cat_titles.map((ctg, i) => (
              <div className='cat_div'key={ctg}>
                <h2 className='cat_heading'>{ctg}</h2>
                <table className='cat_table'>
                  <thead>
                    <tr>
                      <th>Have</th>
                      <th>Low</th>
                      <th>Out</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ?
                      (<tr>
                        <td colSpan={3}>Loading {ctg}...</td>
                      </tr>)
                      : Array.from({ length: maxRows }).map((_, index) => (
                        <tr key={index}>
                          <td>{pantry.have[index] ? pantry.have[index].item : ""}</td>
                          <td>{pantry.low[index] ? pantry.low[index].item : ""}</td>
                          <td>{pantry.out[index] ? pantry.out[index].item : ""}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
          ))
        }
    </>
  )
}
