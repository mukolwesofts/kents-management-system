import { NextApiRequest, NextApiResponse } from 'next';
import { getAllFamilyMembers, addFamilyMember, updateFamilyMember, deleteFamilyMember } from '@/services/familyMemberService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        switch (req.method) {
            case 'GET': {
                const members = await getAllFamilyMembers();
                res.status(200).json(members);
                break;
            }
            case 'POST': {
                const member = req.body;
                await addFamilyMember(member);
                res.status(201).json({ message: 'Family member added successfully' });
                break;
            }
            case 'PUT': {
                const { id, ...member } = req.body;
                await updateFamilyMember(id, member);
                res.status(200).json({ message: 'Family member updated successfully' });
                break;
            }
            case 'DELETE': {
                const { id } = req.query;
                await deleteFamilyMember(Number(id));
                res.status(200).json({ message: 'Family member deleted successfully' });
                break;
            }
            default:
                res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
                res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
