import DashboardSummary from '@/app/components/DashboardSummary';

export default function Home() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-teal-700">Dashboard</h1>
            <DashboardSummary />
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
