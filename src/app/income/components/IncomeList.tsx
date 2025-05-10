'use client';

import { useState, useEffect } from 'react';
import Table from '@/components/Table';
import SearchInput from '@/components/SearchInput';
import Modal from '@/components/Modal';
import IncomeForm from './IncomeForm';
import IncomeSummary from './IncomeSummary';
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

export default function IncomeList() {
    const [income, setIncome] = useState<Income[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentIncome, setCurrentIncome] = useState<Income | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<string>(
        new Date().toISOString().slice(0, 7)
    );
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        fetchIncome();
    }, [selectedMonth]);

    const fetchIncome = async () => {
        const response = await fetch(`/api/income?month=${selectedMonth}`);
        const data = await response.json();
        setIncome(data);
    };

    const handleAddOrUpdate = async (incomeData: Omit<Income, 'id' | 'family_member_name' | 'family_member_designation'>) => {
        try {
            if (currentIncome) {
                // Update existing income
                await fetch(`/api/income`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: currentIncome.id, ...incomeData }),
                });
            } else {
                // Add new income
                await fetch('/api/income', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(incomeData),
                });
            }
            await fetchIncome();
            setRefreshKey(prev => prev + 1);
            handleClose();
        } catch (error) {
            console.error('Error saving income:', error);
        }
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setCurrentIncome(null);
    };

    const handleOpen = (income?: Income) => {
        setCurrentIncome(income || null);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        try {
            await fetch(`/api/income?id=${id}`, { method: 'DELETE' });
            await fetchIncome();
            setRefreshKey(prev => prev + 1);
        } catch (error) {
            console.error('Error deleting income:', error);
        }
    };

    const columns = [
        { header: 'Family Member', accessor: 'family_member_name' as const },
        { header: 'Designation', accessor: 'family_member_designation' as const },
        { header: 'Source', accessor: 'source' as const },
        {
            header: 'Amount',
            accessor: 'amount' as const,
            render: (item: Income) => (
                <span>{formatCurrency(item.amount)}</span>
            ),
        },
        {
            header: 'Month',
            accessor: 'month' as const,
            render: (item: Income) => (
                <span>{new Date(item.month).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
            ),
        },
    ];

    const actions = [
        {
            label: 'Edit',
            onClick: (item: Income) => handleOpen(item),
            className: 'text-blue-500',
        },
        {
            label: 'Delete',
            onClick: (item: Income) => handleDelete(item.id),
            className: 'text-red-500',
        },
    ];

    return (
        <div className="space-y-8">
            <IncomeSummary selectedMonth={selectedMonth} key={refreshKey} />
            
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="max-w-md w-full">
                        <SearchInput
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder="Search income..."
                        />
                    </div>
                    <div>
                        <input
                            type="month"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="form-input"
                        />
                    </div>
                </div>

                <Modal
                    isOpen={isModalOpen}
                    onClose={handleClose}
                    trigger={
                        <button
                            onClick={() => handleOpen()}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                        >
                            Add Income
                        </button>
                    }
                    title={currentIncome ? 'Edit Income' : 'Add Income'}
                >
                    <IncomeForm
                        initialData={currentIncome || undefined}
                        selectedMonth={selectedMonth}
                        onSubmit={(data) => {
                            handleAddOrUpdate(data);
                        }}
                    />
                </Modal>
            </div>

            <Table
                columns={columns}
                data={income}
                searchTerm={searchTerm}
                searchFields={['family_member_name', 'source']}
                actions={actions}
            />
        </div>
    );
} 