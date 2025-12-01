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
import { TherapistProfile } from "../service";

interface TherapistsSummaryTableProps {
    therapists: TherapistProfile[];
}

export const columns: TableColumnDefinition<TherapistProfile>[] = [
    createTableColumn<TherapistProfile>({
        columnId: "name",
        compare: (a, b) => `${a.firstNames} ${a.paternalSurname}`.localeCompare(`${b.firstNames} ${b.paternalSurname}`),
        renderHeaderCell: () => "Nombre",
        renderCell: (therapist) => <TableCellLayout>{`${therapist.firstNames} ${therapist.paternalSurname} ${therapist.maternalSurname}`}</TableCellLayout>,
    }),
    createTableColumn<TherapistProfile>({
        columnId: "documentType",
        compare: (a, b) => a.documentType.localeCompare(b.documentType),
        renderHeaderCell: () => "Tipo de documento",
        renderCell: (therapist) => <TableCellLayout>{therapist.documentType}</TableCellLayout>,
    }),
    createTableColumn<TherapistProfile>({
        columnId: "documentNumber",
        compare: (a, b) => a.identityDocumentNumber.localeCompare(b.identityDocumentNumber),
        renderHeaderCell: () => "Número de documento",
        renderCell: (therapist) => <TableCellLayout>{therapist.identityDocumentNumber}</TableCellLayout>,
    }),
    createTableColumn<TherapistProfile>({
        columnId: "specialty",
        compare: (a, b) => a.specialtyName.localeCompare(b.specialtyName),
        renderHeaderCell: () => "Especialidad",
        renderCell: (therapist) => <TableCellLayout>{therapist.specialtyName}</TableCellLayout>,
    }),
    createTableColumn<TherapistProfile>({
        columnId: "email",
        compare: (a, b) => a.email.localeCompare(b.email),
        renderHeaderCell: () => "Email",
        renderCell: (therapist) => <TableCellLayout>{therapist.email}</TableCellLayout>,
    }),
    createTableColumn<TherapistProfile>({
        columnId: "phone",
        compare: (a, b) => a.phone.localeCompare(b.phone),
        renderHeaderCell: () => "Teléfono",
        renderCell: (therapist) => <TableCellLayout>{therapist.phone}</TableCellLayout>,
    }),
    createTableColumn<TherapistProfile>({
        columnId: "address",
        compare: (a, b) => a.attentionPlaceAddress.localeCompare(b.attentionPlaceAddress),
        renderHeaderCell: () => "Dirección de atención",
        renderCell: (therapist) => <TableCellLayout>{therapist.attentionPlaceAddress}</TableCellLayout>,
    }),
];

export default function TherapistsSummaryTable({ therapists }: TherapistsSummaryTableProps) {
    return (
        <DataGrid items={therapists} columns={columns} focusMode="composite" sortable style={{flex: '1'}}>
            <DataGridHeader>
                <DataGridRow>
                    {({ renderHeaderCell }) => (
                        <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
                    )}
                </DataGridRow>
            </DataGridHeader>

            <DataGridBody<TherapistProfile>>
                {({ item, rowId }) => (
                    <DataGridRow<TherapistProfile> key={rowId}>
                        {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
                    </DataGridRow>
                )}
            </DataGridBody>
        </DataGrid>
    );
}