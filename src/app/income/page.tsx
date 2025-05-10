import IncomeList from './components/IncomeList';

export default function IncomePage() {
    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-teal-700 mb-4">Income</h1>
            </div>

            <IncomeList />
        </div>
    );
}
