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
    Guardian20Regular, 
    ArrowClockwise20Regular,
    Person20Regular,
    Mail20Regular,
    Phone20Regular,
    DocumentText20Regular,
    People20Regular
} from "@fluentui/react-icons";
import { fetchLegalGuardiansProfiles, getMockLegalGuardiansData, LegalGuardianProfile } from './service';

export default function LegalGuardiansDataPage() {
    const toasterId = useId("toaster");
    const { dispatchToast } = useToastController(toasterId);
    
    const [loading, setLoading] = useState(true);
    const [guardians, setGuardians] = useState<LegalGuardianProfile[]>([]);
    const [error, setError] = useState<string | null>(null);

    const loadGuardians = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const result = await fetchLegalGuardiansProfiles();
            
            if (result.success && result.data) {
                setGuardians(result.data);
                dispatchToast(
                    <Toast>
                        <ToastTitle>Datos cargados</ToastTitle>
                        <ToastBody>{`Se encontraron ${result.data.length} responsables legales`}</ToastBody>
                    </Toast>,
                    { intent: "success" }
                );
            } else {
                // Fallback to mock data in case of API failure
                const mockData = getMockLegalGuardiansData();
                setGuardians(mockData);
                dispatchToast(
                    <Toast>
                        <ToastTitle>Modo Demo</ToastTitle>
                        <ToastBody>Mostrando datos de ejemplo</ToastBody>
                    </Toast>,
                    { intent: "warning" }
                );
            }
        } catch (error) {
            console.error('Error loading guardians:', error);
            setError('Error al cargar los datos de responsables legales');
            
            // Fallback to mock data
            const mockData = getMockLegalGuardiansData();
            setGuardians(mockData);
            
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
        loadGuardians();
    }, []);

    const renderGuardianCard = (guardian: LegalGuardianProfile) => (
        <Card key={guardian.id} className={styles.profileCard}>
            <CardHeader
                image={<Guardian20Regular />}
                header={
                    <div className={styles.profileHeader}>
                        <Text weight="semibold" size={500}>
                            {guardian.firstNames} {guardian.paternalSurname} {guardian.maternalSurname}
                        </Text>
                        <Badge color="brand" size="small">ID: {guardian.id}</Badge>
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
                            {guardian.documentType}: {guardian.identityDocumentNumber}
                        </div>
                    </div>
                    
                    <div className={styles.profileField}>
                        <div className={styles.fieldLabel}>
                            <Mail20Regular /> Email
                        </div>
                        <div className={styles.fieldValue}>
                            {guardian.email}
                        </div>
                    </div>
                    
                    <div className={styles.profileField}>
                        <div className={styles.fieldLabel}>
                            <Phone20Regular /> Teléfono
                        </div>
                        <div className={styles.fieldValue}>
                            {guardian.phone}
                        </div>
                    </div>
                    
                    <div className={styles.profileField}>
                        <div className={styles.fieldLabel}>
                            <People20Regular /> Relación
                        </div>
                        <div className={styles.fieldValue}>
                            {guardian.relationship}
                        </div>
                    </div>
                </div>
            </CardPreview>
        </Card>
    );

    return (
        <div className="main-column">
            <div className={styles.headerDiv}>
                <Title1>Datos de Responsables Legales</Title1>
                <Text size={500} block>
                    Consulte y revise la información de los responsables legales registrados en el sistema.
                </Text>
            </div>
            
            <div className={styles.dataDiv}>
                <Button
                    appearance="secondary"
                    icon={<ArrowClockwise20Regular />}
                    onClick={loadGuardians}
                    disabled={loading}
                    className={styles.refreshButton}
                >
                    Actualizar Datos
                </Button>

                {loading && (
                    <div className={styles.loadingContainer}>
                        <Spinner size="large" />
                        <Text>Cargando datos de responsables legales...</Text>
                    </div>
                )}

                {!loading && error && (
                    <div className={styles.errorContainer}>
                        <Text size={400} color="danger">
                            {error}
                        </Text>
                    </div>
                )}

                {!loading && !error && guardians.length === 0 && (
                    <div className={styles.emptyContainer}>
                        <Guardian20Regular style={{ fontSize: '48px' }} />
                        <Text size={500} weight="semibold">
                            No se encontraron responsables legales
                        </Text>
                        <Text size={400}>
                            No hay responsables legales registrados en el sistema.
                        </Text>
                    </div>
                )}

                {!loading && !error && guardians.length > 0 && (
                    <div className={styles.tableContainer}>
                        <Text size={400} block style={{ marginBottom: '16px' }}>
                            Total de responsables legales: {guardians.length}
                        </Text>
                        {guardians.map(renderGuardianCard)}
                    </div>
                )}
            </div>

            <Toaster toasterId={toasterId} />
        </div>
    );
}