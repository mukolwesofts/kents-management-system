'use client';

import { useState, useEffect } from 'react';
import Table from '@/components/Table';
import SearchInput from '@/components/SearchInput';
import Modal from '@/components/Modal';
import ExpenseForm from './ExpenseForm';
import ExpenseCategoryForm from './ExpenseCategoryForm';
import ExpenseSummary from './ExpenseSummary';
import Shimmer from '@/components/Shimmer';
import { Expense } from '@/services/expenseService';
import { ExpenseCategory } from '@/services/expenseCategoryService';
import { formatCurrency } from '@/utils/formatters';

export default function ExpensesList() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [categories, setCategories] = useState<ExpenseCategory[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [currentExpense, setCurrentExpense] = useState<Expense | null>(null);
    const [currentCategory, setCurrentCategory] = useState<ExpenseCategory | null>(null);
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    });
    const [refreshKey, setRefreshKey] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchExpenses();
        fetchCategories();
    }, [selectedMonth]);

    const fetchExpenses = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/expenses?month=${selectedMonth}`);
            const data = await response.json();
            setExpenses(data);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/expense-categories');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleAddOrUpdate = async (expense: Omit<Expense, 'id'>) => {
        if (currentExpense) {
            // Update existing expense
            await fetch(`/api/expenses`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: currentExpense.id, ...expense }),
            });
        } else {
            // Add new expense
            await fetch('/api/expenses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(expense),
            });
        }
        fetchExpenses();
        handleClose();
    };

    const handleAddOrUpdateCategory = async (category: Omit<ExpenseCategory, 'id'>) => {
        if (currentCategory) {
            // Update existing category
            await fetch(`/api/expense-categories`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: currentCategory.id, ...category }),
            });
        } else {
            // Add new category
            await fetch('/api/expense-categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(category),
            });
        }
        fetchCategories();
        handleCloseCategoryModal();
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setCurrentExpense(null);
    };

    const handleCloseCategoryModal = () => {
        setIsCategoryModalOpen(false);
        setCurrentCategory(null);
    };

    const handleOpen = (expense?: Expense) => {
        setCurrentExpense(expense || null);
        setIsModalOpen(true);
    };

    const handleOpenCategoryModal = (category?: ExpenseCategory) => {
        setCurrentCategory(category || null);
        setIsCategoryModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        await fetch(`/api/expenses?id=${id}`, { method: 'DELETE' });
        fetchExpenses();
    };

    const handleDeleteCategory = async (id: number) => {
        await fetch(`/api/expense-categories?id=${id}`, { method: 'DELETE' });
        fetchCategories();
    };

    const handleToggleCompletion = async (id: number, completed: boolean) => {
        await fetch(`/api/expenses/${id}/toggle-completion`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed }),
        });
        fetchExpenses();
    };

    const columns = [
        {
            header: 'Category',
            accessor: 'category_name' as keyof Expense,
        },
        {
            header: 'Name',
            accessor: 'name' as keyof Expense,
        },
        {
            header: 'Estimated Amount',
            accessor: 'estimated_amount' as keyof Expense,
            render: (item: Expense) => (
                <span>{formatCurrency(item.estimated_amount)}</span>
            ),
        },
        {
            header: 'Actual Amount',
            accessor: 'actual_amount' as keyof Expense,
            render: (item: Expense) => (
                <span>{item.actual_amount ? formatCurrency(item.actual_amount) : '-'}</span>
            ),
        },
        {
            header: 'Status',
            accessor: 'completed_at' as keyof Expense,
            render: (item: Expense) => (
                <input
                    type="checkbox"
                    checked={!!item.completed_at}
                    onChange={(e) => handleToggleCompletion(item.id!, e.target.checked)}
                    className="form-checkbox h-4 w-4 text-teal-600"
                    disabled={!item.actual_amount}
                    title={!item.actual_amount ? "Add actual amount before marking as completed" : ""}
                />
            ),
        },
    ];

    const actions = [
        {
            label: 'Edit',
            onClick: (item: Expense) => handleOpen(item),
            className: 'text-blue-500',
        },
        {
            label: 'Delete',
            onClick: (item: Expense) => handleDelete(item.id!),
            className: 'text-red-500',
        },
    ];

    return (
        <div className="space-y-8">
            <ExpenseSummary items={expenses} isLoading={isLoading} />
            
            <div className="flex items-center justify-between">
                {/* Search and Filter Inputs */}
                <div className="flex gap-4 items-center">
                    <div className="w-auto min-w-[300px]">
                        <SearchInput
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder="Search expenses..."
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

                {/* Add buttons */}
                <div className="flex gap-2">
                    <Modal
                        isOpen={isCategoryModalOpen}
                        onClose={handleCloseCategoryModal}
                        trigger={
                            <button
                                onClick={() => handleOpenCategoryModal()}
                                className="btn-secondary"
                            >
                                Add Category
                            </button>
                        }
                        title={currentCategory ? 'Edit Category' : 'Add Category'}
                    >
                        <ExpenseCategoryForm
                            initialData={currentCategory || undefined}
                            onSubmit={handleAddOrUpdateCategory}
                        />
                    </Modal>

                    <Modal
                        isOpen={isModalOpen}
                        onClose={handleClose}
                        trigger={
                            <button
                                onClick={() => handleOpen()}
                                className="btn"
                            >
                                Add Expense
                            </button>
                        }
                        title={currentExpense ? 'Edit Expense' : 'Add Expense'}
                    >
                        <ExpenseForm
                            initialData={currentExpense || undefined}
                            onSubmit={handleAddOrUpdate}
                        />
                    </Modal>
                </div>
            </div>

            {/* Expenses table */}
            {isLoading ? (
                <Shimmer type="table" rows={5} columns={columns.length + 1} />
            ) : (
                <Table
                    columns={columns}
                    data={expenses}
                    searchTerm={searchTerm}
                    searchFields={['name', 'category_name']}
                    actions={actions}
                />
            )}
        </div>
    );
} 