import React, { useState, useCallback } from 'react';
import { StructuredListWrapper, StructuredListBody, StructuredListRow, StructuredListCell, Button, InlineNotification } from '@carbon/react';
import { Copy, WarningAlt, CheckmarkFilled, ErrorFilled } from '@carbon/icons-react';
import ReportRiskModal from './ReportRiskModal';
import styles from './ReceiptDetails.module.css';
import fieldMappings from './fieldMappings.json';

interface ExtractedInfo {
  [key: string]: string;
}

interface ReceiptDetailsProps {
  extractedInfo?: ExtractedInfo;
  riskStatus: string;
  onClose: () => void;
  receiptId: string;
  onReportRisk: (receiptId: string) => void;
  onSubmitRiskReport: (riskType: string, riskComment: string) => Promise<void>;
}

const ReceiptDetails: React.FC<ReceiptDetailsProps> = ({ 
  extractedInfo, 
  riskStatus, 
  onClose, 
  receiptId,
  onReportRisk,
  onSubmitRiskReport 
}) => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const getRiskInfo = (status: string): { kind: "error" | "warning" | "success", icon: React.ReactNode, text: string } => {
    switch (status.toLowerCase()) {
      case 'high risk':
        return { kind: "error", icon: <ErrorFilled />, text: "High Risk" };
      case 'medium risk':
        return { kind: "warning", icon: <WarningAlt />, text: "Medium Risk" };
      case 'low risk':
        return { kind: "success", icon: <CheckmarkFilled />, text: "Low Risk" };
      default:
        return { kind: "warning", icon: <WarningAlt />, text: "Unknown Risk" };
    }
  };

  const riskInfo = getRiskInfo(riskStatus);

  const copyAllToClipboard = useCallback(() => {
    if (!extractedInfo) return;
    const textContent = Object.entries(extractedInfo)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    
    navigator.clipboard.writeText(textContent).then(() => {
      console.log('All information copied to clipboard');
    }).catch(err => {
      console.error('Error during copying:', err);
    });
  }, [extractedInfo]);

  const getFieldName = (key: string) => {
    return fieldMappings[key as keyof typeof fieldMappings] || key;
  };

  if (!extractedInfo) {
    return null;
  }

  return (
    <div className={styles.receiptDetails}>
      <div className={styles.headerContainer}>
        <InlineNotification
          kind={riskInfo.kind}
          title="Risk Status"
          subtitle={riskInfo.text}
          lowContrast
          hideCloseButton
          statusIconDescription="Risk status icon"
          className={styles.riskNotification}
        />
      </div>
      <StructuredListWrapper className={styles.structuredList}>
        <StructuredListBody>
          {Object.entries(extractedInfo).map(([key, value]) => (
            <StructuredListRow key={key}>
              <StructuredListCell className={styles.listHeader}>{getFieldName(key)}</StructuredListCell>
              <StructuredListCell>{value || 'N/A'}</StructuredListCell>
            </StructuredListRow>
          ))}
        </StructuredListBody>
      </StructuredListWrapper>
      <div className={styles.actionButtonsContainer}>
        <Button
          onClick={() => onReportRisk(receiptId)}
          kind="danger"
          size="sm"
          renderIcon={WarningAlt}
          iconDescription="Report"
        >
          Report
        </Button>
        <Button renderIcon={Copy} onClick={copyAllToClipboard} size="sm" kind="ghost">
          Copy All
        </Button>
      </div>
      <div className={styles.closeButtonContainer}>
        <Button onClick={onClose} size="sm" className={styles.closeButton}>
          Close
        </Button>
      </div>
      
      <ReportRiskModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        receiptId={receiptId}
        onSubmit={onSubmitRiskReport}
      />
    </div>
  );
};

export default ReceiptDetails;