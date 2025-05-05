import FamilyMembersList from './components/FamilyMembersList';
import FamilyMembersModal from './components/FamilyMembersModal';

export default function FamilyMembersPage() {
    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-teal-700 mb-4">Family Members</h1>

                <FamilyMembersModal />
            </div>

            <FamilyMembersList />
        </div>
    );
}
