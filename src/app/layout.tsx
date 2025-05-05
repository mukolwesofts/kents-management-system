import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/Sidebar";

const montserrat = Montserrat({
    variable: "--font-montserrat",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Kent Management System",
    description: "Kent Family Management System",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${montserrat.variable} antialiased bg-gray-50 text-[#202028]`}
            >
                <div className="flex min-h-screen">
                    <Sidebar />
                    <main className="flex-1 p-8 py-20">
                        {children}
                    </main>
                </div>
            </body>
        </html>
    );
}
