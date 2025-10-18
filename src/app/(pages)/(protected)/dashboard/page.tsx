'use client';

import {Title2, Text} from "@fluentui/react-components";

export default function DashboardPage() {
    return (
        <div>
            <Title2>Dashboard Overview</Title2>
            <Text size={400} block>
                This is the main dashboard area. Content organized here provides key insights and quick access to application features.
            </Text>
        </div>
    );
}