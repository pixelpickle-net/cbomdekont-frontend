import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import styles from './ReceiptUploader.module.css';
import {
  FileUploaderItem,
  Button,
  InlineLoading,
  InlineNotification,
  Modal,
  Select,
  SelectItem,
  Grid,
  Column,
} from '@carbon/react';
import { Upload, Document } from '@carbon/icons-react';
import { ToastNotification } from '@carbon/react';
import ReceiptDetails from './ReceiptDetails';

const ALLOWED_FORMATS = ['.jpg', '.jpeg', '.png'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const BANKS = ['Papara', 'Garanti Bank']

const ReceiptUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bank, setBank] = useState('');
  const [receiptDetails, setReceiptDetails] = useState<any>(null);
  const [notification, setNotification] = useState<{ type: string; message: string } | null>(null);

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

    try {
      // API call simulation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // API response simulation
      const apiResponse = {
        name: "John Doe",
        amount: "$100.00",
        date: "2023-05-15",
        bank,
      };
      
      setReceiptDetails(apiResponse);
      setIsSuccess(true);
      setIsModalOpen(true);
      setNotification({ type: 'success', message: 'Receipt uploaded successfully!' });
    } catch (err) {
      setError('An error occurred while uploading the file. Please try again.');
      setNotification({ type: 'error', message: 'Failed to upload receipt. Please try again.' });
    } finally {
      setIsUploading(false);
    }
  }, [file, bank]);

  const resetUpload = useCallback(() => {
    setFile(null);
    setError(null);
    setIsSuccess(false);
    setBank('');
    setReceiptDetails(null);
  }, []);

  return (
    <Grid narrow>
      <Column lg={16} md={8} sm={4}>
        <div className={styles.receiptUploader}>
          <h2 className={styles.pageTitle}>
            <Document size={24} className={styles.iconSpacing} />
            Upload Receipt
          </h2>
          <div
            {...getRootProps()}
            className={`${styles.dropzone} ${isDragActive ? styles.active : ''}`}
          >
            <input {...getInputProps()} />
            {file ? (
              <FileUploaderItem
                name={file.name}
                status="edit"
                iconDescription="Clear file"
                onDelete={resetUpload}
                invalid={!!error}
                errorSubject={error || ''}
              />
            ) : isDragActive ? (
              <p>Drop the file here...</p>
            ) : (
              <p>Drag and drop a file here, or click to select a file, or paste an image (Ctrl+V)</p>
            )}
          </div>
          {file && !isSuccess && (
            <>
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
              {!error && (
                <Button
                  renderIcon={Upload}
                  onClick={uploadFile}
                  disabled={isUploading || !bank}
                >
                  {isUploading ? 'Uploading...' : 'Upload Receipt'}
                </Button>
              )}
              {isUploading && (
                <InlineLoading description="Uploading receipt..." />
              )}
            </>
          )}
          {error && (
            <InlineNotification
              kind="error"
              title="Error:"
              subtitle={error}
              lowContrast
            />
          )}
        </div>
      </Column>
      <Modal
        open={isModalOpen}
        modalHeading="Upload Successful"
        primaryButtonText="Upload Another"
        secondaryButtonText="Close"
        onRequestSubmit={() => {
          setIsModalOpen(false);
          resetUpload();
        }}
        onRequestClose={() => {
          setIsModalOpen(false);
          resetUpload();
        }}
      >
        <ReceiptDetails details={receiptDetails} />
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