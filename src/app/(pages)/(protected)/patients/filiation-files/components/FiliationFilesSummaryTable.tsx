'use client';

import {
    createTableColumn,
    DataGrid,
    DataGridBody,
    DataGridCell,
    DataGridHeader,
    DataGridHeaderCell,
    DataGridRow,
    TableCellLayout,
    TableColumnDefinition,
} from '@fluentui/react-components';
import {PatientSummary} from "@/app/(pages)/(protected)/patients/filiation-files/model/PatientSummary";
import {OpenFileButton} from "@/app/components/shared/OpenFileButton";
import {useI18n} from "@/app/providers/i18n";
import {flex} from "@griffel/core/src/shorthands";

const PATIENTS_NAME_SPACE = "patients"

interface PatientsFiliationFilesTableProps {
    patients: PatientSummary[];
}

export const columns: TableColumnDefinition<PatientSummary>[] = [
    createTableColumn<PatientSummary>({
        columnId: "name",
        compare: (a, b) => a.name.localeCompare(b.name),
        renderHeaderCell: () => useI18n().t(PATIENTS_NAME_SPACE, "name-table-header"),
        renderCell: (patient) => <TableCellLayout>{patient.name}</TableCellLayout>,
    }),
    createTableColumn<PatientSummary>({
        columnId: "documentType",
        compare: (a, b) => a.documentType.localeCompare(b.documentType),
        renderHeaderCell: () => useI18n().t(PATIENTS_NAME_SPACE, "document-type-table-header"),
        renderCell: (patient) => <TableCellLayout>{patient.documentType}</TableCellLayout>,
    }),
    createTableColumn<PatientSummary>({
        columnId: "documentTag",
        compare: (a, b) => a.documentNumber.localeCompare(b.documentNumber),
        renderHeaderCell: () => useI18n().t(PATIENTS_NAME_SPACE, "document-tag-table-header"),
        renderCell: (patient) => <TableCellLayout>{patient.documentNumber}</TableCellLayout>,
    }),
    createTableColumn<PatientSummary>({
        columnId: "legalGuardian",
        compare: (a, b) => a.legalGuardianName.localeCompare(b.legalGuardianName),
        renderHeaderCell: () => useI18n().t(PATIENTS_NAME_SPACE, "legal-guardian-table-header"),
        renderCell: (patient) => <TableCellLayout>{patient.legalGuardianName}</TableCellLayout>,
    }),
    createTableColumn<PatientSummary>({
        columnId: "legalGuardianPhone",
        compare: (a, b) => a.legalGuardianPhone.localeCompare(b.legalGuardianPhone),
        renderHeaderCell: () => useI18n().t(PATIENTS_NAME_SPACE, "legal-guardian-phone-table-header"),
        renderCell: (patient) => <TableCellLayout>{patient.legalGuardianPhone}</TableCellLayout>,
    }),
    createTableColumn<PatientSummary>({
        columnId: "initialAssessmentDate",
        compare: (a, b) => a.initialAssessmentDate.getTime() - b.initialAssessmentDate.getTime(),
        renderHeaderCell: () => useI18n().t(PATIENTS_NAME_SPACE, "initial-assessment-date-table-header"),
        renderCell: (patient) => (
            <TableCellLayout>
                {patient.initialAssessmentDate.toLocaleDateString()}
            </TableCellLayout>
        ),
    }),
    createTableColumn<PatientSummary>({
        columnId: "singleAction",
        renderHeaderCell: () => "",
        renderCell: (patient) => (
            <OpenFileButton
                namespace={PATIENTS_NAME_SPACE}
                id={patient.id.toString()}
            />
        ),
    }),
];

export default function FiliationFilesSummaryTable({ patients }: PatientsFiliationFilesTableProps) {
    return (
        <DataGrid items={patients} columns={columns} focusMode="composite" sortable style={{flex: '1'}}>
            <DataGridHeader>
                <DataGridRow>
                    {({ renderHeaderCell }) => (
                        <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
                    )}
                </DataGridRow>
            </DataGridHeader>

            <DataGridBody<PatientSummary>>
                {({ item, rowId }) => (
                    <DataGridRow<PatientSummary> key={rowId}>
                        {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
                    </DataGridRow>
                )}
            </DataGridBody>
        </DataGrid>
    );
}
