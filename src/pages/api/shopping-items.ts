import { NextApiRequest, NextApiResponse } from 'next';
import { getAllShoppingItems, addShoppingItem, updateShoppingItem, deleteShoppingItem, ShoppingServiceError } from '@/services/shoppingService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        switch (req.method) {
            case 'GET': {
                const { month } = req.query;
                const items = await getAllShoppingItems(month as string);
                res.status(200).json(items);
                break;
            }
            case 'POST': {
                const item = req.body;
                await addShoppingItem(item);
                res.status(201).json({ message: 'Shopping item added successfully' });
                break;
            }
            case 'PUT': {
                const { id, ...item } = req.body;
                await updateShoppingItem(id, item);
                res.status(200).json({ message: 'Shopping item updated successfully' });
                break;
            }
            case 'DELETE': {
                const { id } = req.query;
                await deleteShoppingItem(Number(id));
                res.status(200).json({ message: 'Shopping item deleted successfully' });
                break;
            }
            default:
                res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
                res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error('API Error:', error);
        
        if (error instanceof ShoppingServiceError) {
            res.status(500).json({
                message: error.message,
                code: error.code,
                details: error.details
            });
        } else {
            res.status(500).json({
                message: 'Internal Server Error',
                code: 'UNKNOWN_ERROR',
                details: error instanceof Error ? error.message : 'Unknown error occurred'
            });
        }
    }
} 