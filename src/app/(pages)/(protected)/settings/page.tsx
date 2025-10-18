'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Title2, Label, Switch, Button, Text } from '@fluentui/react-components';
import { useTheme } from '@/app/providers/theme';

export default function SettingsPage() {
    const { isDark, toggleTheme } = useTheme();

    const router = useRouter();
    const handleClick = () => {
        router.push('/dashboard');
    };

    return (
        <div>
            <Title2>Configuration and Settings</Title2>
            <Text size={400} block style={{ marginBottom: '20px' }}>
                Manage your user experience settings, including theme and navigation options.
            </Text>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                <Label htmlFor="theme-switch">Dark Theme</Label>
                <Switch
                    id="theme-switch"
                    checked={isDark}
                    onChange={toggleTheme}
                />
            </div>

            <Button
                appearance="primary"
                onClick={handleClick}
            >
                Go to Dashboard
            </Button>
        </div>
    );
}