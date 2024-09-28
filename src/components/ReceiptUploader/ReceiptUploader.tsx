import React, { useState, useCallback } from 'react';
import {
  FileUploader,
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

const BANKS = ['Bank A', 'Bank B', 'Bank C', 'Other'];

const ReceiptUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bank, setBank] = useState('');
  const [receiptDetails, setReceiptDetails] = useState<any>(null);
  const [notification, setNotification] = useState<{ type: string; message: string } | null>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (!ALLOWED_FORMATS.some(format => selectedFile.name.toLowerCase().endsWith(format))) {
        setError('Invalid file format. Please upload a PDF, JPG, or PNG file.');
        return;
      }
      if (selectedFile.size > MAX_FILE_SIZE) {
        setError('File size exceeds 5MB limit.');
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  }, []);

  const uploadFile = useCallback(async () => {
    if (!file || !bank) {
      setError('Please select a file and bank before uploading.');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulating API response
      const apiResponse = {
        name: "John Doe",
        amount: "$100.00",
        date: "2023-05-15",
        bank,
        // ... other fields
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
        <div className="receipt-uploader">
          <h2 className="page-title">
            <Document size={24} className="icon-spacing" />
            Upload Receipt
          </h2>
          {!file && (
            <FileUploader
              accept={ALLOWED_FORMATS}
              buttonKind="primary"
              buttonLabel="Select file"
              filenameStatus="edit"
              iconDescription="Clear file"
              labelDescription="Max file size is 5MB. Only .jpg, .jpeg, .png, and .pdf files are supported."
              labelTitle="Upload receipt"
              onChange={handleFileChange}
            />
          )}
          {file && !isSuccess && (
            <>
              <FileUploaderItem
                name={file.name}
                status="edit"
                iconDescription="Clear file"
                onDelete={resetUpload}
                invalid={!!error}
                errorSubject={error || ''}
              />
              <Grid narrow>
                <Column lg={8} md={4} sm={4}>
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
                </Column>
              </Grid>
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
        <div className="notification-container">
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