'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const familyMemberSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    designation: z.enum(['sister', 'dad', 'mom', 'brother'], {
        message: 'Please select a designation',
    }),
});

type FamilyMemberFormData = z.infer<typeof familyMemberSchema>;

interface FamilyMemberFormProps {
    initialData?: FamilyMemberFormData;
    onSubmit: (data: FamilyMemberFormData) => void;
}

export default function FamilyMemberForm({ initialData, onSubmit }: FamilyMemberFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FamilyMemberFormData>({
        resolver: zodResolver(familyMemberSchema),
        defaultValues: initialData,
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div>
                <label htmlFor="name" className="form-label">
                    Full Name
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

            <div>
                <label htmlFor="designation" className="form-label">
                    Designation
                </label>
                <select
                    id="designation"
                    {...register('designation')}
                    className="form-select"
                >
                    <option value="">Select a designation</option>
                    <option value="dad">Dad</option>
                    <option value="mom">Mom</option>
                    <option value="sister">Sister</option>
                    <option value="brother">Brother</option>
                </select>
                {errors.designation && (
                    <p className="form-error">{errors.designation.message}</p>
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
