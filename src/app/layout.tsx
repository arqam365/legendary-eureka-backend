import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Revzion CMS Status",
    description: "Real-time status monitoring for Revzion CMS Backend API",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body>{children}</body>
        </html>
    );
}