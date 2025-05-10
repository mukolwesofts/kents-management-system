import { NextResponse } from 'next/server';
import {
    getAllExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
} from '@/services/expenseService';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const month = searchParams.get('month');
        
        const expenses = await getAllExpenses(month ? new Date(month) : undefined);
        return NextResponse.json(expenses);
    } catch (error) {
        console.error('Error in GET /api/expenses:', error);
        return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const expense = await createExpense(data);
        return NextResponse.json(expense);
    } catch (error) {
        console.error('Error in POST /api/expenses:', error);
        return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const data = await request.json();
        await updateExpense(data);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error in PUT /api/expenses:', error);
        return NextResponse.json({ error: 'Failed to update expense' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }
        await deleteExpense(parseInt(id));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error in DELETE /api/expenses:', error);
        return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 });
    }
} 