'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';

const shoppingItemSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
    estimated_price: z.number().min(0, 'Price must be 0 or greater'),
    notes: z.string(),
    category_id: z.number().min(1, 'Please select a category'),
    month: z.string().min(1, 'Please select a month'),
});

type ShoppingItemFormData = z.infer<typeof shoppingItemSchema>;

interface ShoppingItemFormProps {
    initialData?: Partial<ShoppingItemFormData>;
    onSubmit: (data: ShoppingItemFormData) => void;
}

interface Category {
    id: number;
    name: string;
}

export default function ShoppingItemForm({ initialData, onSubmit }: ShoppingItemFormProps) {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const response = await fetch('/api/shopping-categories');
        const data = await response.json();
        setCategories(data);
    };

    const getMonthFromISO = (isoString: string) => {
        const date = new Date(isoString);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        return `${date.getFullYear()}-${month}`;
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ShoppingItemFormData>({
        resolver: zodResolver(shoppingItemSchema),
        defaultValues: {
            name: initialData?.name ?? '',
            quantity: initialData?.quantity ?? 1,
            estimated_price: initialData?.estimated_price ?? 0,
            notes: initialData?.notes ?? '',
            category_id: initialData?.category_id ? Number(initialData.category_id) : 0,
            month: initialData?.month 
                ? getMonthFromISO(initialData.month)
                : new Date().toISOString().slice(0, 7),
        },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 w-[700px]">
            <div className="gap-4 flex items-center w-full">
                <div className="w-full">
                    <label htmlFor="name" className="form-label">
                        Item Name
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

                <div className="w-full">
                    <label htmlFor="quantity" className="form-label">
                        Quantity
                    </label>
                    <input
                        type="number"
                        id="quantity"
                        {...register('quantity', { valueAsNumber: true })}
                        className="form-input"
                        min="1"
                    />
                    {errors.quantity && (
                        <p className="form-error">{errors.quantity.message}</p>
                    )}
                </div>
            </div>

            <div className="gap-4 flex items-center w-full">
                <div className="w-full">
                    <label htmlFor="estimated_price" className="form-label">
                        Estimated Price
                    </label>
                    <input
                        type="number"
                        id="estimated_price"
                        step="0.01"
                        {...register('estimated_price', { valueAsNumber: true })}
                        className="form-input"
                        min="0"
                    />
                    {errors.estimated_price && (
                        <p className="form-error">{errors.estimated_price.message}</p>
                    )}
                </div>

                <div className="w-full">
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
            </div>

            <div className="w-full">
                <label htmlFor="month" className="form-label">
                    Month
                </label>
                <input
                    type="month"
                    id="month"
                    {...register('month')}
                    className="form-input"
                />
                {errors.month && (
                    <p className="form-error">{errors.month.message}</p>
                )}
            </div>

            <div className="w-full">
                <label htmlFor="notes" className="form-label">
                    Notes
                </label>
                <textarea
                    id="notes"
                    {...register('notes')}
                    className="form-input"
                    rows={3}
                />
                {errors.notes && (
                    <p className="form-error">{errors.notes.message}</p>
                )}
            </div>

            <div className="flex justify-end space-x-3">
                <button
                    type="submit"
                    className="form-button"
                >
                    {initialData ? 'Update' : 'Create'}
                </button>
            </div>
        </form>
    );
} 