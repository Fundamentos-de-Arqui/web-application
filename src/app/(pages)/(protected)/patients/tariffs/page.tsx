'use client';

import {Title2, Text} from "@fluentui/react-components";

export default function PatientsTariffsPage() {
    return (
        <div>
            <Title2>Patient's Tariffs Overview</Title2>
            <Text size={400} block>
                This page allows to query and set each patient's assigned tariffs for each therapy modality.
            </Text>
        </div>
    );
}