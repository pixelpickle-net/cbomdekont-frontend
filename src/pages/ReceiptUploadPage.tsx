import React from 'react';
import ReceiptUploader from '../components/ReceiptUploader/ReceiptUploader';

const ReceiptUploadPage: React.FC = () => {
  return (
    <div>
      <h1 className="page-title">Upload Receipt</h1>
      <ReceiptUploader />
    </div>
  );
};

export default ReceiptUploadPage;