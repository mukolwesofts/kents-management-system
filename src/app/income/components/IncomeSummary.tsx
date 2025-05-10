'use client';

import Shimmer from '@/components/Shimmer';
import { formatCurrency } from '@/utils/formatters';

interface Income {
    id: number;
    family_member_id: number;
    family_member_name: string;
    family_member_designation: string;
    source: string;
    amount: number;
    month: string;
}

interface IncomeSummaryProps {
    items: Income[];
    isLoading?: boolean;
}

export default function IncomeSummary({ items, isLoading = false }: IncomeSummaryProps) {
    if (isLoading) {
        return <Shimmer type="summary" />;
    }

    const totalIncome = items.reduce((sum, item) => {
        const amount = typeof item.amount === 'string' 
            ? parseFloat(item.amount) 
            : item.amount;
        return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 max-w-sm">
            <div className="flex items-end justify-between">
                <div>
                    <h2 className="text-base font-semibold text-gray-700">Total Income</h2>
                    <p className="text-2xl font-bold text-teal-600">{formatCurrency(totalIncome)}</p>
                </div>
                <div className="text-gray-500 text-sm">
                    <p>{items.length} income entries</p>
                </div>
            </div>
        </div>
    );
} 