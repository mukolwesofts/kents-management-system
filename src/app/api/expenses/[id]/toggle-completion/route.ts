import { NextResponse } from 'next/server';
import { toggleExpenseCompletion } from '@/services/expenseService';

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { completed } = await request.json();
        await toggleExpenseCompletion(parseInt(params.id), completed);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error in POST /api/expenses/[id]/toggle-completion:', error);
        return NextResponse.json({ error: 'Failed to toggle expense completion' }, { status: 500 });
    }
} 