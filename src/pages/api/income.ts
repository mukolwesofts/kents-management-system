import { NextApiRequest, NextApiResponse } from 'next';
import { getAllIncome, addIncome, updateIncome, deleteIncome, IncomeError } from '@/services/incomeService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        switch (req.method) {
            case 'GET': {
                const month = req.query.month as string;
                const income = await getAllIncome(month ? new Date(month) : undefined);
                res.status(200).json(income);
                break;
            }
            case 'POST': {
                const income = req.body;
                // Convert month string to Date object
                if (income.month) {
                    income.month = new Date(income.month);
                }
                await addIncome(income);
                res.status(201).json({ message: 'Income added successfully' });
                break;
            }
            case 'PUT': {
                const { id, ...income } = req.body;
                // Convert month string to Date object
                if (income.month) {
                    income.month = new Date(income.month);
                }
                await updateIncome(id, income);
                res.status(200).json({ message: 'Income updated successfully' });
                break;
            }
            case 'DELETE': {
                const { id } = req.query;
                if (!id) {
                    return res.status(400).json({ message: 'ID is required' });
                }
                await deleteIncome(Number(id));
                res.status(200).json({ message: 'Income deleted successfully' });
                break;
            }
            default:
                res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
                res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error: unknown) {
        console.error('API Error:', error);
        
        if (error instanceof IncomeError) {
            return res.status(400).json({ message: error.message });
        }
        
        res.status(500).json({ 
            message: 'Internal Server Error',
            error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
    }
}