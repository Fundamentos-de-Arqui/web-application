'use client';

import { useState, useEffect } from 'react';
import { Button, Text, makeStyles, Spinner } from '@fluentui/react-components';
import { ArrowUpload24Regular, Document24Regular } from '@fluentui/react-icons';
import { useI18n } from '@/app/providers/i18n';
import { uploadExcelFile } from '../service';

const PATIENTS_NAME_SPACE = 'patients';

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '16px',
        border: '1px solid #e1dfdd',
        borderRadius: '4px',
        backgroundColor: '#faf9f8',
        marginBottom: '16px',
    },
    uploadArea: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
    },
    fileInput: {
        display: 'none',
    },
    fileInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flex: 1,
        minWidth: '200px',
    },
    statusText: {
        marginTop: '4px',
    },
});

export default function ExcelImportArea() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
    const styles = useStyles();
    const i18n = useI18n();

    useEffect(() => {
        void i18n.loadChunk(PATIENTS_NAME_SPACE);
    }, [i18n.loadChunk]);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validar que sea un archivo Excel
            const validExtensions = ['.xlsx', '.xls'];
            const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
            
            if (validExtensions.includes(fileExtension)) {
                setSelectedFile(file);
                setUploadStatus({ type: null, message: '' });
            } else {
                setUploadStatus({ 
                    type: 'error', 
                    message: i18n.t(PATIENTS_NAME_SPACE, 'import-invalid-file-type') 
                });
                setSelectedFile(null);
            }
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setIsUploading(true);
        setUploadStatus({ type: null, message: '' });

        try {
            await uploadExcelFile(selectedFile);
            setUploadStatus({ 
                type: 'success', 
                message: i18n.t(PATIENTS_NAME_SPACE, 'import-success') 
            });
            setSelectedFile(null);
            // Reset file input
            const fileInput = document.getElementById('excel-file-input') as HTMLInputElement;
            if (fileInput) {
                fileInput.value = '';
            }
        } catch (error) {
            setUploadStatus({ 
                type: 'error', 
                message: error instanceof Error 
                    ? error.message 
                    : i18n.t(PATIENTS_NAME_SPACE, 'import-error') 
            });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className={styles.container}>
            <Text weight="semibold">{i18n.t(PATIENTS_NAME_SPACE, 'import-title')}</Text>
            <div className={styles.uploadArea}>
                <input
                    id="excel-file-input"
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileSelect}
                    className={styles.fileInput}
                    disabled={isUploading}
                />
                <Button
                    appearance="outline"
                    icon={<ArrowUpload24Regular />}
                    onClick={() => document.getElementById('excel-file-input')?.click()}
                    disabled={isUploading}
                >
                    {i18n.t(PATIENTS_NAME_SPACE, 'import-select-file')}
                </Button>
                
                {selectedFile && (
                    <div className={styles.fileInfo}>
                        <Document24Regular />
                        <Text>{selectedFile.name}</Text>
                    </div>
                )}

                <Button
                    appearance="primary"
                    onClick={handleUpload}
                    disabled={!selectedFile || isUploading}
                    icon={isUploading ? <Spinner size="tiny" /> : undefined}
                >
                    {isUploading 
                        ? i18n.t(PATIENTS_NAME_SPACE, 'import-uploading') 
                        : i18n.t(PATIENTS_NAME_SPACE, 'import-upload')}
                </Button>
            </div>
            
            {uploadStatus.message && (
                <Text 
                    className={styles.statusText}
                    style={{ 
                        color: uploadStatus.type === 'success' ? '#107c10' : '#d13438' 
                    }}
                >
                    {uploadStatus.message}
                </Text>
            )}
        </div>
    );
}

