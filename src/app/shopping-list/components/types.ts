export interface ShoppingItem {
    id: number;
    name: string;
    quantity: number;
    estimated_price: number;
    notes?: string;
    category_id: number;
    category_name: string;
    month: string;
}

export interface ShoppingCategory {
    id: number;
    name: string;
} 