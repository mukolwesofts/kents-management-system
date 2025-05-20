'use client';

import Shimmer from '@/components/Shimmer';
import { formatCurrency } from '@/utils/formatters';

interface SavingGoal {
    id: number;
    family_member_id: number;
    family_member_name: string;
    family_member_designation: string;
    name: string;
    description?: string;
    start_date: string;
    end_date?: string;
    target_amount: number;
    goal_type: string;
    status: string;
}

interface SavingGoalsSummaryProps {
    items: SavingGoal[];
    isLoading?: boolean;
}

export default function SavingGoalsSummary({ items, isLoading = false }: SavingGoalsSummaryProps) {
    if (isLoading) {
        return <Shimmer type="summary" />;
    }

    const totalTargetAmount = items.reduce((sum, item) => {
        const amount = typeof item.target_amount === 'string' 
            ? parseFloat(item.target_amount) 
            : item.target_amount;
        return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    const activeGoals = items.filter(item => item.status === 'active').length;
    const completedGoals = items.filter(item => item.status === 'completed').length;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-end justify-between">
                    <div>
                        <h2 className="text-base font-semibold text-gray-700">Total Target Amount</h2>
                        <p className="text-2xl font-bold text-teal-600">{formatCurrency(totalTargetAmount)}</p>
                    </div>
                    <div className="text-gray-500 text-sm">
                        <p>{items.length} saving goals</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-end justify-between">
                    <div>
                        <h2 className="text-base font-semibold text-gray-700">Active Goals</h2>
                        <p className="text-2xl font-bold text-green-600">{activeGoals}</p>
                    </div>
                    <div className="text-gray-500 text-sm">
                        <p>Currently active</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-end justify-between">
                    <div>
                        <h2 className="text-base font-semibold text-gray-700">Completed Goals</h2>
                        <p className="text-2xl font-bold text-blue-600">{completedGoals}</p>
                    </div>
                    <div className="text-gray-500 text-sm">
                        <p>Successfully achieved</p>
                    </div>
                </div>
            </div>
        </div>
    );
}