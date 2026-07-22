import '../styles/GrocListModal.css'
import { useGroceryList } from '../context/GroceryListContext';

interface ModalProps {
    onClose: () => void;
    onDrop: () => void;
}

export default function GrocListModal({ onClose, onDrop }: ModalProps) {
    const { grocListItems, updateGrocListDB, grocListDirty, removeHaves, rmItemGrocList, compileGrocList } = useGroceryList();

    return (
        <>
            <div className="modal">
                <div className='gl_header'>
                    <h1 className='gl_title'>Grocery</h1>
                    <h1 className='gl_title'>List</h1>
                    <button onClick={onClose}>Close</button>
                </div>
                <div className='gl_actions'>
                    <h3 className='actions_title'>Actions</h3>
                    <button onClick={removeHaves}>Remove in-stock items</button>
                    <button onClick={compileGrocList}>Add low/out essentials</button>
                    {grocListDirty ? <button onClick={updateGrocListDB}>Save changes</button> : <></>}
                </div>
                <div className='gl_box' onDragOver={(e) => e.preventDefault()} onDrop={onDrop}>
                    {grocListItems ? 
                        <ul className='gl_ul'>
                            {grocListItems.map((itm) => (
                                <li key={itm.item_id} className='gl_item' onClick={() => rmItemGrocList(itm)}>{itm.item}</li>
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
