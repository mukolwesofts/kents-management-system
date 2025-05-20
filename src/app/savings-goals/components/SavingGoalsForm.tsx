'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';

const savingGoalSchema = z.object({
    family_member_id: z.number({ required_error: 'Please select a family member' }),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    description: z.string().optional(),
    start_date: z.string().min(1, 'Please select a start date'),
    end_date: z.string().optional(),
    target_amount: z.number().min(0, 'Target amount must be greater than 0'),
    goal_type: z.string().min(1, 'Please select a goal type'),
    status: z.string(),
});

type SavingGoalFormData = z.infer<typeof savingGoalSchema>;

interface FamilyMember {
    id: number;
    name: string;
    designation: string;
}

interface SavingGoalsFormProps {
    initialData?: Partial<SavingGoalFormData>;
    onSubmit: (data: SavingGoalFormData) => void;
}

const GOAL_TYPES = [
    { value: 'fixed_deposit', label: 'Fixed Deposit' },
    { value: 'recurring', label: 'Recurring' },
    { value: 'flexible', label: 'Flexible' },
    { value: 'challenge', label: 'Challenge' },
    { value: 'targeted_savings', label: 'Targeted Savings' },
];

export default function SavingGoalsForm({ initialData, onSubmit }: SavingGoalsFormProps) {
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
    } = useForm<SavingGoalFormData>({
        resolver: zodResolver(savingGoalSchema),
        defaultValues: {
            ...initialData,
            status: initialData?.status ?? 'active',
        },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-[800px]">
            <div className="flex items-center gap-4 w-full">
                <div className='w-1/2'>
                    <label htmlFor="goal_type" className="form-label">
                        Goal Type
                    </label>
                    <select
                        id="goal_type"
                        {...register('goal_type')}
                        className="form-select"
                    >
                        <option value="">Select a goal type</option>
                        {GOAL_TYPES.map((type) => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                    {errors.goal_type && (
                        <p className="form-error">{errors.goal_type.message}</p>
                    )}
                </div>
                <div className='w-1/2'>
                    <label htmlFor="name" className="form-label">
                        Goal Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        {...register('name')}
                        className="form-input"
                        placeholder="e.g., School Fees, Holiday Savings"
                    />
                    {errors.name && (
                        <p className="form-error">{errors.name.message}</p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-4 w-full">
                <div className='w-1/2'>
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
                <div className='w-1/2'>
                    <label htmlFor="target_amount" className="form-label">
                        Target Amount
                    </label>
                    <input
                        type="number"
                        id="target_amount"
                        step="0.01"
                        {...register('target_amount', { valueAsNumber: true })}
                        className="form-input"
                    />
                    {errors.target_amount && (
                        <p className="form-error">{errors.target_amount.message}</p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-4 w-full">
                <div className='w-full'>
                    <label htmlFor="description" className="form-label">
                        Description
                    </label>
                    <textarea
                        id="description"
                        {...register('description')}
                        className="form-input resize-none"
                        rows={4}
                        placeholder="Describe your saving goal..."
                    />
                    {errors.description && (
                        <p className="form-error">{errors.description.message}</p>
                    )}
                </div>


            </div>
            <div className="flex items-center gap-4 w-full">
                <div className='w-1/2'>
                    <label htmlFor="start_date" className="form-label">
                        Start Date
                    </label>
                    <input
                        type="date"
                        id="start_date"
                        {...register('start_date')}
                        className="form-input"
                    />
                    {errors.start_date && (
                        <p className="form-error">{errors.start_date.message}</p>
                    )}
                </div>

                <div className='w-1/2'>
                    <label htmlFor="end_date" className="form-label">
                        End Date (Optional)
                    </label>
                    <input
                        type="date"
                        id="end_date"
                        {...register('end_date')}
                        className="form-input"
                    />
                    {errors.end_date && (
                        <p className="form-error">{errors.end_date.message}</p>
                    )}
                </div>
            </div>
            <div className="flex items-center justify-end gap-4 w-full">
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