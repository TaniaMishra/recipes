export {};

declare global {
    interface Recipe {
        recipe_id: number;
        date_created: Date;
        name: string;
        ver: string;
        bm1: string;
        bm2: string;
        bm3: string;
        must_items: number[];
        body: string;
        tags?: string[];
    }
}