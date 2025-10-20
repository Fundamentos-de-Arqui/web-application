'use client';

import {Title2, Text} from "@fluentui/react-components";

export default function AnalyticsPage() {
    return (
        <div>
            <Title2>Analytics Overview</Title2>
            <Text size={400} block>
                This is the analytics area. This page offers a big picture access to key business indicators and allows to access more detailed graphs with configurable parameters.
            </Text>
        </div>
    );
}