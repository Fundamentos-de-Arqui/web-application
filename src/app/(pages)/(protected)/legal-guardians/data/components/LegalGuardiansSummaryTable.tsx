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
import { LegalGuardianProfile } from "../service";

interface LegalGuardiansSummaryTableProps {
    guardians: LegalGuardianProfile[];
}

export const columns: TableColumnDefinition<LegalGuardianProfile>[] = [
    createTableColumn<LegalGuardianProfile>({
        columnId: "name",
        compare: (a, b) => `${a.firstNames} ${a.paternalSurname}`.localeCompare(`${b.firstNames} ${b.paternalSurname}`),
        renderHeaderCell: () => "Nombre",
        renderCell: (guardian) => <TableCellLayout>{`${guardian.firstNames} ${guardian.paternalSurname} ${guardian.maternalSurname}`}</TableCellLayout>,
    }),
    createTableColumn<LegalGuardianProfile>({
        columnId: "documentType",
        compare: (a, b) => a.documentType.localeCompare(b.documentType),
        renderHeaderCell: () => "Tipo de documento",
        renderCell: (guardian) => <TableCellLayout>{guardian.documentType}</TableCellLayout>,
    }),
    createTableColumn<LegalGuardianProfile>({
        columnId: "documentNumber",
        compare: (a, b) => a.identityDocumentNumber.localeCompare(b.identityDocumentNumber),
        renderHeaderCell: () => "Número de documento",
        renderCell: (guardian) => <TableCellLayout>{guardian.identityDocumentNumber}</TableCellLayout>,
    }),
    createTableColumn<LegalGuardianProfile>({
        columnId: "relationship",
        compare: (a, b) => a.relationship.localeCompare(b.relationship),
        renderHeaderCell: () => "Relación",
        renderCell: (guardian) => <TableCellLayout>{guardian.relationship}</TableCellLayout>,
    }),
    createTableColumn<LegalGuardianProfile>({
        columnId: "email",
        compare: (a, b) => a.email.localeCompare(b.email),
        renderHeaderCell: () => "Email",
        renderCell: (guardian) => <TableCellLayout>{guardian.email}</TableCellLayout>,
    }),
    createTableColumn<LegalGuardianProfile>({
        columnId: "phone",
        compare: (a, b) => a.phone.localeCompare(b.phone),
        renderHeaderCell: () => "Teléfono",
        renderCell: (guardian) => <TableCellLayout>{guardian.phone}</TableCellLayout>,
    }),
];

export default function LegalGuardiansSummaryTable({ guardians }: LegalGuardiansSummaryTableProps) {
    return (
        <DataGrid items={guardians} columns={columns} focusMode="composite" sortable style={{flex: '1'}}>
            <DataGridHeader>
                <DataGridRow>
                    {({ renderHeaderCell }) => (
                        <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
                    )}
                </DataGridRow>
            </DataGridHeader>

            <DataGridBody<LegalGuardianProfile>>
                {({ item, rowId }) => (
                    <DataGridRow<LegalGuardianProfile> key={rowId}>
                        {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
                    </DataGridRow>
                )}
            </DataGridBody>
        </DataGrid>
    );
}