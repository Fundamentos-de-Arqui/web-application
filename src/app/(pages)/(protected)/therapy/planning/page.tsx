'use client';

import {Title2, Text} from "@fluentui/react-components";

export default function TherapyPlanningPage() {
    return (
        <div>
            <Title2>Therapy Planning Overview</Title2>
            <Text size={400} block>
                This page allows to query therapy plans based on patient and current status.
            </Text>
        </div>
    );
}