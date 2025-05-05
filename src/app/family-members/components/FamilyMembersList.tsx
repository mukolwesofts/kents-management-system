'use client';

import { useState, useEffect } from 'react';
import Table from '@/components/Table';
import SearchInput from '@/components/SearchInput';
import Modal from '@/components/Modal';
import FamilyMemberForm from './FamilyMemberForm';

interface FamilyMember {
    id: number;
    name: string;
    designation: 'sister' | 'dad' | 'mom' | 'brother';
}

export default function FamilyMembersList() {
    const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchFamilyMembers();
    }, []);

    const fetchFamilyMembers = async () => {
        const response = await fetch('/api/family-members');
        const data = await response.json();
        setFamilyMembers(data);
    };

    const handleAdd = async (member: Omit<FamilyMember, 'id'>) => {
        await fetch('/api/family-members', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(member),
        });
        fetchFamilyMembers();
        handleClose(); // Close the modal after adding
    };

    const handleClose = () => {
        setIsModalOpen(false); // Close the modal
    };

    const handleOpen = () => {
        console.log('Open modal');
        setIsModalOpen(true);
        console.log('Modal opened', isModalOpen);
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
        { label: 'Edit', onClick: (item: FamilyMember) => console.log('Edit', item) },
        { label: 'Delete', onClick: (item: FamilyMember) => handleDelete(item.id) },
    ];

    return (
        <div className="space-y-8">
            <div className="max-w-md">
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
                        onClick={handleOpen}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    >
                        Add Family Member
                    </button>
                }
                title="Add Family Member"
            >
                {/* Add family member form */}
                <FamilyMemberForm
                    onSubmit={(data) => {
                        handleAdd(data);
                    }}
                />
            </Modal>

            {/* Family members table */}
            <Table
                columns={columns}
                data={familyMembers}
                searchTerm={searchTerm}
                searchFields={['name', 'designation']}
                actions={actions}
            />
        </div>
    );
}
