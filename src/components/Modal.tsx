'use client';

import { ReactNode, useState } from 'react';

interface ModalProps {
    trigger: ReactNode;
    title: ReactNode;
    children: ReactNode;
    onClose?: () => void;
}

export default function Modal({ trigger, title, children, onClose }: ModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleClose = () => {
        setIsOpen(false);
        onClose?.();
    };

    return (
        <>
            <div onClick={() => setIsOpen(true)}>
                {trigger}
            </div>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50"
                        // onClick={handleClose}
                    />

                    {/* Modal */}
                    <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <div className="text-lg font-semibold">
                                {title}
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <span className='w-6 h-6 cursor-pointer font-semibold'>X</span>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                            {children}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
