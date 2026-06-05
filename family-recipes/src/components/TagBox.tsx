import CreatableSelect from 'react-select/creatable';
import { useEffect, useState } from "react";
import { supabase } from '../lib/supabase';

type TagOption = {
    value: string;
    label: string;
}

export default function TagBox() {
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [allTags, setAllTags] = useState<TagOption[]>();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedTags([...event.target.value]);
    };

    useEffect(() => {
        async function fetchTags() {
            const { data, error } = await supabase
                .from("tags")
                .select("desc");
            if (error) {
                console.log("ERROR FETCHING TAGS", error)
            } else if (data) {
                const uniqueTags = [...new Set(data)];
                setAllTags(uniqueTags.map(tag => ({
                    value: tag.desc,
                    label: tag.desc,
                })))
            }
        }
        fetchTags();
    }, []);

    return (
        <CreatableSelect
            isMulti
            options={allTags}
            // value={selectedTags}
            // onChange={handleChange}
        />
    );
}