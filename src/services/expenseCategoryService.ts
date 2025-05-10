import pool from '@/utils/db';

export interface ExpenseCategory {
    id?: number;
    name: string;
}

export async function getAllExpenseCategories(): Promise<ExpenseCategory[]> {
    const [rows] = await pool.query('SELECT * FROM expense_categories ORDER BY name');
    return rows as ExpenseCategory[];
}

export async function createExpenseCategory(category: ExpenseCategory): Promise<ExpenseCategory> {
    const [result] = await pool.query(
        'INSERT INTO expense_categories (name) VALUES (?)',
        [category.name]
    );
    return { id: (result as any).insertId, ...category };
}

export async function updateExpenseCategory(category: ExpenseCategory): Promise<void> {
    await pool.query(
        'UPDATE expense_categories SET name = ? WHERE id = ?',
        [category.name, category.id]
    );
}

export async function deleteExpenseCategory(id: number): Promise<void> {
    await pool.query('DELETE FROM expense_categories WHERE id = ?', [id]);
} 