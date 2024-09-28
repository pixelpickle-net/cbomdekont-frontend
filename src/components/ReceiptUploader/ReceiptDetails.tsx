import React from 'react';
import { StructuredListWrapper, StructuredListHead, StructuredListBody, StructuredListRow, StructuredListCell } from '@carbon/react';

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

  return (
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
  );
};

export default ReceiptDetails;