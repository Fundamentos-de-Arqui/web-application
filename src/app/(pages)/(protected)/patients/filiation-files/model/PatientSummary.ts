type DocumentType = "DNI" | "CE"
export type Status = "ACTIVE" | "INACTIVE" | "ARCHIVED"

export interface PatientSummary {
    id: number,
    status: Status,
    name: string,
    documentNumber: string,
    documentType: DocumentType,
    legalGuardianName: string,
    legalGuardianPhone: string,
    initialAssessmentDate: Date
}