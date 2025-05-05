'use client';

import { useState } from 'react';
import Modal from '@/components/Modal';
import FamilyMemberForm from './FamilyMemberForm';

interface FamilyMemberData {
    name: string;
    designation: 'sister' | 'dad' | 'mom' | 'brother';
}

export default function FamilyMembersModal() {
    const [isOpen, setIsOpen] = useState(false);

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleSubmit = (data: FamilyMemberData) => {
        console.log('Form submitted:', data);
        handleClose();
    };

    return (
        <Modal
            trigger={
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                    Add Family Member
                </button>
            }
            title="Add Family Member"
            onClose={handleClose}
        >
            <FamilyMemberForm onSubmit={handleSubmit} />
        </Modal>
    );
}
