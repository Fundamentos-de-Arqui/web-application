import type { Metadata } from "next";
import "@/app/globals.css";
import { ThemeProvider } from "@/app/providers/theme";
import { DEFAULT_LOCALE } from '@/app/config/i18n';
import React from "react";

export const metadata: Metadata = {
    title: "Therapy System",
    description: "Handle with care",
};

export default async function RootLayout(
    {children}: { children: React.ReactNode; }
) {
    return (
        <html lang={DEFAULT_LOCALE}>
            <body>
                <ThemeProvider>
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}