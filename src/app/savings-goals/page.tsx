import SavingGoalsList from './components/SavingGoalsList';

export default function SavingGoalsPage() {
    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-teal-700 mb-4">Saving Goals</h1>
            </div>

            <SavingGoalsList />
        </div>
    );
}