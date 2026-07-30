import CreatableSelect from 'react-select/creatable';
import { useEffect, useState } from "react";
import { supabase } from '../lib/supabase';
import '../styles/TagBox.css';

type TagOption = {
    value: string;
    label: string;
}

interface TagBoxProps {
    selectedTags: string[];
    setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function TagBox({ selectedTags, setSelectedTags }: TagBoxProps) {
    const [allTags, setAllTags] = useState<TagOption[]>();

    const handleChange = (newValue: readonly TagOption[]) => {
        setSelectedTags(newValue.map(tag => tag.value));
    };

    const selectedOptions = selectedTags.map((tag) => ({
        value: tag,
        label: tag
    }))

    useEffect(() => {
        async function fetchTags() {
            const { data, error } = await supabase
                .from("tags")
                .select("desc");
            if (error) {
                console.log("ERROR FETCHING TAGS", error)
            } else if (data) {
                const uniqueTags = [...new Set(data.map((tag) => tag.desc))];
                setAllTags(uniqueTags.map(tag => ({
                    value: tag,
                    label: tag
                })))
            }
        }
        fetchTags();
    }, []);

    return (
        <CreatableSelect
            isMulti
            options={allTags}
            value={selectedOptions}
            onChange={handleChange}
            className='tag_box'
        />
    );
}