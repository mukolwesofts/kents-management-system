import ExpensesList from './components/ExpensesList';

export default function ExpensesPage() {
    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold text-teal-700 mb-4">Expenses</h1>
            </div>

            <ExpensesList />
        </div>
    );
}
