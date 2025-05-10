import { ShoppingItem } from './types';
import Shimmer from '@/components/Shimmer';

interface ShoppingListSummaryProps {
    items: ShoppingItem[];
    isLoading?: boolean;
}

export default function ShoppingListSummary({ items, isLoading = false }: ShoppingListSummaryProps) {
    if (isLoading) {
        return <Shimmer type="summary" />;
    }

    const totalEstimatedPrice = items.reduce((sum, item) => {
        const price = typeof item.estimated_price === 'string' 
            ? parseFloat(item.estimated_price) 
            : item.estimated_price;
        return sum + (isNaN(price) ? 0 : price);
    }, 0);

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 max-w-sm">
            <div className="flex items-end justify-between">
                <div>
                    <h2 className="text-base font-semibold text-gray-700">Total Estimated Price</h2>
                    <p className="text-2xl font-bold text-teal-600">Ksh {totalEstimatedPrice.toFixed(2)}</p>
                </div>
                <div className="text-gray-500 text-sm">
                    <p>{items.length} items in list</p>
                </div>
            </div>
        </div>
    );
} 