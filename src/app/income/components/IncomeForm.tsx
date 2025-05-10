'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { getMonthFromISO } from '@/utils/formatters';

const incomeSchema = z.object({
    family_member_id: z.number({ required_error: 'Please select a family member' }),
    source: z.string().min(2, 'Source must be at least 2 characters'),
    amount: z.number().min(0, 'Amount must be greater than 0'),
    month: z.string().min(1, 'Please select a month'),
});

type IncomeFormData = z.infer<typeof incomeSchema>;

interface FamilyMember {
    id: number;
    name: string;
    designation: string;
}

interface IncomeFormProps {
    initialData?: IncomeFormData;
    onSubmit: (data: IncomeFormData) => void;
    selectedMonth?: string;
}

export default function IncomeForm({ initialData, onSubmit, selectedMonth }: IncomeFormProps) {
    const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);

    useEffect(() => {
        fetchFamilyMembers();
    }, []);

    const fetchFamilyMembers = async () => {
        const response = await fetch('/api/family-members');
        const data = await response.json();
        setFamilyMembers(data);
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<IncomeFormData>({
        resolver: zodResolver(incomeSchema),
        defaultValues: {
            ...initialData,
            month: initialData?.month 
                ? getMonthFromISO(initialData.month)
                : new Date().toISOString().slice(0, 7),
        },
    });

    // Set the month when selectedMonth prop changes
    useEffect(() => {
        if (selectedMonth && !initialData) {
            setValue('month', selectedMonth);
        }
    }, [selectedMonth, setValue, initialData]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 w-[500px]">
            <div>
                <label htmlFor="family_member_id" className="form-label">
                    Family Member
                </label>
                <select
                    id="family_member_id"
                    {...register('family_member_id', { valueAsNumber: true })}
                    className="form-select"
                >
                    <option value="">Select a family member</option>
                    {familyMembers.map((member) => (
                        <option key={member.id} value={member.id}>
                            {member.name} ({member.designation})
                        </option>
                    ))}
                </select>
                {errors.family_member_id && (
                    <p className="form-error">{errors.family_member_id.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="source" className="form-label">
                    Source
                </label>
                <input
                    type="text"
                    id="source"
                    {...register('source')}
                    className="form-input"
                    placeholder="e.g., Salary, Freelance, Business"
                />
                {errors.source && (
                    <p className="form-error">{errors.source.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="amount" className="form-label">
                    Amount
                </label>
                <input
                    type="number"
                    id="amount"
                    step="0.01"
                    {...register('amount', { valueAsNumber: true })}
                    className="form-input"
                />
                {errors.amount && (
                    <p className="form-error">{errors.amount.message}</p>
                )}
            </div>

            <div>
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