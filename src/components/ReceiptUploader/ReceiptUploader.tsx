import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Button,
  InlineLoading,
  InlineNotification,
  Modal,
  Select,
  SelectItem,
  Grid,
  Column,
  Form,
  Stack,
} from '@carbon/react';
import { Upload, Document, Add } from '@carbon/icons-react';
import { ToastNotification } from '@carbon/react';
import ReceiptDetails from './ReceiptDetails';
import axios from 'axios';
import { AxiosError } from 'axios';
import styles from './ReceiptUploader.module.css';

interface ExtractedInfo {
  adSoyad?: string;
  alici?: string;
  islemNo?: string;
  tarih?: string;
  tutar?: string;  // Yeni eklenen tutar alanı
}

const ALLOWED_FORMATS = ['.jpg', '.jpeg', '.png'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const BANKS = ['Papara', 'Garanti Bank']

const API_URL = import.meta.env.VITE_APP_API_URL || 'http://app/api/v1/test';

const ReceiptUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bank, setBank] = useState('');
  const [extractedInfo, setExtractedInfo] = useState<ExtractedInfo | undefined>(undefined);
  const [notification, setNotification] = useState<{ type: string; message: string } | null>(null);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ALLOWED_FORMATS,
    },
    maxSize: MAX_FILE_SIZE,
    multiple: false,
  });

  const handlePaste = useCallback((event: ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            setFile(blob);
            setError(null);
          }
          break;
        }
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [handlePaste]);

  const uploadFile = useCallback(async () => {
    if (!file || !bank) {
      setError('Please select a file and a bank.');
      return;
    }

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('document', file);
    formData.append('docType', 'papara');

    try {
      const response = await axios.post(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setExtractedInfo(response.data.data.extractedInfo);
        setIsSuccess(true);
        setIsModalOpen(true);
        setNotification({ type: 'success', message: 'Receipt uploaded successfully!' });
      } else {
        throw new Error(response.data.message || 'API request failed');
      }
    } catch (err) {
      let errorMsg = 'An error occurred while uploading the file. Please try again.';
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;
        if (axiosError.response?.status === 500) {
          errorMsg = 'Server error. Please try uploading a different receipt or try again later.';
        } else if (axiosError.response?.status === 400) {
          errorMsg = 'Invalid request. Please check your file and try again.';
        } else if (axiosError.response?.status === 415) {
          errorMsg = 'Unsupported file type. Please upload a valid image file.';
        }
      }
      setErrorMessage(errorMsg);
      setErrorModalOpen(true);
      setNotification({ type: 'error', message: 'Failed to upload receipt.' });
    } finally {
      setIsUploading(false);
    }
  }, [file, bank]);

  const resetUpload = useCallback(() => {
    setFile(null);
    setError(null);
    setIsSuccess(false);
    setBank('');
    setExtractedInfo(undefined);
  }, []);

  return (
    <Grid narrow className={styles.receiptUploader}>
      <Column lg={16} md={8} sm={4}>
        <h2 className={styles.pageTitle}>
          <Document size={24} className={styles.iconSpacing} />
          Upload Receipt
        </h2>
        <Form>
          <Stack gap={7}>
            <div
              {...getRootProps()}
              className={`${styles.dropzone} ${isDragActive ? styles.active : ''}`}
            >
              <input {...getInputProps()} />
              {file ? (
                <p>{file.name}</p>
              ) : isDragActive ? (
                <p>Drop the file here...</p>
              ) : (
                <p>Drag and drop a file here, or click to select a file</p>
              )}
            </div>
            {file && (
              <Select
                id="bank"
                labelText="Bank"
                value={bank}
                onChange={(e) => setBank(e.target.value)}
              >
                <SelectItem disabled hidden value="" text="Choose an option" />
                {BANKS.map((bankName) => (
                  <SelectItem key={bankName} value={bankName} text={bankName} />
                ))}
              </Select>
            )}
            {file && !isSuccess && !error && (
              <Button
                renderIcon={Upload}
                onClick={uploadFile}
                disabled={isUploading || !bank}
                kind="primary"
              >
                {isUploading ? 'Uploading...' : 'Upload Receipt'}
              </Button>
            )}
            {isUploading && (
              <InlineLoading description="Uploading receipt..." />
            )}
            {error && (
              <InlineNotification
                kind="error"
                title="Error:"
                subtitle={error}
                lowContrast
              />
            )}
          </Stack>
        </Form>
      </Column>
      <Modal
        open={isModalOpen}
        modalHeading="Upload Successful"
        passiveModal
        onRequestClose={() => {
          setIsModalOpen(false);
          resetUpload();
        }}
      >
        <ReceiptDetails extractedInfo={extractedInfo} />
        <div className={styles.modalButtons}>
          <Button
            kind="secondary"
            onClick={() => {
              setIsModalOpen(false);
              resetUpload();
            }}
          >
            Close
          </Button>
          <Button
            kind="primary"
            renderIcon={Add}
            onClick={() => {
              setIsModalOpen(false);
              resetUpload();
            }}
          >
            Upload Another
          </Button>
        </div>
      </Modal>
      <Modal
        open={errorModalOpen}
        modalHeading="Error"
        primaryButtonText="OK"
        onRequestSubmit={() => setErrorModalOpen(false)}
        onRequestClose={() => setErrorModalOpen(false)}
      >
        <p>{errorMessage}</p>
        <p>If the problem persists, please contact support.</p>
      </Modal>
      {notification && (
        <div className={styles.notificationContainer}>
          <ToastNotification
            kind={notification.type as any}
            title={notification.type === 'success' ? 'Success' : 'Error'}
            subtitle={notification.message}
            timeout={5000}
            onClose={() => setNotification(null)}
          />
        </div>
      )}
    </Grid>
  );
};

export default ReceiptUploader;