import type { Metadata } from "next";
import "@/app/globals.css";
import { ThemeProvider } from "@/app/providers/theme";
import { I18nProvider } from "@/app/providers/i18n";
import { I18N_LOCALES, DEFAULT_LOCALE } from '@/app/config/i18n';
import React from "react";
import { promises as fs } from 'fs';
import path from 'path';

type Dictionary = Record<string, string>;
type LoadedChunks = Record<string, Dictionary>;

async function loadServerDictionary(locale: string): Promise<LoadedChunks> {
    const fullPath = path.join(process.cwd(), 'public', 'locales', locale, 'common.json');
    try {
        const file = await fs.readFile(fullPath, 'utf8');
        return { common: JSON.parse(file) };
    } catch (e) {
        return { common: {} };
    }
}

export const metadata: Metadata = {
    title: "Therapy System",
    description: "Handle with care",
};

export async function generateStaticParams() {
    return I18N_LOCALES.map((locale) => ({ locale }));
}

export default async function RootLayout(
    {children}: { children: React.ReactNode; params: { locale: string } }
) {
    const initialChunks = await loadServerDictionary(DEFAULT_LOCALE);

    return (
        <html lang={DEFAULT_LOCALE}>
            <body>
                <I18nProvider
                    initialLocale={DEFAULT_LOCALE}
                    initialChunks={initialChunks}
                >
                    <ThemeProvider>
                        {children}
                    </ThemeProvider>
                </I18nProvider>
            </body>
        </html>
    );
}