import React, {useEffect} from 'react';
import { TabList, Tab } from '@fluentui/react-tabs';
import {useI18n} from "@/app/providers/i18n";

const PATIENTS_NAME_SPACE = "patients"

const FILIATION_TABS = [
    { value: 1, key: 'active', translationKey: 'active' },
    { value: 2, key: 'inactive', translationKey: 'inactive' },
    { value: 3, key: 'archived', translationKey: 'archived' },
];

interface PatientsFiliationFilesTabsProps {
    activeTab: number;
    setTab: React.Dispatch<React.SetStateAction<number>>;
}

export default function FiliationFilesTabs({ activeTab, setTab }: PatientsFiliationFilesTabsProps) {
    const i18n = useI18n();

    useEffect(() => {
        void i18n.loadChunk(PATIENTS_NAME_SPACE);
    }, [i18n.loadChunk])

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
                    {i18n.t(PATIENTS_NAME_SPACE, tab.translationKey)}
                </Tab>
            ))}
        </TabList>
    );
}