import '../styles/GrocListModal.css'
import { useGroceryList } from '../context/GroceryListContext';

interface ModalProps {
    onClose: () => void;
    onDrop: () => void;
}

export default function GrocListModal({ onClose, onDrop }: ModalProps) {
    const { grocListItems, updateGrocList, grocListDirty, removeHaves } = useGroceryList();

    return (
        <>
            <div className="modal">
                <div>
                    <h1>Grocery List</h1>
                    {grocListDirty ? <button onClick={updateGrocList}>Save changes</button> : <></>}
                    <button onClick={removeHaves}>Remove items that are in stock</button>
                </div>
                <div className='gl_box' onDragOver={(e) => e.preventDefault()} onDrop={onDrop}>
                    {grocListItems ? 
                        <ul className='gl_ul'>
                            {grocListItems.map((itm) => (
                                <li key={itm.item_id}>{itm.item}</li>
                            ))}
                        </ul>
                        : <p>No items in list</p>
                    }
                </div>
                <button onClick={onClose}>Close</button>
            </div>
        </>
    )
}
