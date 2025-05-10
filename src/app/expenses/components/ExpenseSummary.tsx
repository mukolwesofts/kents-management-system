'use client';

import { useEffect, useState } from 'react';
import { formatCurrency } from '@/utils/formatters';

interface ExpenseSummaryProps {
    selectedMonth: string;
}

interface Summary {
    totalEstimated: number;
    totalActual: number;
    totalEntries: number;
    completedEntries: number;
}

export default function ExpenseSummary({ selectedMonth }: ExpenseSummaryProps) {
    const [summary, setSummary] = useState<Summary>({
        totalEstimated: 0,
        totalActual: 0,
        totalEntries: 0,
        completedEntries: 0,
    });

    useEffect(() => {
        fetchSummary();
    }, [selectedMonth]);

    const fetchSummary = async () => {
        try {
            const response = await fetch(`/api/expenses?month=${selectedMonth}`);
            const data = await response.json();
            
            const totalEstimated = data.reduce((sum: number, item: any) => {
                const amount = Number(item.estimated_amount);
                return sum + (isNaN(amount) ? 0 : amount);
            }, 0);

            const totalActual = data.reduce((sum: number, item: any) => {
                const amount = Number(item.actual_amount || 0);
                return sum + (isNaN(amount) ? 0 : amount);
            }, 0);
            
            const totalEntries = data.length;
            const completedEntries = data.filter((item: any) => item.completed_at).length;

            setSummary({
                totalEstimated,
                totalActual,
                totalEntries,
                completedEntries,
            });
        } catch (error) {
            console.error('Error fetching expense summary:', error);
            setSummary({
                totalEstimated: 0,
                totalActual: 0,
                totalEntries: 0,
                completedEntries: 0,
            });
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Total Estimated</h3>
                <p className="text-lg font-bold text-teal-600">
                    {formatCurrency(summary.totalEstimated)}
                </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Total Actual</h3>
                <p className="text-lg font-bold text-teal-600">
                    {formatCurrency(summary.totalActual)}
                </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Total Entries</h3>
                <p className="text-lg font-bold text-teal-600">
                    {summary.totalEntries}
                </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Completed</h3>
                <p className="text-lg font-bold text-teal-600">
                    {summary.completedEntries}
                </p>
            </div>
        </div>
    );
} 