import { NextResponse } from 'next/server';
import { getAllShoppingCategories, addShoppingCategory, updateShoppingCategory, deleteShoppingCategory, ShoppingServiceError } from '@/services/shoppingService';

export async function GET() {
    try {
        const categories = await getAllShoppingCategories();
        return NextResponse.json(categories);
    } catch (error) {
        console.error('Error in GET /api/shopping-categories:', error);
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
        const category = await request.json();
        await addShoppingCategory(category);
        return NextResponse.json({ message: 'Shopping category added successfully' }, { status: 201 });
    } catch (error) {
        console.error('Error in POST /api/shopping-categories:', error);
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
        const { id, ...category } = await request.json();
        await updateShoppingCategory(id, category);
        return NextResponse.json({ message: 'Shopping category updated successfully' });
    } catch (error) {
        console.error('Error in PUT /api/shopping-categories:', error);
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
        await deleteShoppingCategory(Number(id));
        return NextResponse.json({ message: 'Shopping category deleted successfully' });
    } catch (error) {
        console.error('Error in DELETE /api/shopping-categories:', error);
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