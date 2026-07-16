import { useState } from 'react'
import '../styles/Kitchen.css'
import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import AddItemModal from './AddItemModal';
import { useAuth } from '../context/useAuth';
import GrocListModal from './GrocListModal';
import { useKitchen } from '../context/KitchenContext';
import { useGroceryList } from '../context/GroceryListContext';


export default function Kitchen() {
    const { user } = useAuth();
    const { dirty, setDirty } = useKitchen();
    const { refreshGrocList, addItemGrocList } = useGroceryList();

    type Category = { have: Item[], low: Item[], out: Item[] };
    const initialState = (): Category => ({ have: [], low: [], out: [] });

    const [itemsByCat, setItemsByCat] = useState<Category[]>([
      initialState(), // Produce
      initialState(), // Non-Produce Fridge
      initialState(), // Pantry
      initialState(), // Frozen
      initialState(), // Condiments
      initialState() // Spices
    ]);

    const [draggedItem, setDraggedItem] = useState<{
      item: Item;
      ctg_index: number;
      status: "have" | "low" | "out";
    } | null>(null);

    const [loading, setLoading] = useState<boolean>(true);

    const [addModal, setAddModal] = useState<boolean>(false);

    const [grocListModal, setGrocListModal] = useState<boolean>(true);

    type ItemStatus = "have_items" | "low_items" | "out_items";

    async function getKitchenItems(status: ItemStatus) {
        if (!user) return 1;
        // get list of item ids for have, low, and out for logged in user, return 2 if select fails
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("have_items, low_items, out_items")
          .eq("id", user.id)
          .single();
        if (profileError || !profile) return 2;
        // get kitchen items that match the status list of ids, return 1 if select fails
        const ids = profile[status] ?? [];
        const { data, error } = await supabase
            .from("kitchen")
            .select("*")
            .in("item_id", ids);
        if (error) return 1;
        // return kitchen items for specified status
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
                setItemsByCat([
                  {
                    have: haveItems.filter(item => item.category === 'Produce'),
                    low: lowItems.filter(item => item.category === 'Produce'),
                    out: outItems.filter(item => item.category === 'Produce')
                  },
                  {
                    have: haveItems.filter(item => item.category === 'Non-Produce Fridge'),
                    low: lowItems.filter(item => item.category === 'Non-Produce Fridge'),
                    out: outItems.filter(item => item.category === 'Non-Produce Fridge')
                  },
                  {
                    have: haveItems.filter(item => item.category === 'Pantry'),
                    low: lowItems.filter(item => item.category === 'Pantry'),
                    out: outItems.filter(item => item.category === 'Pantry')
                  },
                  {
                    have: haveItems.filter(item => item.category === 'Frozen'),
                    low: lowItems.filter(item => item.category === 'Frozen'),
                    out: outItems.filter(item => item.category === 'Frozen')
                  },
                  {
                    have: haveItems.filter(item => item.category === 'Condiments'),
                    low: lowItems.filter(item => item.category === 'Condiments'),
                    out: outItems.filter(item => item.category === 'Condiments')
                  },
                  {
                    have: haveItems.filter(item => item.category === 'Spices'),
                    low: lowItems.filter(item => item.category === 'Spices'),
                    out: outItems.filter(item => item.category === 'Spices')
                  }
                ]);
                setLoading(false);
            }
        }
        fetchAllKitchenItems();
        refreshGrocList();
    }, []);

    const handleDrop = (newCtgIndex: number, newStatus: "have" | "low" | "out") => {
      // error checking - return from function
      // draggedItem state is null (nothing being dragged)
      if (!draggedItem) return;
      // draggedItem is moved to the same spot
      if (draggedItem.ctg_index === newCtgIndex && draggedItem.status === newStatus) return;
      // draggedItem is moved to a different category
      if (draggedItem.ctg_index !== newCtgIndex) return;

      // draggedItem is moved to a new status in the same category - update state
      setDirty(true);
      setItemsByCat((prev) => {
        const updated = [...prev]
        const cat_items = {...updated[newCtgIndex]};
        // save item
        // const item_to_move = cat_items[draggedItem.status].find((itm) => itm.item_id === draggedItem.item.item_id);
        // remove item from old status list
        cat_items[draggedItem.status] = cat_items[draggedItem.status].filter((itm) => itm.item_id !== draggedItem.item.item_id);
        // add item to new status list
        cat_items[newStatus] = [...cat_items[newStatus], draggedItem.item];
        // update state
        updated[newCtgIndex] = cat_items;
        return updated;
      })
      setDraggedItem(null);
    }

    // update database if dirty
    const handleSaveKitchen = async () => {
      if (!user) return;
      if (!dirty) return;
      // get list of item ids for each status
      const have = itemsByCat.flatMap(cat =>
        cat.have.map(item => item.item_id)
      );
      const low = itemsByCat.flatMap(cat =>
        cat.low.map(item => item.item_id)
      );
      const out = itemsByCat.flatMap(cat =>
        cat.out.map(item => item.item_id)
      );

      const { error } = await supabase
        .from("profiles")
        .update({
          have_items: have,
          low_items: low,
          out_items: out
        })
        .eq("id", user.id);
      if (error) return 1;
      setDirty(false);
    };

    // warn before leaving page (refresh, close tab, type new url) if changes are not saved
    useEffect(() => {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        if (!dirty) return;
        e.preventDefault();
        e.returnValue = "";
      };
      window.addEventListener("beforeunload", handleBeforeUnload);
      
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      }
    }, [dirty]);

    // functions to pass to modal components
    const closeAddModal = () => {
      setAddModal(false);
    }
    const closeGrocListModal = () => {
      setGrocListModal(false);
    }
    const handleGrocListDrop = () => {
      if (!draggedItem) return;
      addItemGrocList(draggedItem.item);
    }

    const maxRows = Math.max(
        ...itemsByCat.flatMap(ctg => [
            ctg.have?.length ?? 0,
            ctg.low?.length ?? 0,
            ctg.out?.length ?? 0,
        ])
    );
    const cat_titles = ["Produce", "Non-Produce Fridge", "Pantry", "Frozen", "Condiments", "Spices"];

    return (
      <div className='kitchen'>
        <div className='kitchen_items'>
            <div>
                <h1>Kitchen</h1>
                {addModal ? <AddItemModal onClose={closeAddModal}/> : <button onClick={() => setAddModal(true)}>Add Item</button>}
            </div>
            <div>
              {dirty ? <button onClick={handleSaveKitchen}>Save changes</button> : <></>}
            </div>
            {maxRows === 0 ?
              (<p>No items in kitchen.</p>)
              : cat_titles.map((ctg, i) => (
                  <div className='cat_div'key={ctg}>
                    <h2 className='cat_heading'>{ctg}</h2>
                    <table className='cat_table'>
                      <thead>
                        <tr>
                          <th className='tbl_heading'>Have</th>
                          <th className='tbl_heading'>Low</th>
                          <th className='tbl_heading'>Out</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ?
                          (<tr>
                            <td colSpan={3}>Loading {ctg}...</td>
                          </tr>)
                          : <tr>
                              <td className='tbl_box'
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={() => handleDrop(i, "have")}
                              >
                                <ul className='tbl_ul'>
                                  {itemsByCat[i].have.map((itm) => (
                                    <li key={itm.item_id}
                                      className='item_li'
                                      draggable="true"
                                      onDragStart={() =>
                                        setDraggedItem({
                                          item: itm,
                                          ctg_index: i,
                                          status: "have"
                                        })
                                      }
                                      >{itm.item}</li>
                                  ))}
                                </ul>
                              </td>
                              <td className='tbl_box'
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={() => handleDrop(i, "low")}
                              >
                                <ul className='tbl_ul'>
                                  {itemsByCat[i].low.map((itm) => (
                                    <li key={itm.item_id}
                                      className='item_li'
                                      draggable="true"
                                      onDragStart={() =>
                                        setDraggedItem({
                                          item: itm,
                                          ctg_index: i,
                                          status: "low"
                                        })
                                      }
                                      >{itm.item}</li>
                                  ))}
                                </ul>
                              </td>
                              <td className='tbl_box'
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={() => handleDrop(i, "out")}
                              >
                                <ul className='tbl_ul'>
                                  {itemsByCat[i].out.map((itm) => (
                                    <li key={itm.item_id}
                                      className='item_li'
                                      draggable="true"
                                      onDragStart={() =>
                                        setDraggedItem({
                                          item: itm,
                                          ctg_index: i,
                                          status: "out"
                                        })
                                      }
                                      >{itm.item}</li>
                                  ))}
                                </ul>
                              </td>
                            </tr>
                        }
                      </tbody>
                    </table>
                  </div>
              ))
            }
        </div>
        <div className='groclist_modal'>
          {grocListModal ?
              <GrocListModal
                onClose={closeGrocListModal}
                onDrop={handleGrocListDrop}
              />
              : <></>
            }
        </div>
      </div>
    )
}

// OLD VERSION OF TABLE (each item is a new tr)
                      // : Array.from({ length: maxRows }).map((_, index) => (
                      //   <tr key={index}>
                      //     {items_by_cat[i].have[index] ?
                      //       <td draggable="true" id={String(items_by_cat[i].have[index].item_id)}>{items_by_cat[i].have[index].item}</td>
                      //       : <td></td>
                      //     }
                      //     {items_by_cat[i].low[index] ?
                      //       <td draggable="true" id={String(items_by_cat[i].low[index].item_id)}>{items_by_cat[i].low[index].item}</td>
                      //       : <td></td>
                      //     }
                      //     {items_by_cat[i].out[index] ?
                      //       <td draggable="true" id={String(items_by_cat[i].out[index].item_id)}>{items_by_cat[i].out[index].item}</td>
                      //       : <td></td>
                      //     }
                      //   </tr>
                      // ))