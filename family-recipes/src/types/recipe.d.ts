export {};

declare global {
    interface Recipe {
        recipe_id: number;
        date_created?: Date;
        name: string;
        ver: string;
        author: string;
        key_proportions: string;
        servings: number;
        must_items: number[];
        body: string[];
        tags?: tag[];
    }
}