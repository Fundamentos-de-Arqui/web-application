'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { FluentProvider, Theme, webLightTheme, webDarkTheme } from '@fluentui/react-components';

interface ThemeContextValue {
    theme: Theme;
    isDark: boolean;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
const THEME_KEY = 'app-theme-preference';

const getInitialTheme = (): Theme => {
    if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem(THEME_KEY);
        if (savedTheme === 'dark') {
            return webDarkTheme;
        }
    }
    return webLightTheme;
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('Must be called within ThemeProvider');
    }
    return context;
};

export function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
    const [currentTheme, setCurrentTheme] = useState<Theme>(getInitialTheme);
    const isDark = currentTheme === webDarkTheme;

    const toggleTheme = () => {
        setCurrentTheme(prevTheme =>
            prevTheme === webLightTheme ? webDarkTheme : webLightTheme
        );
    };

    useEffect(() => {
        const themeName = isDark ? 'dark' : 'light';
        localStorage.setItem(THEME_KEY, themeName);
    }, [isDark]);

    const contextValue: ThemeContextValue = {
        theme: currentTheme,
        isDark,
        toggleTheme,
    };

    return (
        <ThemeContext.Provider value={contextValue}>
            <FluentProvider theme={currentTheme}>
                {children}
            </FluentProvider>
        </ThemeContext.Provider>
    );
}