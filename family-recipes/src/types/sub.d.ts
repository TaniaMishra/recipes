export {};

declare global {
    interface Item {
        sub_id: number;
        recipe_id: number;
        ingredient: number;
        sub: string;
    }
}