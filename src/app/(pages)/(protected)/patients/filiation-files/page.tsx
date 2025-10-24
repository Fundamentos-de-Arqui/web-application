'use client';

import {Title2, Text} from "@fluentui/react-components";

export default function PatientsFiliationFilesPage() {
    return (
        <div>
            <Title2>Patient's Filiation Files Overview</Title2>
            <Text size={400} block>
                This page allows to seek patient's data and manage permissions for the therapists to access to it.
            </Text>
        </div>
    );
}