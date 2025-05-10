import { NextResponse } from 'next/server';
import { getAllShoppingItems, addShoppingItem, updateShoppingItem, deleteShoppingItem, ShoppingServiceError } from '@/services/shoppingService';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const month = searchParams.get('month');
        const items = await getAllShoppingItems(month || undefined);
        return NextResponse.json(items);
    } catch (error) {
        console.error('Error in GET /api/shopping-items:', error);
        if (error instanceof ShoppingServiceError) {
            return NextResponse.json({
                message: error.message,
                code: error.code,
                details: error.details
            }, { status: 500 });
        }
        return NextResponse.json({
            message: 'Internal Server Error',
            code: 'UNKNOWN_ERROR',
            details: error instanceof Error ? error.message : 'Unknown error occurred'
        }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const item = await request.json();
        await addShoppingItem(item);
        return NextResponse.json({ message: 'Shopping item added successfully' }, { status: 201 });
    } catch (error) {
        console.error('Error in POST /api/shopping-items:', error);
        if (error instanceof ShoppingServiceError) {
            return NextResponse.json({
                message: error.message,
                code: error.code,
                details: error.details
            }, { status: 500 });
        }
        return NextResponse.json({
            message: 'Internal Server Error',
            code: 'UNKNOWN_ERROR',
            details: error instanceof Error ? error.message : 'Unknown error occurred'
        }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const { id, ...item } = await request.json();
        await updateShoppingItem(id, item);
        return NextResponse.json({ message: 'Shopping item updated successfully' });
    } catch (error) {
        console.error('Error in PUT /api/shopping-items:', error);
        if (error instanceof ShoppingServiceError) {
            return NextResponse.json({
                message: error.message,
                code: error.code,
                details: error.details
            }, { status: 500 });
        }
        return NextResponse.json({
            message: 'Internal Server Error',
            code: 'UNKNOWN_ERROR',
            details: error instanceof Error ? error.message : 'Unknown error occurred'
        }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }
        await deleteShoppingItem(Number(id));
        return NextResponse.json({ message: 'Shopping item deleted successfully' });
    } catch (error) {
        console.error('Error in DELETE /api/shopping-items:', error);
        if (error instanceof ShoppingServiceError) {
            return NextResponse.json({
                message: error.message,
                code: error.code,
                details: error.details
            }, { status: 500 });
        }
        return NextResponse.json({
            message: 'Internal Server Error',
            code: 'UNKNOWN_ERROR',
            details: error instanceof Error ? error.message : 'Unknown error occurred'
        }, { status: 500 });
    }
} 