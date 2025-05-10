'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { ExpenseCategory } from '@/services/expenseCategoryService';

const expenseSchema = z.object({
    category_id: z.number().min(1, 'Please select a category'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    estimated_amount: z.number().min(0, 'Amount must be positive'),
    actual_amount: z.number().min(0, 'Amount must be positive').optional(),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface ExpenseFormProps {
    initialData?: ExpenseFormData;
    onSubmit: (data: ExpenseFormData) => void;
}

export default function ExpenseForm({ initialData, onSubmit }: ExpenseFormProps) {
    const [categories, setCategories] = useState<ExpenseCategory[]>([]);
    const isEditMode = !!initialData;

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<ExpenseFormData>({
        resolver: zodResolver(expenseSchema),
        defaultValues: initialData,
    });

    const actualAmount = watch('actual_amount');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const response = await fetch('/api/expense-categories');
        const data = await response.json();
        setCategories(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 w-[700px]">
            <div className="gap-4 flex items-center w-full">
                <div className="w-1/2">
                    <label htmlFor="category_id" className="form-label">
                        Category
                    </label>
                    <select
                        id="category_id"
                        {...register('category_id', { valueAsNumber: true })}
                        className="form-select"
                    >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    {errors.category_id && (
                        <p className="form-error">{errors.category_id.message}</p>
                    )}
                </div>

                <div className="w-1/2">
                    <label htmlFor="name" className="form-label">
                        Expense Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        {...register('name')}
                        className="form-input"
                    />
                    {errors.name && (
                        <p className="form-error">{errors.name.message}</p>
                    )}
                </div>
            </div>

            <div className="gap-4 flex items-center w-full">
                <div className="w-1/2">
                    <label htmlFor="estimated_amount" className="form-label">
                        Estimated Amount
                    </label>
                    <input
                        type="number"
                        id="estimated_amount"
                        step="0.01"
                        {...register('estimated_amount', { valueAsNumber: true })}
                        className="form-input"
                        readOnly={isEditMode}
                    />
                    {errors.estimated_amount && (
                        <p className="form-error">{errors.estimated_amount.message}</p>
                    )}
                </div>

                {isEditMode && (
                    <div className="w-1/2">
                        <label htmlFor="actual_amount" className="form-label">
                            Actual Amount
                        </label>
                        <input
                            type="number"
                            id="actual_amount"
                            step="0.01"
                            {...register('actual_amount', { valueAsNumber: true })}
                            className="form-input"
                        />
                        {errors.actual_amount && (
                            <p className="form-error">{errors.actual_amount.message}</p>
                        )}
                    </div>
                )}
            </div>

            <div className="flex justify-end space-x-3">
                <button
                    type="submit"
                    className="form-button"
                >
                    {isEditMode ? 'Update' : 'Create'}
                </button>
            </div>
        </form>
    );
} 