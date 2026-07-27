import '../styles/ReviewIngredients.css'
// import { useState } from 'react';

type Ingredient = {
    item: string;
    item_id: number;
    must: boolean;
    sub: string;
}

interface ReviewIngredientsProps {
    ingredients: Ingredient[];
    setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
}

// TODO: be able to search for and add ingredients not listed

export default function ReviewIngredients({ingredients, setIngredients}: ReviewIngredientsProps) {
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
    

  return (
    <>
        <div className="review_card">
            <h1>Review Ingredients</h1>
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
                                {/* make delete button a trash can */}
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
            // ADD INGREDIENT MODAL
            : <button onClick={}>Add Ingredient</button>} */}
        </div>
    </>
  )
}
