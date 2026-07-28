export {};

declare global {
    interface Ingredient {
        item: string;
        item_id: number;
        must: boolean;
        sub: string;
    }
}