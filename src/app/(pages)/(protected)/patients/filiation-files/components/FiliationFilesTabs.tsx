import { TabList, Tab } from '@fluentui/react-tabs';
import React from "react";

const PATIENTS_NAME_SPACE = "patients"

const FILIATION_TABS = [
    { value: 1, key: 'active', translationKey: 'Activos' },
    { value: 2, key: 'inactive', translationKey: 'Inactivos' },
    { value: 3, key: 'archived', translationKey: 'Archivados' },
];

interface PatientsFiliationFilesTabsProps {
    activeTab: number;
    setTab: React.Dispatch<React.SetStateAction<number>>;
}

export default function FiliationFilesTabs({ activeTab, setTab }: PatientsFiliationFilesTabsProps) {
    return (
        <TabList
            selectedValue={activeTab}
        >
            {FILIATION_TABS.map((tab) => (
                <Tab
                    key={tab.key}
                    value={tab.value}
                    onClick={() => setTab(tab.value)}
                >
                    {tab.translationKey}
                </Tab>
            ))}
        </TabList>
    );
}