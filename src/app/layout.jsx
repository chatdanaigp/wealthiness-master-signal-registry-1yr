'use client';

import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    display: "swap",
});

export default function RootLayout({ children }) {
    return (
        <html lang="th" className="scroll-smooth">
            <head>
                <title>Master Signal Registry | 1-Year VIP Access</title>
                <meta name="description" content="ลงทะเบียนเพื่อรับสิทธิ์ 1-Year VIP Access เข้าถึง Trading Signals และ Community พิเศษ" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </head>
            <body className={`${inter.variable} antialiased bg-background text-foreground`}>
                {children}
            </body>
        </html>
    );
}
