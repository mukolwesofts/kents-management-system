import pool from '@/utils/db';

export interface ShoppingCategory {
    id?: number;
    name: string;
}

export interface ShoppingItem {
    id?: number;
    name: string;
    quantity: number;
    estimated_price: number;
    notes?: string;
    category_id: number;
    month: Date;
}

export class ShoppingServiceError extends Error {
    constructor(message: string, public code: string, public details?: any) {
        super(message);
        this.name = 'ShoppingServiceError';
    }
}

export async function getAllShoppingCategories(): Promise<ShoppingCategory[]> {
    try {
        const [rows] = await pool.query('SELECT * FROM shopping_categories');
        return rows as ShoppingCategory[];
    } catch (error) {
        console.error('Error fetching shopping categories:', error);
        throw new ShoppingServiceError(
            'Failed to fetch shopping categories',
            'FETCH_CATEGORIES_ERROR',
            error
        );
    }
}

export async function addShoppingCategory(category: ShoppingCategory): Promise<void> {
    try {
        const { name } = category;
        await pool.query('INSERT INTO shopping_categories (name) VALUES (?)', [name]);
    } catch (error) {
        console.error('Error adding shopping category:', error);
        throw new ShoppingServiceError(
            'Failed to add shopping category',
            'ADD_CATEGORY_ERROR',
            { category, error }
        );
    }
}

export async function updateShoppingCategory(id: number, category: ShoppingCategory): Promise<void> {
    try {
        const { name } = category;
        await pool.query('UPDATE shopping_categories SET name = ? WHERE id = ?', [name, id]);
    } catch (error) {
        console.error('Error updating shopping category:', error);
        throw new ShoppingServiceError(
            'Failed to update shopping category',
            'UPDATE_CATEGORY_ERROR',
            { id, category, error }
        );
    }
}

export async function deleteShoppingCategory(id: number): Promise<void> {
    try {
        await pool.query('DELETE FROM shopping_categories WHERE id = ?', [id]);
    } catch (error) {
        console.error('Error deleting shopping category:', error);
        throw new ShoppingServiceError(
            'Failed to delete shopping category',
            'DELETE_CATEGORY_ERROR',
            { id, error }
        );
    }
}

export async function getAllShoppingItems(month?: string): Promise<(ShoppingItem & { category_name: string })[]> {
    try {
        let query = `
            SELECT si.*, sc.name as category_name 
            FROM shopping_items si 
            JOIN shopping_categories sc ON si.category_id = sc.id
        `;
        
        const params: any[] = [];
        
        if (month) {
            query += ` WHERE DATE_FORMAT(si.month, '%Y-%m') = ?`;
            params.push(month);
        }
        
        const [rows] = await pool.query(query, params);
        return rows as (ShoppingItem & { category_name: string })[];
    } catch (error) {
        console.error('Error fetching shopping items:', error);
        throw new ShoppingServiceError(
            'Failed to fetch shopping items',
            'FETCH_ITEMS_ERROR',
            error
        );
    }
}

export async function addShoppingItem(item: ShoppingItem): Promise<void> {
    try {
        const { name, quantity, estimated_price, notes, category_id, month } = item;
        // Ensure month is a full date by setting it to the first day of the month
        const fullDate = new Date(month);
        fullDate.setDate(1); // Set to first day of the month
        
        await pool.query(
            'INSERT INTO shopping_items (name, quantity, estimated_price, notes, category_id, month) VALUES (?, ?, ?, ?, ?, ?)',
            [name, quantity, estimated_price, notes, category_id, fullDate]
        );
    } catch (error) {
        console.error('Error adding shopping item:', error);
        throw new ShoppingServiceError(
            'Failed to add shopping item',
            'ADD_ITEM_ERROR',
            { item, error }
        );
    }
}

export async function updateShoppingItem(id: number, item: ShoppingItem): Promise<void> {
    try {
        const { name, quantity, estimated_price, notes, category_id, month } = item;
        // Ensure month is a full date by setting it to the first day of the month
        const fullDate = new Date(month);
        fullDate.setDate(1); // Set to first day of the month
        
        await pool.query(
            'UPDATE shopping_items SET name = ?, quantity = ?, estimated_price = ?, notes = ?, category_id = ?, month = ? WHERE id = ?',
            [name, quantity, estimated_price, notes, category_id, fullDate, id]
        );
    } catch (error) {
        console.error('Error updating shopping item:', error);
        throw new ShoppingServiceError(
            'Failed to update shopping item',
            'UPDATE_ITEM_ERROR',
            { id, item, error }
        );
    }
}

export async function deleteShoppingItem(id: number): Promise<void> {
    try {
        await pool.query('DELETE FROM shopping_items WHERE id = ?', [id]);
    } catch (error) {
        console.error('Error deleting shopping item:', error);
        throw new ShoppingServiceError(
            'Failed to delete shopping item',
            'DELETE_ITEM_ERROR',
            { id, error }
        );
    }
} 