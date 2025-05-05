'use client';

import { useState, useMemo } from 'react';

interface Column<T> {
    header: string;
    accessor: keyof T;
    render?: (item: T) => React.ReactNode;
}

interface Action<T> {
    label: string;
    onClick: (item: T) => void;
    className?: string;
}

interface TableProps<T> {
    columns: Column<T>[];
    data: T[];
    searchTerm?: string;
    searchFields?: (keyof T)[];
    actions?: Action<T>[];
}

export default function Table<T extends Record<string, any>>({
    columns,
    data,
    searchTerm = '',
    searchFields,
    actions,
}: TableProps<T>) {
    const filteredData = useMemo(() => {
        if (!searchTerm || !searchFields) return data;

        return data.filter((item) =>
            searchFields.some((field) => {
                const value = item[field];
                if (value === null || value === undefined) return false;
                return String(value)
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
            })
        );
    }, [data, searchTerm, searchFields]);

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-teal-400">
                <thead className="bg-teal-600">
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider"
                            >
                                {column.header}
                            </th>
                        ))}
                        {actions && (
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider"
                            >
                                Actions
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="px-6 py-4 text-center text-sm text-gray-500"
                            >
                                No data found
                            </td>
                        </tr>
                    ) : (
                        filteredData.map((item, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className={(rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50') + ' cursor-pointer'}
                            >
                                {columns.map((column, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                    >
                                        {column.render
                                            ? column.render(item)
                                            : String(item[column.accessor])}
                                    </td>
                                ))}
                                {actions && (
                                    <td className="w-1/4 px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <div className="flex space-x-2">
                                            {actions.map((action, actionIndex) => (
                                                <button
                                                    key={actionIndex}
                                                    onClick={() => action.onClick(item)}
                                                    className={`btn-icon ${action.className}`}
                                                >
                                                    {action.label}
                                                </button>
                                            ))}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
