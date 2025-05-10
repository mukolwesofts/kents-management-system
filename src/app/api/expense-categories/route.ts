import { NextResponse } from 'next/server';
import {
    getAllExpenseCategories,
    createExpenseCategory,
    updateExpenseCategory,
    deleteExpenseCategory,
} from '@/services/expenseCategoryService';

export async function GET() {
    try {
        const categories = await getAllExpenseCategories();
        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch expense categories' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const category = await createExpenseCategory(data);
        return NextResponse.json(category);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create expense category' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const data = await request.json();
        await updateExpenseCategory(data);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update expense category' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }
        await deleteExpenseCategory(parseInt(id));
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete expense category' }, { status: 500 });
    }
} 