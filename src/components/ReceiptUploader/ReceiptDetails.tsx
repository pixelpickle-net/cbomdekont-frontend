import React from 'react';
import { StructuredListWrapper, StructuredListHead, StructuredListBody, StructuredListRow, StructuredListCell, Button } from '@carbon/react';
import { Download } from '@carbon/icons-react';

interface ExtractedInfo {
  adSoyad?: string;
  alici?: string;
  islemNo?: string;
  tarih?: string;
  tutar?: string;  // Yeni eklenen tutar alanı
}

interface ReceiptDetailsProps {
  extractedInfo?: ExtractedInfo;
}

const ReceiptDetails: React.FC<ReceiptDetailsProps> = ({ extractedInfo }) => {
  const exportToCSV = () => {
    if (!extractedInfo) return;
    const csvContent = Object.entries(extractedInfo)
      .map(([key, value]) => `${key},${value}`)
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'receipt_details.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!extractedInfo) {
    return null;
  }

  return (
    <div className="receipt-details">
      <StructuredListWrapper>
        <StructuredListHead>
          <StructuredListRow head>
            <StructuredListCell head>Field</StructuredListCell>
            <StructuredListCell head>Value</StructuredListCell>
          </StructuredListRow>
        </StructuredListHead>
        <StructuredListBody>
          <StructuredListRow>
            <StructuredListCell>Ad Soyad</StructuredListCell>
            <StructuredListCell>{extractedInfo.adSoyad || 'N/A'}</StructuredListCell>
          </StructuredListRow>
          <StructuredListRow>
            <StructuredListCell>Alıcı</StructuredListCell>
            <StructuredListCell>{extractedInfo.alici || 'N/A'}</StructuredListCell>
          </StructuredListRow>
          <StructuredListRow>
            <StructuredListCell>İşlem No</StructuredListCell>
            <StructuredListCell>{extractedInfo.islemNo || 'N/A'}</StructuredListCell>
          </StructuredListRow>
          <StructuredListRow>
            <StructuredListCell>Tarih</StructuredListCell>
            <StructuredListCell>{extractedInfo.tarih || 'N/A'}</StructuredListCell>
          </StructuredListRow>
          <StructuredListRow>
            <StructuredListCell>Tutar</StructuredListCell>
            <StructuredListCell>{extractedInfo.tutar || 'N/A'}</StructuredListCell>
          </StructuredListRow>
        </StructuredListBody>
      </StructuredListWrapper>
      <Button
        renderIcon={Download}
        onClick={exportToCSV}
        style={{ marginTop: '1rem' }}
      >
        Export to CSV
      </Button>
    </div>
  );
};

export default ReceiptDetails;