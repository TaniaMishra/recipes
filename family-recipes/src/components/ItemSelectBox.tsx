import CreatableSelect from 'react-select/creatable';
import { useEffect, useState } from "react";
import '../styles/ItemSelectBox.css';
import { useKitchen } from '../context/KitchenContext';

type ItemOption = {
    value: string;
    label: string;
    id: number;
}

interface ItemSelectBoxProps {
    selectedItems: number[];
    setSelectedItems: React.Dispatch<React.SetStateAction<number[]>>;
    onClick: () => void;
    dirty: boolean;
    setDirty: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ItemSelectBox({ selectedItems, setSelectedItems, onClick, dirty, setDirty }: ItemSelectBoxProps) {
    const {allItems, fetchAllitems} = useKitchen();

    const [itemOptions, setItemOptions] = useState<ItemOption[]>([]);
    const [selectedOptions, setSelectedOptions] = useState<ItemOption[]>([]);

    const handleChange = (newValue: readonly ItemOption[]) => {
        setSelectedOptions([...newValue]);
        setSelectedItems(newValue.map((itm) => itm.id));
        setDirty(true);
    };

    useEffect(() => {
        if (allItems.length === 0) {
            fetchAllitems();
            return;
        }
        const itmOpts = allItems.map((itm) => ({value: itm.item, label: itm.item, id: itm.item_id}));
        setItemOptions(itmOpts);
        const selectedOptions = itmOpts.filter((itm) => selectedItems.includes(itm.id));
        setSelectedOptions(selectedOptions);
    }, [selectedItems, allItems, fetchAllitems]);



    return (
        <div>
            <CreatableSelect
                isMulti
                options={itemOptions}
                value={selectedOptions}
                onChange={handleChange}
                className='item_box'
            />
            {dirty ? <button onClick={onClick}>Save Changes</button> : <></>}
        </div>
    );
}