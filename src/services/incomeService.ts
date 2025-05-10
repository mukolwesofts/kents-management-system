import pool from '@/utils/db';
import { FamilyMember } from './familyMemberService';

export interface Income {
    id?: number;
    family_member_id: number;
    source: string;
    amount: number;
    month: Date;
    family_member?: FamilyMember;
}

export class IncomeError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'IncomeError';
    }
}

export async function getAllIncome(month?: Date): Promise<Income[]> {
    try {
        let query = `
            SELECT i.*, f.name as family_member_name, f.designation as family_member_designation 
            FROM income i
            LEFT JOIN family_members f ON i.family_member_id = f.id
        `;
        
        const params: any[] = [];
        if (month) {
            query += ' WHERE DATE_FORMAT(i.month, "%Y-%m") = DATE_FORMAT(?, "%Y-%m")';
            params.push(month);
        }
        
        query += ' ORDER BY i.month DESC';
        
        const [rows] = await pool.query(query, params);
        return rows as Income[];
    } catch (error) {
        console.error('Error fetching income:', error);
        throw new IncomeError('Failed to fetch income records');
    }
}

export async function addIncome(income: Income): Promise<void> {
    try {
        const { family_member_id, source, amount, month } = income;
        
        // Validate required fields
        if (!family_member_id || !source || !amount || !month) {
            throw new IncomeError('All fields are required');
        }

        // Validate amount
        if (amount <= 0) {
            throw new IncomeError('Amount must be greater than 0');
        }

        // Validate month format
        if (!(month instanceof Date) || isNaN(month.getTime())) {
            throw new IncomeError('Invalid month format');
        }

        await pool.query(
            'INSERT INTO income (family_member_id, source, amount, month) VALUES (?, ?, ?, ?)',
            [family_member_id, source, amount, month]
        );
    } catch (error) {
        if (error instanceof IncomeError) {
            throw error;
        }
        console.error('Error adding income:', error);
        throw new IncomeError('Failed to add income record');
    }
}

export async function updateIncome(id: number, income: Income): Promise<void> {
    try {
        const { family_member_id, source, amount, month } = income;

        // Validate required fields
        if (!family_member_id || !source || !amount || !month) {
            throw new IncomeError('All fields are required');
        }

        // Validate amount
        if (amount <= 0) {
            throw new IncomeError('Amount must be greater than 0');
        }

        // Validate month format
        if (!(month instanceof Date) || isNaN(month.getTime())) {
            throw new IncomeError('Invalid month format');
        }

        await pool.query(
            'UPDATE income SET family_member_id = ?, source = ?, amount = ?, month = ? WHERE id = ?',
            [family_member_id, source, amount, month, id]
        );
    } catch (error) {
        if (error instanceof IncomeError) {
            throw error;
        }
        console.error('Error updating income:', error);
        throw new IncomeError('Failed to update income record');
    }
}

export async function deleteIncome(id: number): Promise<void> {
    try {
        if (!id) {
            throw new IncomeError('Income ID is required');
        }

        await pool.query('DELETE FROM income WHERE id = ?', [id]);
    } catch (error) {
        if (error instanceof IncomeError) {
            throw error;
        }
        console.error('Error deleting income:', error);
        throw new IncomeError('Failed to delete income record');
    }
} 