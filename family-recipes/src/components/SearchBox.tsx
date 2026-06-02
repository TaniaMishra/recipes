import { useState } from "react";
import "../styles/SearchBox.css"

interface SearchBoxProps {
    onSearch: (query: string) => void;
    placeholder?: string;
}
export function SearchBox({onSearch, placeholder = "Search..."}: SearchBoxProps) {
    const [query, setQuery] = useState<string>("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        onSearch(value);
    }

    return (
        <input type="text"
            value={query}
            onChange={handleChange}
            placeholder={placeholder}
            className="search_input"
        />
    )
}