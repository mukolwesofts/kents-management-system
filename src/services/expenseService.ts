import pool from '@/utils/db';

export interface Expense {
    id?: number;
    category_id: number;
    category_name?: string;
    name: string;
    estimated_amount: number;
    actual_amount?: number;
    completed_at?: Date | null;
}

export async function getAllExpenses(month?: Date): Promise<Expense[]> {
    try {
        let query = `
            SELECT e.*, ec.name as category_name 
            FROM expenses e
            JOIN expense_categories ec ON e.category_id = ec.id
        `;

        const params: any[] = [];

        if (month) {
            query += `
                WHERE YEAR(e.created_at) = ? AND MONTH(e.created_at) = ?
            `;
            params.push(month.getFullYear(), month.getMonth() + 1);
        }

        query += ` ORDER BY e.created_at DESC`;

        const [rows] = await pool.query(query, params);
        return rows as Expense[];
    } catch (error) {
        console.error('Error fetching expenses:', error);
        throw error;
    }
}

export async function getExpenseById(id: number): Promise<Expense | null> {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM expenses WHERE id = ?',
            [id]
        );
        return (rows as Expense[])[0] || null;
    } catch (error) {
        console.error('Error fetching expense by id:', error);
        throw error;
    }
}

export async function createExpense(expense: Expense): Promise<Expense> {
    try {
        const [result] = await pool.query(
            'INSERT INTO expenses (category_id, name, estimated_amount, actual_amount, completed_at) VALUES (?, ?, ?, ?, ?)',
            [expense.category_id, expense.name, expense.estimated_amount, expense.actual_amount, expense.completed_at]
        );
        return { id: (result as any).insertId, ...expense };
    } catch (error) {
        console.error('Error creating expense:', error);
        throw error;
    }
}

export async function updateExpense(expense: Expense): Promise<void> {
    try {
        await pool.query(
            'UPDATE expenses SET category_id = ?, name = ?, estimated_amount = ?, actual_amount = ?, completed_at = ? WHERE id = ?',
            [expense.category_id, expense.name, expense.estimated_amount, expense.actual_amount, expense.completed_at, expense.id]
        );
    } catch (error) {
        console.error('Error updating expense:', error);
        throw error;
    }
}

export async function deleteExpense(id: number): Promise<void> {
    try {
        await pool.query('DELETE FROM expenses WHERE id = ?', [id]);
    } catch (error) {
        console.error('Error deleting expense:', error);
        throw error;
    }
}

export async function toggleExpenseCompletion(id: number, completed: boolean): Promise<void> {
    try {
        const completed_at = completed ? new Date() : null;
        await pool.query(
            'UPDATE expenses SET completed_at = ? WHERE id = ?',
            [completed_at, id]
        );
    } catch (error) {
        console.error('Error toggling expense completion:', error);
        throw error;
    }
} 