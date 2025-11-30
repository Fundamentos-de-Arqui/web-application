'use client';

import React, { useState, useEffect } from 'react';
import styles from './data.module.css';
import {
    Title1,
    Text,
    Button,
    Spinner,
    Card,
    CardHeader,
    CardPreview,
    Toast,
    ToastTitle,
    ToastBody,
    useToastController,
    Toaster,
    useId,
    Badge
} from "@fluentui/react-components";
import { 
    PersonBriefcase20Regular, 
    ArrowClockwise20Regular,
    Person20Regular,
    Mail20Regular,
    Phone20Regular,
    DocumentText20Regular,
    Location20Regular,
    Heart20Regular
} from "@fluentui/react-icons";
import { fetchTherapistsProfiles, getMockTherapistsData, TherapistProfile } from './service';

export default function TherapistsDataPage() {
    const toasterId = useId("toaster");
    const { dispatchToast } = useToastController(toasterId);
    
    const [loading, setLoading] = useState(true);
    const [therapists, setTherapists] = useState<TherapistProfile[]>([]);
    const [error, setError] = useState<string | null>(null);

    const loadTherapists = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const result = await fetchTherapistsProfiles();
            
            if (result.success && result.data) {
                setTherapists(result.data);
                dispatchToast(
                    <Toast>
                        <ToastTitle>Datos cargados</ToastTitle>
                        <ToastBody>{`Se encontraron ${result.data.length} terapeutas`}</ToastBody>
                    </Toast>,
                    { intent: "success" }
                );
            } else {
                // Fallback to mock data in case of API failure
                const mockData = getMockTherapistsData();
                setTherapists(mockData);
                dispatchToast(
                    <Toast>
                        <ToastTitle>Modo Demo</ToastTitle>
                        <ToastBody>Mostrando datos de ejemplo</ToastBody>
                    </Toast>,
                    { intent: "warning" }
                );
            }
        } catch (error) {
            console.error('Error loading therapists:', error);
            setError('Error al cargar los datos de terapeutas');
            
            // Fallback to mock data
            const mockData = getMockTherapistsData();
            setTherapists(mockData);
            
            dispatchToast(
                <Toast>
                    <ToastTitle>Error</ToastTitle>
                    <ToastBody>Error al conectar con el servidor. Mostrando datos de ejemplo.</ToastBody>
                </Toast>,
                { intent: "error" }
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTherapists();
    }, []);

    const renderTherapistCard = (therapist: TherapistProfile) => (
        <Card key={therapist.id} className={styles.profileCard}>
            <CardHeader
                image={<PersonBriefcase20Regular />}
                header={
                    <div className={styles.profileHeader}>
                        <Text weight="semibold" size={500}>
                            {therapist.firstNames} {therapist.paternalSurname} {therapist.maternalSurname}
                        </Text>
                        <Badge color="brand" size="small">ID: {therapist.id}</Badge>
                    </div>
                }
            />
            <CardPreview>
                <div className={styles.profileGrid}>
                    <div className={styles.profileField}>
                        <div className={styles.fieldLabel}>
                            <Person20Regular /> Documento
                        </div>
                        <div className={styles.fieldValue}>
                            {therapist.documentType}: {therapist.identityDocumentNumber}
                        </div>
                    </div>
                    
                    <div className={styles.profileField}>
                        <div className={styles.fieldLabel}>
                            <Mail20Regular /> Email
                        </div>
                        <div className={styles.fieldValue}>
                            {therapist.email}
                        </div>
                    </div>
                    
                    <div className={styles.profileField}>
                        <div className={styles.fieldLabel}>
                            <Phone20Regular /> Teléfono
                        </div>
                        <div className={styles.fieldValue}>
                            {therapist.phone}
                        </div>
                    </div>
                    
                    <div className={styles.profileField}>
                        <div className={styles.fieldLabel}>
                            <Heart20Regular /> Especialidad
                        </div>
                        <div className={styles.fieldValue}>
                            {therapist.specialtyName}
                        </div>
                    </div>
                    
                    <div className={styles.profileField} style={{ gridColumn: 'span 2' }}>
                        <div className={styles.fieldLabel}>
                            <Location20Regular /> Dirección de Atención
                        </div>
                        <div className={styles.fieldValue}>
                            {therapist.attentionPlaceAddress}
                        </div>
                    </div>
                </div>
            </CardPreview>
        </Card>
    );

    return (
        <div className="main-column">
            <div className={styles.headerDiv}>
                <Title1>Datos de Terapeutas</Title1>
                <Text size={500} block>
                    Consulte y revise la información de los terapeutas registrados en el sistema.
                </Text>
            </div>
            
            <div className={styles.dataDiv}>
                <Button
                    appearance="secondary"
                    icon={<ArrowClockwise20Regular />}
                    onClick={loadTherapists}
                    disabled={loading}
                    className={styles.refreshButton}
                >
                    Actualizar Datos
                </Button>

                {loading && (
                    <div className={styles.loadingContainer}>
                        <Spinner size="large" />
                        <Text>Cargando datos de terapeutas...</Text>
                    </div>
                )}

                {!loading && error && (
                    <div className={styles.errorContainer}>
                        <Text size={400} color="danger">
                            {error}
                        </Text>
                    </div>
                )}

                {!loading && !error && therapists.length === 0 && (
                    <div className={styles.emptyContainer}>
                        <PersonBriefcase20Regular style={{ fontSize: '48px' }} />
                        <Text size={500} weight="semibold">
                            No se encontraron terapeutas
                        </Text>
                        <Text size={400}>
                            No hay terapeutas registrados en el sistema.
                        </Text>
                    </div>
                )}

                {!loading && !error && therapists.length > 0 && (
                    <div className={styles.tableContainer}>
                        <Text size={400} block style={{ marginBottom: '16px' }}>
                            Total de terapeutas: {therapists.length}
                        </Text>
                        {therapists.map(renderTherapistCard)}
                    </div>
                )}
            </div>

            <Toaster toasterId={toasterId} />
        </div>
    );
}