'use client';

interface ShimmerProps {
    type: 'table' | 'summary' | 'card';
    rows?: number;
    columns?: number;
}

export default function Shimmer({ type, rows = 3, columns = 4 }: ShimmerProps) {
    const shimmerClass = "animate-pulse bg-gray-200 rounded";
    
    if (type === 'table') {
        return (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border border-teal-400">
                    <thead className="bg-teal-600">
                        <tr>
                            {Array.from({ length: columns }).map((_, index) => (
                                <th
                                    key={index}
                                    className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider"
                                >
                                    <div className={`h-4 w-24 ${shimmerClass}`} />
                                </th>
                            ))}
                            <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                <div className={`h-4 w-16 ${shimmerClass}`} />
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {Array.from({ length: rows }).map((_, rowIndex) => (
                            <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                {Array.from({ length: columns }).map((_, colIndex) => (
                                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                                        <div className={`h-4 w-32 ${shimmerClass}`} />
                                    </td>
                                ))}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex space-x-2">
                                        <div className={`h-8 w-16 ${shimmerClass}`} />
                                        <div className={`h-8 w-16 ${shimmerClass}`} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    if (type === 'summary') {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 max-w-sm">
                <div className="flex items-end justify-between">
                    <div>
                        <div className={`h-4 w-32 ${shimmerClass} mb-2`} />
                        <div className={`h-8 w-24 ${shimmerClass}`} />
                    </div>
                    <div>
                        <div className={`h-4 w-20 ${shimmerClass}`} />
                    </div>
                </div>
            </div>
        );
    }

    if (type === 'card') {
        return (
            <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                <div className={`h-6 w-32 ${shimmerClass} mb-4`} />
                <div className={`h-8 w-24 ${shimmerClass}`} />
            </div>
        );
    }

    return null;
} 