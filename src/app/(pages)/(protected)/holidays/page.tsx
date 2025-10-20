'use client';

import {Title2, Text} from "@fluentui/react-components";

export default function HolidaysPage() {
    return (
        <div>
            <Title2>Holidays Overview</Title2>
            <Text size={400} block>
                This page allows to set dates as holidays, ensuring law compliance with national holidays from all business bounded contexts.
            </Text>
        </div>
    );
}