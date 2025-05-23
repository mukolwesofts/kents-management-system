'use client';

import { useState, useEffect } from 'react';
import Table from '@/components/Table';
import SearchInput from '@/components/SearchInput';
import Modal from '@/components/Modal';
import ShoppingItemForm from './ShoppingItemForm';
import CategoryForm from './CategoryForm';
import ShoppingListSummary from './ShoppingListSummary';
import Shimmer from '@/components/Shimmer';
import { ShoppingItem, ShoppingCategory } from './types';

export default function ShoppingList() {
    const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<ShoppingItem | null>(null);
    const [currentCategory, setCurrentCategory] = useState<ShoppingCategory | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchShoppingItems();
    }, [selectedMonth]);

    const fetchShoppingItems = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/shopping-items?month=${selectedMonth}`);
            const data = await response.json();
            setShoppingItems(data);
        } catch (error) {
            console.error('Error fetching shopping items:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddOrUpdateItem = async (item: Omit<ShoppingItem, 'id' | 'category_name'>) => {
        if (currentItem) {
            // Update existing item
            await fetch(`/api/shopping-items`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: currentItem.id, ...item }),
            });
        } else {
            // Add new item
            await fetch('/api/shopping-items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item),
            });
        }
        fetchShoppingItems();
        handleCloseItemModal();
    };

    const handleAddOrUpdateCategory = async (category: Omit<ShoppingCategory, 'id'>) => {
        if (currentCategory) {
            // Update existing category
            await fetch(`/api/shopping-categories`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: currentCategory.id, ...category }),
            });
        } else {
            // Add new category
            await fetch('/api/shopping-categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(category),
            });
        }
        fetchShoppingItems();
        handleCloseCategoryModal();
    };

    const handleCloseItemModal = () => {
        setIsItemModalOpen(false);
        setCurrentItem(null);
    };

    const handleCloseCategoryModal = () => {
        setIsCategoryModalOpen(false);
        setCurrentCategory(null);
    };

    const handleOpenItemModal = (item?: ShoppingItem) => {
        setCurrentItem(item || null);
        setIsItemModalOpen(true);
    };

    const handleOpenCategoryModal = (category?: ShoppingCategory) => {
        setCurrentCategory(category || null);
        setIsCategoryModalOpen(true);
    };

    const handleDeleteItem = async (id: number) => {
        await fetch(`/api/shopping-items?id=${id}`, { method: 'DELETE' });
        fetchShoppingItems();
    };

    const columns = [
        { header: 'Name', accessor: 'name' as const },
        { header: 'Quantity', accessor: 'quantity' as const },
        {
            header: 'Estimated Price',
            accessor: 'estimated_price' as const,
            render: (item: ShoppingItem) => (
                <span>Ksh {Number(item.estimated_price).toFixed(2)}</span>
            ),
        },
        { header: 'Category', accessor: 'category_name' as const },
        {
            header: 'Month',
            accessor: 'month' as const,
            render: (item: ShoppingItem) => (
                <span>{new Date(item.month).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
            ),
        },
        {
            header: 'Notes',
            accessor: 'notes' as const,
            render: (item: ShoppingItem) => (
                <span className="truncate max-w-xs">{item.notes || '-'}</span>
            ),
        },
    ];

    const actions = [
        {
            label: 'Edit',
            onClick: (item: ShoppingItem) => handleOpenItemModal(item),
            className: 'text-blue-500',
        },
        {
            label: 'Delete',
            onClick: (item: ShoppingItem) => handleDeleteItem(item.id),
            className: 'text-red-500',
        },
    ];

    return (
        <div className="space-y-8">
            <ShoppingListSummary items={shoppingItems} isLoading={isLoading} />
            
            <div className="flex items-center justify-between">
                {/* Search and Filter Inputs */}
                <div className="flex gap-4 items-center">
                    <div className="w-auto min-w-[300px]">
                        <SearchInput
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder="Search shopping items..."
                        />
                    </div>
                    <div>
                        <input
                            type="month"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="form-input"
                        />
                    </div>
                </div>

                {/* Add buttons */}
                <div className="flex gap-2">
                    <Modal
                        isOpen={isCategoryModalOpen}
                        onClose={handleCloseCategoryModal}
                        trigger={
                            <button
                                onClick={() => handleOpenCategoryModal()}
                                className="btn-secondary"
                            >
                                Add Category
                            </button>
                        }
                        title={currentCategory ? 'Edit Category' : 'Add Category'}
                    >
                        <CategoryForm
                            initialData={currentCategory || undefined}
                            onSubmit={handleAddOrUpdateCategory}
                        />
                    </Modal>

                    <Modal
                        isOpen={isItemModalOpen}
                        onClose={handleCloseItemModal}
                        trigger={
                            <button
                                onClick={() => handleOpenItemModal()}
                                className="btn"
                            >
                                Add Item
                            </button>
                        }
                        title={currentItem ? 'Edit Item' : 'Add Item'}
                    >
                        <ShoppingItemForm
                            initialData={currentItem || undefined}
                            onSubmit={handleAddOrUpdateItem}
                        />
                    </Modal>
                </div>
            </div>

            {/* Shopping items table */}
            {isLoading ? (
                <Shimmer type="table" rows={5} columns={columns.length} />
            ) : (
                <Table
                    columns={columns}
                    data={shoppingItems}
                    searchTerm={searchTerm}
                    searchFields={['name', 'category_name', 'notes']}
                    actions={actions}
                />
            )}
        </div>
    );
} 