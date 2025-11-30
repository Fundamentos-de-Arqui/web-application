'use client';

import React, { useState } from 'react';
import styles from './accounts.module.css';
import {
    Title1,
    Text,
    Card,
    CardHeader,
    CardPreview,
    Input,
    Field,
    Button,
    Combobox,
    Option,
    Toast,
    ToastTitle,
    ToastBody,
    useToastController,
    Toaster,
    useId,
    Spinner
} from "@fluentui/react-components";
import { Person20Regular, PersonAdd20Regular } from "@fluentui/react-icons";
import { registerTherapist, TherapistRegistrationRequest } from './service';

export default function TherapistsAccountsPage() {
    const toasterId = useId("toaster");
    const { dispatchToast } = useToastController(toasterId);
    
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<TherapistRegistrationRequest>({
        password: '',
        firstNames: '',
        paternalSurname: '',
        maternalSurname: '',
        identityDocumentNumber: '',
        documentType: 'DNI',
        phone: '',
        email: '',
        specialtyName: '',
        attentionPlaceAddress: ''
    });

    const handleInputChange = (field: keyof TherapistRegistrationRequest, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const validateForm = (): string[] => {
        const errors: string[] = [];
        
        if (!formData.firstNames.trim()) errors.push("Los nombres son requeridos");
        if (!formData.paternalSurname.trim()) errors.push("El apellido paterno es requerido");
        if (!formData.maternalSurname.trim()) errors.push("El apellido materno es requerido");
        if (!formData.identityDocumentNumber.trim()) errors.push("El número de documento es requerido");
        if (!formData.email.trim()) errors.push("El email es requerido");
        if (!formData.phone.trim()) errors.push("El teléfono es requerido");
        if (!formData.password.trim()) errors.push("La contraseña es requerida");
        if (!formData.specialtyName.trim()) errors.push("La especialidad es requerida");
        if (!formData.attentionPlaceAddress.trim()) errors.push("La dirección de atención es requerida");
        
        // Validaciones adicionales
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            errors.push("El email no es válido");
        }
        
        if (formData.password && formData.password.length < 5) {
            errors.push("La contraseña debe tener al menos 5 caracteres");
        }

        return errors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const errors = validateForm();
        if (errors.length > 0) {
            dispatchToast(
                <Toast>
                    <ToastTitle>Errores de validación</ToastTitle>
                    <ToastBody>{errors.join(", ")}</ToastBody>
                </Toast>,
                { intent: "error" }
            );
            return;
        }

        setLoading(true);
        
        try {
            const result = await registerTherapist(formData);
            
            if (result.success) {
                dispatchToast(
                    <Toast>
                        <ToastTitle>Éxito</ToastTitle>
                        <ToastBody>{result.message}</ToastBody>
                    </Toast>,
                    { intent: "success" }
                );
                
                // Reset form
                setFormData({
                    password: '',
                    firstNames: '',
                    paternalSurname: '',
                    maternalSurname: '',
                    identityDocumentNumber: '',
                    documentType: 'DNI',
                    phone: '',
                    email: '',
                    specialtyName: '',
                    attentionPlaceAddress: ''
                });
            } else {
                dispatchToast(
                    <Toast>
                        <ToastTitle>Error</ToastTitle>
                        <ToastBody>{result.message}</ToastBody>
                    </Toast>,
                    { intent: "error" }
                );
            }
        } catch (error) {
            dispatchToast(
                <Toast>
                    <ToastTitle>Error</ToastTitle>
                    <ToastBody>Error inesperado al registrar terapeuta</ToastBody>
                </Toast>,
                { intent: "error" }
            );
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            password: '',
            firstNames: '',
            paternalSurname: '',
            maternalSurname: '',
            identityDocumentNumber: '',
            documentType: 'DNI',
            phone: '',
            email: '',
            specialtyName: '',
            attentionPlaceAddress: ''
        });
    };

    return (
        <div className="main-column">
            <div className={styles.headerDiv}>
                <Title1>Registro de Terapeutas</Title1>
                <Text size={500} block>
                    Complete el formulario para registrar un nuevo terapeuta en el sistema.
                </Text>
            </div>
            
            <div className={styles.formDiv}>
                <div className={styles.formContainer}>
                    <Card className={styles.formCard}>
                        <CardHeader
                            image={<Person20Regular />}
                            header={<Text weight="semibold" size={400}>Información del Terapeuta</Text>}
                        />
                        <CardPreview>
                            <form onSubmit={handleSubmit}>
                                <div className={styles.formGrid}>
                                    <div className={styles.formRow}>
                                        <Field label="Nombres" required>
                                            <Input
                                                value={formData.firstNames}
                                                onChange={(_, data) => handleInputChange('firstNames', data.value)}
                                                placeholder="Ingrese los nombres"
                                                disabled={loading}
                                                size="large"
                                            />
                                        </Field>
                                    </div>
                                    
                                    <div className={styles.formRow}>
                                        <Field label="Apellido Paterno" required>
                                            <Input
                                                value={formData.paternalSurname}
                                                onChange={(_, data) => handleInputChange('paternalSurname', data.value)}
                                                placeholder="Ingrese el apellido paterno"
                                                disabled={loading}
                                                size="large"
                                            />
                                        </Field>
                                    </div>

                                    <div className={styles.formRow}>
                                        <Field label="Apellido Materno" required>
                                            <Input
                                                value={formData.maternalSurname}
                                                onChange={(_, data) => handleInputChange('maternalSurname', data.value)}
                                                placeholder="Ingrese el apellido materno"
                                                disabled={loading}
                                                size="large"
                                            />
                                        </Field>
                                    </div>
                                    
                                    <div className={styles.formRow}>
                                        <Field label="Tipo de Documento" required>
                                            <Combobox
                                                value={formData.documentType}
                                                onOptionSelect={(_, data) => handleInputChange('documentType', data.optionValue as "DNI" | "RUC" | "PASSPORT" | "OTHER")}
                                                disabled={loading}
                                                size="large"
                                            >
                                                <Option value="DNI">DNI</Option>
                                                <Option value="RUC">RUC</Option>
                                                <Option value="PASSPORT">PASSPORT</Option>
                                                <Option value="OTHER">OTHER</Option>
                                            </Combobox>
                                        </Field>
                                    </div>

                                    <div className={styles.formRow}>
                                        <Field label="Número de Documento" required>
                                            <Input
                                                value={formData.identityDocumentNumber}
                                                onChange={(_, data) => handleInputChange('identityDocumentNumber', data.value)}
                                                placeholder="Ingrese el número de documento"
                                                disabled={loading}
                                                size="large"
                                            />
                                        </Field>
                                    </div>
                                    
                                    <div className={styles.formRow}>
                                        <Field label="Teléfono" required>
                                            <Input
                                                value={formData.phone}
                                                onChange={(_, data) => handleInputChange('phone', data.value)}
                                                placeholder="Ej: +51987123456"
                                                disabled={loading}
                                                size="large"
                                            />
                                        </Field>
                                    </div>

                                    <div className={styles.formRow}>
                                        <Field label="Email" required>
                                            <Input
                                                type="email"
                                                value={formData.email}
                                                onChange={(_, data) => handleInputChange('email', data.value)}
                                                placeholder="correo@ejemplo.com"
                                                disabled={loading}
                                                size="large"
                                            />
                                        </Field>
                                    </div>
                                    
                                    <div className={styles.formRow}>
                                        <Field label="Especialidad" required>
                                            <Input
                                                value={formData.specialtyName}
                                                onChange={(_, data) => handleInputChange('specialtyName', data.value)}
                                                placeholder="Ej: Psicología, Terapia Física"
                                                disabled={loading}
                                                size="large"
                                            />
                                        </Field>
                                    </div>

                                    <div className={`${styles.formRow} ${styles.fullWidth}`}>
                                        <Field label="Dirección de Atención" required>
                                            <Input
                                                value={formData.attentionPlaceAddress}
                                                onChange={(_, data) => handleInputChange('attentionPlaceAddress', data.value)}
                                                placeholder="Ej: Av. Salud 456, Consultorio 302"
                                                disabled={loading}
                                                size="large"
                                            />
                                        </Field>
                                    </div>

                                    <div className={`${styles.formRow} ${styles.fullWidth}`}>
                                        <Field label="Contraseña" required>
                                            <Input
                                                type="password"
                                                value={formData.password}
                                                onChange={(_, data) => handleInputChange('password', data.value)}
                                                placeholder="Mínimo 5 caracteres"
                                                disabled={loading}
                                                size="large"
                                            />
                                        </Field>
                                    </div>
                                </div>

                                <div className={styles.buttonGroup}>
                                    <Button
                                        appearance="primary"
                                        type="submit"
                                        icon={loading ? <Spinner size="tiny" /> : <PersonAdd20Regular />}
                                        disabled={loading}
                                        size="large"
                                    >
                                        {loading ? (
                                            <span className={styles.loadingContainer}>
                                                Registrando...
                                            </span>
                                        ) : (
                                            'Registrar Terapeuta'
                                        )}
                                    </Button>
                                    
                                    <Button
                                        type="button"
                                        onClick={resetForm}
                                        disabled={loading}
                                        size="large"
                                    >
                                        Limpiar Formulario
                                    </Button>
                                </div>
                            </form>
                        </CardPreview>
                    </Card>
                </div>
            </div>

            <Toaster toasterId={toasterId} />
        </div>
    );
}