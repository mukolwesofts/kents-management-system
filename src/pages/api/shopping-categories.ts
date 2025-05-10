import { NextApiRequest, NextApiResponse } from 'next';
import { getAllShoppingCategories, addShoppingCategory, updateShoppingCategory, deleteShoppingCategory, ShoppingServiceError } from '@/services/shoppingService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        switch (req.method) {
            case 'GET': {
                const categories = await getAllShoppingCategories();
                res.status(200).json(categories);
                break;
            }
            case 'POST': {
                const category = req.body;
                await addShoppingCategory(category);
                res.status(201).json({ message: 'Shopping category added successfully' });
                break;
            }
            case 'PUT': {
                const { id, ...category } = req.body;
                await updateShoppingCategory(id, category);
                res.status(200).json({ message: 'Shopping category updated successfully' });
                break;
            }
            case 'DELETE': {
                const { id } = req.query;
                await deleteShoppingCategory(Number(id));
                res.status(200).json({ message: 'Shopping category deleted successfully' });
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