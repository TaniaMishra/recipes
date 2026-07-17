import { useState } from 'react'
import '../styles/Kitchen.css'
import { useEffect } from "react";
import AddItemModal from './AddItemModal';
import GrocListModal from './GrocListModal';
import { useKitchen } from '../context/KitchenContext';
import { useGroceryList } from '../context/GroceryListContext';

// TODO: delete items from grocery list (hover, click to strikethrough, set dirty, save changes to delete)
// TODO: delete items from my kitchen (drag and drop into trash) - don't delete from kitchen table, just profile table
export default function Kitchen() {
    const { dirty, setDirty, kitchenItemsByCat, setKitchenItemsByCat, fetchAllKitchenItems,updateKitchen, maxRows, ctgTitles, fetchAllitems } = useKitchen();
    const { refreshGrocList, addItemGrocList } = useGroceryList();

    const [addModal, setAddModal] = useState<boolean>(false);
    const [grocListModal, setGrocListModal] = useState<boolean>(true);

    const [draggedItem, setDraggedItem] = useState<{
      item: Item;
      ctg_index: number;
      status: "have" | "low" | "out";
    } | null>(null);

    useEffect(() => {
        fetchAllitems();
        fetchAllKitchenItems();
        refreshGrocList();
    }, []);

    const handleDrop = (newCtgIndex: number, newStatus: "have" | "low" | "out") => {
      // draggedItem state is null (nothing being dragged), moved to the same spot, moved to a different category - return from function
      if (!draggedItem) return;
      if (draggedItem.ctg_index === newCtgIndex && draggedItem.status === newStatus) return;
      if (draggedItem.ctg_index !== newCtgIndex) return;

      // draggedItem is moved to a new status in the same category - update state
      setDirty(true);
      const updatedItemsByCat = [...kitchenItemsByCat];
      const cat_items = {...updatedItemsByCat[newCtgIndex]};
      // remove item from old status list
      cat_items[draggedItem.status] = cat_items[draggedItem.status].filter((itm) => itm.item_id !== draggedItem.item.item_id);
      // add item to new status list
      cat_items[newStatus] = [...cat_items[newStatus], draggedItem.item];
      updatedItemsByCat[newCtgIndex] = cat_items;
      // update state
      setKitchenItemsByCat(updatedItemsByCat);
      setDraggedItem(null);
    }

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

    return (
      <div className='kitchen'>
        <div className={grocListModal ? 'kitchen_items' : 'kitchen_items_full'}>
            <div>
                <h1>Kitchen</h1>
                {addModal ? <AddItemModal onClose={closeAddModal}/> : <button onClick={() => setAddModal(true)}>Add Item</button>}
                {!grocListModal
                  ? <button onClick={() => setGrocListModal(true)} className='groclist_btn'>Open grocery list</button>
                  : <></>
                }
            </div>
            <div>
              {dirty ? <button onClick={updateKitchen}>Save changes</button> : <></>}
            </div>
            {maxRows === 0 ?
              (<p>No items in kitchen.</p>)
              : ctgTitles.map((ctg, i) => (
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
                        <tr>
                          <td className='tbl_box'
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => handleDrop(i, "have")}
                          >
                            <ul className='tbl_ul'>
                              {kitchenItemsByCat[i].have.map((itm) => (
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
                              {kitchenItemsByCat[i].low.map((itm) => (
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
                              {kitchenItemsByCat[i].out.map((itm) => (
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
                      </tbody>
                    </table>
                  </div>
              ))
            }
        </div>
        <div className={grocListModal ? 'groclist_modal' : 'groclist_modal_closed'}>
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
