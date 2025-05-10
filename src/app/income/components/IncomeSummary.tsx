'use client';

import { useEffect, useState } from 'react';
import { formatCurrency } from '@/utils/formatters';

interface IncomeSummaryProps {
    selectedMonth: string;
}

interface Summary {
    totalIncome: number;
    totalEntries: number;
    averageIncome: number;
}

export default function IncomeSummary({ selectedMonth }: IncomeSummaryProps) {
    const [summary, setSummary] = useState<Summary>({
        totalIncome: 0,
        totalEntries: 0,
        averageIncome: 0,
    });

    useEffect(() => {
        fetchSummary();
    }, [selectedMonth]);

    const fetchSummary = async () => {
        try {
            const response = await fetch(`/api/income?month=${selectedMonth}`);
            const data = await response.json();
            
            const totalIncome = data.reduce((sum: number, item: any) => {
                const amount = Number(item.amount);
                return sum + (isNaN(amount) ? 0 : amount);
            }, 0);
            
            const totalEntries = data.length;
            const averageIncome = totalEntries > 0 ? totalIncome / totalEntries : 0;

            setSummary({
                totalIncome,
                totalEntries,
                averageIncome,
            });
        } catch (error) {
            console.error('Error fetching summary:', error);
            setSummary({
                totalIncome: 0,
                totalEntries: 0,
                averageIncome: 0,
            });
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Income</h3>
                <p className="text-3xl font-bold text-teal-600">
                    {formatCurrency(summary.totalIncome || 0)}
                </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Entries</h3>
                <p className="text-3xl font-bold text-teal-600">
                    {summary.totalEntries}
                </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Average Income</h3>
                <p className="text-3xl font-bold text-teal-600">
                    {formatCurrency(summary.averageIncome || 0)}
                </p>
            </div>
        </div>
    );
} 