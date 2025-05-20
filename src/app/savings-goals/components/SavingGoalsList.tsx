'use client';

import { useState, useEffect } from 'react';
import Table from '@/components/Table';
import SearchInput from '@/components/SearchInput';
import Modal from '@/components/Modal';
import SavingGoalsForm from './SavingGoalsForm';
import SavingGoalsSummary from './SavingGoalsSummary';
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

export default function SavingGoalsList() {
    const [goals, setGoals] = useState<SavingGoal[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentGoal, setCurrentGoal] = useState<SavingGoal | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchGoals();
    }, []);

    const fetchGoals = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/saving-goals');
            const data = await response.json();
            setGoals(data);
        } catch (error) {
            console.error('Error fetching saving goals:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddOrUpdate = async (goalData: Omit<SavingGoal, 'id' | 'family_member_name' | 'family_member_designation'>) => {
        try {
            if (currentGoal) {
                // Update existing goal
                await fetch(`/api/saving-goals`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: currentGoal.id, ...goalData }),
                });
            } else {
                // Add new goal
                await fetch('/api/saving-goals', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(goalData),
                });
            }
            await fetchGoals();
            setRefreshKey(prev => prev + 1);
            handleClose();
        } catch (error) {
            console.error('Error saving goal:', error);
        }
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setCurrentGoal(null);
    };

    const handleOpen = (goal?: SavingGoal) => {
        setCurrentGoal(goal || null);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        try {
            await fetch(`/api/saving-goals?id=${id}`, { method: 'DELETE' });
            await fetchGoals();
            setRefreshKey(prev => prev + 1);
        } catch (error) {
            console.error('Error deleting saving goal:', error);
        }
    };

    const columns = [
        { header: 'Family Member', accessor: 'family_member_name' as const },
        { header: 'Designation', accessor: 'family_member_designation' as const },
        { header: 'Name', accessor: 'name' as const },
        { header: 'Type', accessor: 'goal_type' as const },
        {
            header: 'Target Amount',
            accessor: 'target_amount' as const,
            render: (item: SavingGoal) => (
                <span>{formatCurrency(item.target_amount)}</span>
            ),
        },
        {
            header: 'Start Date',
            accessor: 'start_date' as const,
            render: (item: SavingGoal) => (
                <span>{new Date(item.start_date).toLocaleDateString()}</span>
            ),
        },
        {
            header: 'End Date',
            accessor: 'end_date' as const,
            render: (item: SavingGoal) => (
                <span>{item.end_date ? new Date(item.end_date).toLocaleDateString() : '-'}</span>
            ),
        },
        {
            header: 'Status',
            accessor: 'status' as const,
            render: (item: SavingGoal) => (
                <span className={`px-2 py-1 rounded-full text-xs ${item.status === 'active' ? 'bg-green-100 text-green-800' :
                        item.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            item.status === 'hold' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                    }`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
            ),
        },
    ];

    const actions = [
        {
            label: 'Edit',
            onClick: (item: SavingGoal) => handleOpen(item),
            className: 'text-blue-500',
        },
        {
            label: 'Delete',
            onClick: (item: SavingGoal) => handleDelete(item.id),
            className: 'text-red-500',
        },
    ];

    return (
        <div className="space-y-8">
            <SavingGoalsSummary items={goals} isLoading={isLoading} />

            <div className="flex items-center justify-between">
                <div className="max-w-md w-full">
                    <SearchInput
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Search saving goals..."
                    />
                </div>

                <Modal
                    isOpen={isModalOpen}
                    onClose={handleClose}
                    trigger={
                        <button
                            onClick={() => handleOpen()}
                            className="btn btn-primary"
                        >
                            Add Saving Goal
                        </button>
                    }
                    title={currentGoal ? 'Edit Saving Goal' : 'Add Saving Goal'}
                >
                    <SavingGoalsForm
                        initialData={currentGoal || undefined}
                        onSubmit={(data) => {
                            handleAddOrUpdate(data);
                        }}
                    />
                </Modal>
            </div>

            {isLoading ? (
                <Shimmer type="table" rows={5} columns={columns.length + 1} />
            ) : (
                <Table
                    columns={columns}
                    data={goals}
                    searchTerm={searchTerm}
                    searchFields={['family_member_name', 'name', 'goal_type']}
                    actions={actions}
                />
            )}
        </div>
    );
}