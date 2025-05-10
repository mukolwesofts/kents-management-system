'use client';

import { useState, useEffect } from 'react';
import Shimmer from '@/components/Shimmer';
import { formatCurrency } from '@/utils/formatters';
import { FiTrendingUp, FiTrendingDown, FiPieChart, FiDollarSign } from 'react-icons/fi';

interface SummaryData {
    totalIncome: number;
    totalExpenses: number;
    netBalance: number;
}

export default function DashboardSummary() {
    const [summary, setSummary] = useState<SummaryData>({
        totalIncome: 0,
        totalExpenses: 0,
        netBalance: 0
    });
    const [isLoading, setIsLoading] = useState(true);
    const dummySavings = 1000;

    useEffect(() => {
        fetchSummaryData();
    }, []);

    const fetchSummaryData = async () => {
        setIsLoading(true);
        try {
            const currentMonth = new Date().toISOString().slice(0, 7);
            // Fetch income data
            const incomeResponse = await fetch(`/api/income?month=${currentMonth}`);
            const incomeData = await incomeResponse.json();
            const totalIncome = incomeData.reduce((sum: number, item: any) => {
                const amount = typeof item.amount === 'string' ? parseFloat(item.amount) : item.amount;
                return sum + (isNaN(amount) ? 0 : amount);
            }, 0);
            // Fetch expenses data
            const expensesResponse = await fetch(`/api/expenses?month=${currentMonth}`);
            const expensesData = await expensesResponse.json();
            const totalExpenses = expensesData.reduce((sum: number, item: any) => {
                const amount = typeof item.actual_amount === 'string' 
                    ? parseFloat(item.actual_amount) 
                    : (item.actual_amount || 0);
                return sum + (isNaN(amount) ? 0 : amount);
            }, 0);
            setSummary({
                totalIncome,
                totalExpenses,
                netBalance: totalIncome - totalExpenses
            });
        } catch (error) {
            console.error('Error fetching summary data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, index) => (
                    <Shimmer key={index} type="card" />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                <FiTrendingUp className="w-5 h-5 text-teal-500 mb-1" />
                <span className="text-base font-medium text-gray-700">Total Income</span>
                <span className="text-xl font-bold text-teal-600 mt-2">
                    {formatCurrency(summary.totalIncome)}
                </span>
            </div>
            <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                <FiTrendingDown className="w-5 h-5 text-yellow-500 mb-1" />
                <span className="text-base font-medium text-gray-700">Total Expenses</span>
                <span className="text-xl font-bold text-yellow-600 mt-2">
                    {formatCurrency(summary.totalExpenses)}
                </span>
            </div>
            <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                <FiPieChart className="w-5 h-5 text-blue-500 mb-1" />
                <span className="text-base font-medium text-gray-700">Net Balance</span>
                <span className="text-xl font-bold text-blue-600 mt-2">
                    {formatCurrency(summary.netBalance)}
                </span>
            </div>
            <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                <FiDollarSign className="w-5 h-5 text-green-500 mb-1" />
                <span className="text-base font-medium text-gray-700">Total Savings</span>
                <span className="text-xl font-bold text-green-600 mt-2">
                    {formatCurrency(dummySavings)}
                </span>
            </div>
        </div>
    );
} 