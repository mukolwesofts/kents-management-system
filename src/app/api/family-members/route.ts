import { NextResponse } from 'next/server';
import { getAllFamilyMembers, addFamilyMember, updateFamilyMember, deleteFamilyMember } from '@/services/familyMemberService';

export async function GET() {
    try {
        const members = await getAllFamilyMembers();
        return NextResponse.json(members);
    } catch (error) {
        console.error('Error in GET /api/family-members:', error);
        return NextResponse.json({ error: 'Failed to fetch family members' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const member = await request.json();
        await addFamilyMember(member);
        return NextResponse.json({ message: 'Family member added successfully' }, { status: 201 });
    } catch (error) {
        console.error('Error in POST /api/family-members:', error);
        return NextResponse.json({ error: 'Failed to add family member' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const { id, ...member } = await request.json();
        await updateFamilyMember(id, member);
        return NextResponse.json({ message: 'Family member updated successfully' });
    } catch (error) {
        console.error('Error in PUT /api/family-members:', error);
        return NextResponse.json({ error: 'Failed to update family member' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }
        await deleteFamilyMember(Number(id));
        return NextResponse.json({ message: 'Family member deleted successfully' });
    } catch (error) {
        console.error('Error in DELETE /api/family-members:', error);
        return NextResponse.json({ error: 'Failed to delete family member' }, { status: 500 });
    }
} 