import { notFound } from "next/navigation";
import getFiliationFileData from "@/app/(pages)/(protected)/patients/filiation-files/[id]/service";

interface Props {
    params: { id: string };
}

function formatDate(dateString: string): string {
    try {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch {
        return dateString;
    }
}

function InfoSection({ title, children, iconColor = "blue" }: { title: string; children: React.ReactNode; iconColor?: "blue" | "green" | "purple" | "amber" }) {
    const colorClasses = {
        blue: "border-blue-200 bg-blue-50/50",
        green: "border-green-200 bg-green-50/50",
        purple: "border-purple-200 bg-purple-50/50",
        amber: "border-amber-200 bg-amber-50/50"
    };
    
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <div className={`px-6 py-4 border-b ${colorClasses[iconColor]}`}>
                <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
            </div>
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {children}
                </div>
            </div>
        </div>
    );
}

function InfoField({ label, value }: { label: string; value: string | number | undefined }) {
    if (!value && value !== 0) return null;
    
    return (
        <div className="space-y-1">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide block">{label}</span>
            <p className="text-sm text-gray-900 leading-relaxed">{value}</p>
        </div>
    );
}

export default async function FiliationFilePage({ params }: Props) {
    const { id } = await params;

    // Convertir el id de string a number para el service
    const idNumber = parseInt(id, 10);
    if (isNaN(idNumber)) {
        console.error('❌ Page: ID inválido:', id);
        notFound();
    }

    try {
        const data = await getFiliationFileData(idNumber);

        const patient = data.patient;
        const therapist = data.therapist;

        return (
            <main className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
                    {/* Header */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                                    Ficha de Filiación <span className="text-blue-600">#{id}</span>
                                </h1>
                                <div className="flex flex-wrap gap-2">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
                                        v{data.versionNumber}
                                    </span>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                                        {data.assessmentType}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    <span><strong>Evaluación:</strong> {formatDate(data.scheduledAt)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                                    <span><strong>Creación:</strong> {formatDate(data.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        {/* Columna izquierda - Información del Paciente */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Información del Paciente */}
                            <InfoSection title="Información del Paciente" iconColor="blue">
                    <InfoField 
                        label="Nombre Completo" 
                        value={`${patient.firstNames} ${patient.paternalSurname} ${patient.maternalSurname}`.trim()} 
                    />
                    <InfoField label="Edad Actual" value={`${patient.currentAge} años`} />
                    <InfoField label="Tipo de Documento" value={patient.documentType} />
                    <InfoField label="Número de Documento" value={patient.identityDocumentNumber} />
                    <InfoField label="Género" value={patient.gender} />
                    <InfoField label="Fecha de Nacimiento" value={formatDate(patient.birthDate)} />
                    <InfoField label="Lugar de Nacimiento" value={patient.birthPlace} />
                    <InfoField label="País" value={patient.country} />
                    <InfoField label="Estado Civil" value={patient.maritalStatus} />
                    <InfoField label="Religión" value={patient.religion} />
                    <InfoField label="Teléfono" value={patient.phone} />
                    <InfoField label="Email" value={patient.email} />
                    <InfoField label="Dirección Actual" value={patient.currentAddress} />
                    <InfoField label="Distrito" value={patient.district} />
                    <InfoField label="Provincia" value={patient.province} />
                    <InfoField label="Región" value={patient.region} />
                    <InfoField label="Ocupación" value={patient.occupation} />
                    <InfoField label="Nivel Educativo" value={patient.educationLevel} />
                    <InfoField label="Institución Educativa Actual" value={patient.currentEducationalInstitution} />
                    <InfoField label="Edad al Primera Cita" value={`${patient.firstAppointmentAge} años`} />
                            </InfoSection>
                        </div>

                        {/* Columna derecha - Información del Terapeuta */}
                        <div className="space-y-6">
                            <InfoSection title="Terapeuta Asignado" iconColor="green">
                                <InfoField 
                                    label="Nombre Completo" 
                                    value={`${therapist.firstNames} ${therapist.paternalSurname} ${therapist.maternalSurname}`.trim()} 
                                />
                                <InfoField label="Especialidad" value={therapist.specialtyName} />
                                <InfoField label="Tipo de Documento" value={therapist.documentType} />
                                <InfoField label="Número de Documento" value={therapist.identityDocumentNumber} />
                                <InfoField label="Email" value={therapist.email} />
                                <InfoField label="Teléfono" value={therapist.phone} />
                                <div className="md:col-span-2">
                                    <InfoField label="Dirección de Atención" value={therapist.attentionPlaceAddress} />
                                </div>
                            </InfoSection>
                        </div>
                    </div>

                    {/* Información Clínica - Full Width */}
                    <InfoSection title="Información Clínica" iconColor="purple">
                        <div className="md:col-span-2 space-y-6">
                            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4">
                                <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide block mb-2">Descripción</span>
                                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">{data.description}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-lg p-4">
                                    <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide block mb-2">Diagnóstico</span>
                                    <p className="text-sm text-gray-800 leading-relaxed font-medium whitespace-pre-line">{data.diagnostic}</p>
                                </div>
                                <div className="bg-green-50 border-l-4 border-green-500 rounded-r-lg p-4">
                                    <span className="text-xs font-semibold text-green-700 uppercase tracking-wide block mb-2">Tratamiento</span>
                                    <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">{data.treatment}</p>
                                </div>
                            </div>
                        </div>
                    </InfoSection>
                </div>
            </main>
        );
    } catch (error) {
        console.error('❌ Page: Error al cargar datos:', error);
        notFound();
    }
}
