export default function Home() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-teal-700">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                    <span className="text-2xl font-semibold text-gray-700">Total Income</span>
                    <span className="text-3xl font-bold text-teal-600 mt-2">$5,230</span>
                </div>
                <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                    <span className="text-2xl font-semibold text-gray-700">Total Expenses</span>
                    <span className="text-3xl font-bold text-yellow-600 mt-2">$2,850</span>
                </div>
                <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                    <span className="text-2xl font-semibold text-gray-700">Savings Progress</span>
                    <span className="text-3xl font-bold text-green-600 mt-2">$1,500 / $3,000</span>
                </div>
                <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                    <span className="text-2xl font-semibold text-gray-700">Net Balance</span>
                    <span className="text-3xl font-bold text-blue-600 mt-2">$2,380</span>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 mt-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Automated Insights</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>You spent 15% more on groceries this month compared to last month.</li>
                    <li>Your savings rate is currently 25%.</li>
                    <li>Consider allocating more towards your 'Vacation Fund' goal.</li>
                </ul>
            </div>
        </div>
    );
}
