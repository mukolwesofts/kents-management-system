'use client';

import { useState, useEffect } from 'react';
import Table from '@/components/Table';
import SearchInput from '@/components/SearchInput';
import Modal from '@/components/Modal';
import FamilyMemberForm from './FamilyMemberForm';
import Shimmer from '@/components/Shimmer';

interface FamilyMember {
    id: number;
    name: string;
    designation: 'sister' | 'dad' | 'mom' | 'brother';
}

export default function FamilyMembersList() {
    const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentFamilyMember, setCurrentFamilyMember] = useState<FamilyMember | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchFamilyMembers();
    }, []);

    const fetchFamilyMembers = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/family-members');
            const data = await response.json();
            setFamilyMembers(data);
        } catch (error) {
            console.error('Error fetching family members:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddOrUpdate = async (member: Omit<FamilyMember, 'id'>) => {
        if (currentFamilyMember) {
            // Update existing family member
            await fetch(`/api/family-members`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: currentFamilyMember.id, ...member }),
            });
        } else {
            // Add new family member
            await fetch('/api/family-members', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(member),
            });
        }
        fetchFamilyMembers();
        handleClose();
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setCurrentFamilyMember(null);
    };

    const handleOpen = (member?: FamilyMember) => {
        setCurrentFamilyMember(member || null);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        await fetch(`/api/family-members?id=${id}`, { method: 'DELETE' });
        fetchFamilyMembers();
    };

    const columns = [
        { header: 'Name', accessor: 'name' as const },
        {
            header: 'Designation',
            accessor: 'designation' as const,
            render: (item: FamilyMember) => (
                <span className="capitalize">{item.designation}</span>
            ),
        },
    ];

    const actions = [
        {
            label: 'Edit',
            onClick: (item: FamilyMember) => handleOpen(item),
            className: 'text-blue-500',
        },
        {
            label: 'Delete',
            onClick: (item: FamilyMember) => handleDelete(item.id),
            className: 'text-red-500',
        },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                {/* Search Input */}
                <div className="max-w-md w-full">
                    <SearchInput
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Search family members..."
                    />
                </div>

                {/* Add family member modal */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={handleClose}
                    trigger={
                        <button
                            onClick={() => handleOpen()}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                        >
                            Add Family Member
                        </button>
                    }
                    title={currentFamilyMember ? 'Edit Family Member' : 'Add Family Member'}
                >
                    {/* Add/Edit family member form */}
                    <FamilyMemberForm
                        initialData={currentFamilyMember || undefined}
                        onSubmit={(data) => {
                            handleAddOrUpdate(data);
                        }}
                    />
                </Modal>
            </div>

            {/* Family members table */}
            {isLoading ? (
                <Shimmer type="table" rows={5} columns={columns.length + 1} />
            ) : (
                <Table
                    columns={columns}
                    data={familyMembers}
                    searchTerm={searchTerm}
                    searchFields={['name', 'designation']}
                    actions={actions}
                />
            )}
        </div>
    );
}
