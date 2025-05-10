import { NextResponse } from 'next/server';
import { getAllIncome, addIncome, updateIncome, deleteIncome, IncomeError } from '@/services/incomeService';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const month = searchParams.get('month');
        const income = await getAllIncome(month ? new Date(month) : undefined);
        return NextResponse.json(income);
    } catch (error) {
        console.error('Error in GET /api/income:', error);
        return NextResponse.json({ error: 'Failed to fetch income' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const income = await request.json();
        // Convert month string to Date object
        if (income.month) {
            income.month = new Date(income.month);
        }
        await addIncome(income);
        return NextResponse.json({ message: 'Income added successfully' }, { status: 201 });
    } catch (error) {
        console.error('Error in POST /api/income:', error);
        if (error instanceof IncomeError) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to add income' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const { id, ...income } = await request.json();
        // Convert month string to Date object
        if (income.month) {
            income.month = new Date(income.month);
        }
        await updateIncome(id, income);
        return NextResponse.json({ message: 'Income updated successfully' });
    } catch (error) {
        console.error('Error in PUT /api/income:', error);
        if (error instanceof IncomeError) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to update income' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }
        await deleteIncome(Number(id));
        return NextResponse.json({ message: 'Income deleted successfully' });
    } catch (error) {
        console.error('Error in DELETE /api/income:', error);
        if (error instanceof IncomeError) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to delete income' }, { status: 500 });
    }
} 