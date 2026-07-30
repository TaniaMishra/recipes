export {};

declare global {
    interface Profile {
        id: string;
        created_at: Date;
        email: string;
        display_name: string;
        saved_filters: string[];
        fav_recipes: number[];
        have_items: number[];
        low_items: number[];
        out_items: number[];
        must_items: number[];
        grocery_list: number[];
    }
}