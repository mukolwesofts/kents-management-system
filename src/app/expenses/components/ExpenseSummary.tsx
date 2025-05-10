'use client';

import { Expense } from '@/services/expenseService';
import Shimmer from '@/components/Shimmer';
import { formatCurrency } from '@/utils/formatters';

interface ExpenseSummaryProps {
    items: Expense[];
    isLoading?: boolean;
}

export default function ExpenseSummary({ items, isLoading = false }: ExpenseSummaryProps) {
    if (isLoading) {
        return <Shimmer type="summary" />;
    }

    const totalEstimated = items.reduce((sum, item) => {
        const amount = typeof item.estimated_amount === 'string' 
            ? parseFloat(item.estimated_amount) 
            : item.estimated_amount;
        return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    const totalActual = items.reduce((sum, item) => {
        const amount = typeof item.actual_amount === 'string' 
            ? parseFloat(item.actual_amount) 
            : (item.actual_amount || 0);
        return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    const completedCount = items.filter(item => item.completed_at).length;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Total Estimated</h3>
                <p className="text-lg font-bold text-teal-600">
                    {formatCurrency(totalEstimated)}
                </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Total Actual</h3>
                <p className="text-lg font-bold text-teal-600">
                    {formatCurrency(totalActual)}
                </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Completed</h3>
                <p className="text-lg font-bold text-teal-600">
                    {completedCount} / {items.length}
                </p>
            </div>
        </div>
    );
} 