'use client';

import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
    useCallback
} from 'react';

type Dictionary = Record<string, string>;
type LoadedChunks = Record<string, Dictionary>;

interface I18nContextType {
    locale: string;
    setLocale: (newLocale: string) => void;
    t: (namespace: string, key: string) => string;
    isLoading: boolean;
    loadChunk: (namespace: string) => Promise<void>;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
    children: ReactNode;
    initialLocale: string;
    defaultNamespace?: string;
    initialChunks?: LoadedChunks;
}

export const I18nProvider = (
    {
        children,
        initialLocale,
        defaultNamespace = 'common'
    } : I18nProviderProps) => {
    const [locale, setLocale] = useState(initialLocale);
    const [chunks, setChunks] = useState<LoadedChunks>({});
    const [isLoading, setIsLoading] = useState(false);

    const loadChunk = useCallback(async (namespace: string): Promise<void> => {
        if (chunks[namespace]) return;

        setIsLoading(true);
        try {
            const path = `/locales/${locale}/${namespace}.json`;
            const response = await fetch(path);

            if (!response.ok) {
                console.error(`Failed to load ${namespace} for ${locale}: ${response.statusText}`);
            }

            const data: Dictionary = await response.json();

            setChunks(prev => ({
                ...prev,
                [namespace]: data
            }));
        } catch (error) {
            console.error(`Error loading translation chunk ${namespace}:`, error);
        } finally {
            setIsLoading(false);
        }
    }, [locale]);

    const t = useCallback((namespace: string, key: string): string => {
        const dictionary = chunks[namespace];

        if (!dictionary) {
            return isLoading ? `[Loading: ${key}]` : `[Missing Namespace: ${namespace}]`;
        }

        return dictionary[key] || `[Missing Key: ${namespace}.${key}]`;
    }, [chunks, isLoading]);

    useEffect(() => {
        setChunks({});
        loadChunk(defaultNamespace);
    }, [locale]);

    const value = { locale, setLocale, t, isLoading, loadChunk };

    return (
        <I18nContext.Provider value={value}>
            {children}
        </I18nContext.Provider>
    );
};

export const useI18n = () => {
    const context = useContext(I18nContext);
    if (context === undefined) {
        throw new Error('Must be used within I18nProvider');
    }
    return context;
};