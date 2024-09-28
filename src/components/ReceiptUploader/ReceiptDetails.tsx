import React from 'react';
import { StructuredListWrapper, StructuredListHead, StructuredListBody, StructuredListRow, StructuredListCell, Button } from '@carbon/react';
import { Download } from '@carbon/icons-react';

interface ReceiptDetailsProps {
  details: {
    name: string;
    amount: string;
    date: string;
    receiptType: string;
    bank: string;
    [key: string]: string;
  } | null;
}

const ReceiptDetails: React.FC<ReceiptDetailsProps> = ({ details }) => {
  if (!details) return null;

  const exportToCSV = () => {
    const csvContent = Object.entries(details)
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

  return (
    <div>
      <StructuredListWrapper>
        <StructuredListHead>
          <StructuredListRow head>
            <StructuredListCell head>Field</StructuredListCell>
            <StructuredListCell head>Value</StructuredListCell>
          </StructuredListRow>
        </StructuredListHead>
        <StructuredListBody>
          {Object.entries(details).map(([key, value]) => (
            <StructuredListRow key={key}>
              <StructuredListCell>{key}</StructuredListCell>
              <StructuredListCell>{value}</StructuredListCell>
            </StructuredListRow>
          ))}
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