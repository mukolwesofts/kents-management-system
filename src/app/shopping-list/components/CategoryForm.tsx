'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const categorySchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
    initialData?: CategoryFormData;
    onSubmit: (data: CategoryFormData) => void;
}

export default function CategoryForm({ initialData, onSubmit }: CategoryFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CategoryFormData>({
        resolver: zodResolver(categorySchema),
        defaultValues: initialData,
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 w-[300px]">
            <div>
                <label htmlFor="name" className="form-label">
                    Category Name
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