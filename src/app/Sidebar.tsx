"use client";
import { FaTachometerAlt, FaMoneyBillWave, FaShoppingCart, FaPiggyBank, FaUsers, FaListUl } from "react-icons/fa";
import Link from "next/link";

const navItems = [
    { name: "Dashboard", href: "/", icon: <FaTachometerAlt /> },
    { name: "Income", href: "/income", icon: <FaMoneyBillWave /> },
    { name: "Expenses", href: "/expenses", icon: <FaListUl /> },
    { name: "Savings Goals", href: "/savings-goals", icon: <FaPiggyBank /> },
    { name: "Shopping List", href: "/shopping-list", icon: <FaShoppingCart /> },
    { name: "Family Members", href: "/family-members", icon: <FaUsers /> },
];

export default function Sidebar() {
    return (
        <aside className="w-64 bg-teal-700 text-white flex flex-col min-h-screen shadow-lg">
            <div className="flex items-center gap-2 px-6 py-6 text-2xl font-bold tracking-wide border-b border-teal-800">
                <span className="bg-white rounded p-1 text-teal-700">💰</span>
                Family Finances
            </div>
            <nav className="flex-1 py-4">
                <ul className="space-y-2">
                    {navItems.map((item) => (
                        <li key={item.name}>
                            <Link href={item.href} className="flex items-center gap-3 px-6 py-3 rounded-lg hover:bg-teal-600 transition-colors">
                                <span className="text-lg">{item.icon}</span>
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}
