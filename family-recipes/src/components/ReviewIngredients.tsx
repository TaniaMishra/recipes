import '../styles/ReviewIngredients.css'
// import { useState } from 'react';

interface ReviewIngredientsProps {
    ingredients: Ingredient[];
    setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
    reParse: () => Ingredient[];
}

// TODO: be able to search for and add ingredients not listed

export default function ReviewIngredients({ingredients, setIngredients, reParse}: ReviewIngredientsProps) {
    // const [addIngModal, setAddIngModal] = useState<boolean>(false);

    const handleCheckChange = (checked: boolean, id: number) => {
        const updatedIngredients = ingredients.map((ing) => 
            ing.item_id === id
                ? {...ing, must: checked}
                : ing
        );
        setIngredients([...updatedIngredients]);
    }

    const handleSubChange = (subText: string, id: number) => {
        const updatedIngredients = ingredients.map((ing) => 
            ing.item_id === id
                ? {...ing, sub: subText}
                : ing
        );
        setIngredients([...updatedIngredients]);
    }
    
    const handleDelete = (id: number) => {
        const updatedIngredients = ingredients.filter((ing) => ing.item_id !== id );
        setIngredients([...updatedIngredients]);
    }
    
    const handleReloadIngredients = () => {
        const ings = reParse();
        setIngredients(ings);
    }

  return (
    <>
        <div className="review_card">
            <h1>Review Ingredients</h1>
            <button onClick={handleReloadIngredients}>Reload ingredients?</button>
            <table className='ing_table'>
                <thead>
                    <tr>
                        <th className='tbl_heading'>Ingredient</th>
                        <th className='tbl_heading'>Essential?</th>
                        <th className='tbl_heading'>Possible Substitutions</th>
                        <th className='tbl_heading'>Delete?</th>
                    </tr>
                </thead>
                <tbody>
                    {ingredients.length > 0 ?
                        ingredients.map((ing) => (
                            <tr key={ing.item_id}>
                                <td>{ing.item}</td>
                                <td>
                                    <input type="checkbox"
                                        checked={ing.must}
                                        onChange={(e) => handleCheckChange(e.target.checked, ing.item_id)}
                                        className="ing_checkbox"
                                    />
                                </td>
                                <td>
                                    <input type="text"
                                        value={ing.sub}
                                        onChange={(e) => handleSubChange(e.target.value, ing.item_id)}
                                        className='sub_textbox'
                                    />
                                </td>
                                {/* TODO: make delete button a trash can */}
                                <td>
                                    <input type="button"
                                        onClick={() => handleDelete(ing.item_id)}
                                        className="ing_delete"
                                    />
                                </td>
                            </tr>
                        ))
                        : <tr>
                            <td colSpan={3}>No ingredients found.</td>
                        </tr>
                    }
                </tbody>
            </table>
            {/* {addIngModal ? 
            // TODO: ADD INGREDIENT MODAL
            : <button onClick={}>Add Ingredient</button>} */}
        </div>
    </>
  )
}
