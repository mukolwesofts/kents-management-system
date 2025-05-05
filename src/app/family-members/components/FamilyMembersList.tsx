'use client';

import { useState } from 'react';
import Table from '@/components/Table';
import SearchInput from '@/components/SearchInput';

interface FamilyMember {
    id: string;
    name: string;
    designation: 'sister' | 'dad' | 'mom' | 'brother';
}

// Example data - replace with your actual data source
const exampleData: FamilyMember[] = [
    { id: '1', name: 'John Doe', designation: 'dad' },
    { id: '2', name: 'Jane Doe', designation: 'mom' },
    { id: '3', name: 'Alice Doe', designation: 'sister' },
    { id: '4', name: 'Bob Doe', designation: 'brother' },
];

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

export default function FamilyMembersList() {
    const [searchTerm, setSearchTerm] = useState('');

    const handleView = (item: FamilyMember) => {
        alert(`Viewing ${item.name}`);
    };

    const handleEdit = (item: FamilyMember) => {
        alert(`Editing ${item.name}`);
    };

    const handleDelete = (item: FamilyMember) => {
        alert(`Deleting ${item.name}`);
    };

    const actions = [
        { label: 'View', onClick: handleView, className: 'text-green-500 hover:text-green-600' },
        { label: 'Edit', onClick: handleEdit, className: 'text-yellow-500 hover:text-yellow-600' },
        { label: 'Delete', onClick: handleDelete, className: 'text-red-500 hover:text-red-600' },
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

            <Table
                columns={columns}
                data={exampleData}
                searchTerm={searchTerm}
                searchFields={['name', 'designation']}
                actions={actions}
            />
        </div>
    );
}
