import pool from '@/utils/db';

export interface FamilyMember {
    id?: number;
    name: string;
    designation: 'sister' | 'dad' | 'mom' | 'brother';
}

export async function getAllFamilyMembers(): Promise<FamilyMember[]> {
    const [rows] = await pool.query('SELECT * FROM family_members');
    return rows as FamilyMember[];
}

export async function addFamilyMember(member: FamilyMember): Promise<void> {
    const { name, designation } = member;
    await pool.query('INSERT INTO family_members (name, designation) VALUES (?, ?)', [name, designation]);
}

export async function updateFamilyMember(id: number, member: FamilyMember): Promise<void> {
    const { name, designation } = member;
    await pool.query('UPDATE family_members SET name = ?, designation = ? WHERE id = ?', [name, designation, id]);
}

export async function deleteFamilyMember(id: number): Promise<void> {
    await pool.query('DELETE FROM family_members WHERE id = ?', [id]);
}
