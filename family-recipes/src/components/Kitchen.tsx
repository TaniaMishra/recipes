import { useState } from 'react'
import '../styles/Kitchen.css'
import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import AddItemModal from './AddItemModal';


export default function Kitchen() {
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

    useEffect(() => {
        async function fetchAllKitchenItems() {
          setLoading(true);
            const { data, error } = await supabase
                .from("kitchen")
                .select("*");
            if (error) {
                console.log("ERROR FETCHING RECIPES", error)
            } else if (data) {
                setPantry(filterStatusByProfile(data.filter(item => item.category === 'Pantry')));
                setFrozen({have: [], low: [], out: data.filter(item => item.category === 'Frozen')});
                setProduce({have: [], low: [], out: data.filter(item => item.category === 'Produce')});
                setNPFridge({have: [], low: [], out: data.filter(item => item.category === 'Non-Produce Fridge')});
                setCondiments({have: [], low: [], out: data.filter(item => item.category === 'Condiments')});
                setSpices({have: [], low: [], out: data.filter(item => item.category === 'Spices')});
                setLoading(false);
            }
        }
        fetchAllKitchenItems();
    }, []);

    const maxRows = Math.max(pantry.out.length, frozen.out.length, produce.out.length, npfridge.out.length, condiments.out.length, spices.out.length);

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
          : (<div className='cat_div'>
              <h2 className='cat_heading'>Pantry</h2>
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
                      <td colSpan={3}>Loading kitchen...</td>
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
          )
        }
    </>
  )
}
