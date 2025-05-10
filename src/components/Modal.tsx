'use client';

import { ReactNode } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    trigger: ReactNode;
    title: ReactNode;
    children: ReactNode;
}

export default function Modal({ isOpen, onClose, trigger, title, children }: ModalProps) {
    return (
        <>
            {/* Trigger button for the modal */}
            <div>{trigger}</div>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <div className="relative bg-white rounded-lg shadow-xl w-auto mx-4">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-300">
                            <div className="text-lg font-semibold">{title}</div>
                            <button
                                onClick={onClose}
                                className="p-1 px-1.5 hover:bg-gray-100 rounded-md transition-colors"
                            >
                                <span className="w-6 h-6 cursor-pointer font-semibold">X</span>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-4">{children}</div>
                    </div>
                </div>
            )}
        </>
    );
}
