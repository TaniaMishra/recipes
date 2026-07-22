import { uuid } from "./uuid";

export {};

declare global {
    interface Recipe {
        recipe_id: number;
        date_created: Date;
        name: string;
        ver: string;
        author: uuid;
        key_proportions: string;
        servings: number;
        must_items: number[];
        body: string[];
        tags?: string[];
    }
}