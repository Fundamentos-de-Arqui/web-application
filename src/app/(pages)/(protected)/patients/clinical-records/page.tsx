'use client';

import {Title2, Text} from "@fluentui/react-components";

export default function PatientsClinicalRecordsPage() {
    return (
        <div>
            <Title2>Patient's Clinical Records Overview</Title2>
            <Text size={400} block>
                This page allows to seek patient's medical records and configure access to them from the therapists.
            </Text>
        </div>
    );
}