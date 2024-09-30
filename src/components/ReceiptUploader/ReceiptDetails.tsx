import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StructuredListWrapper, StructuredListBody, StructuredListRow, StructuredListCell, Button, InlineNotification, Grid, Column } from '@carbon/react';
import { Copy, WarningAlt, CheckmarkFilled, ErrorFilled } from '@carbon/icons-react';
import ReportRiskModal from './ReportRiskModal';
import styles from './ReceiptDetails.module.css'; // Bu dosyayı oluşturacağız

interface ExtractedInfo {
  "Ad Soyad"?: string;
  "Alıcı"?: string;
  "İşlem No"?: string;
  "Tarih"?: string;
  "Tutar"?: string;
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
  const contentRef = useRef<HTMLDivElement>(null);

  const getRiskInfo = (status: string): { kind: "error" | "warning" | "success", icon: React.ReactNode, text: string } => {
    switch (status.toLowerCase()) {
      case 'yüksek risk':
        return { kind: "error", icon: <ErrorFilled />, text: "Yüksek Risk" };
      case 'orta risk':
        return { kind: "warning", icon: <WarningAlt />, text: "Orta Risk" };
      case 'düşük risk':
        return { kind: "success", icon: <CheckmarkFilled />, text: "Düşük Risk" };
      default:
        return { kind: "warning", icon: <WarningAlt />, text: "Bilinmeyen Risk" };
    }
  };

  const riskInfo = getRiskInfo(riskStatus);

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

  const copyAllToClipboard = useCallback(() => {
    if (!extractedInfo) return;
    const textContent = Object.entries(extractedInfo)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    
    navigator.clipboard.writeText(textContent).then(() => {
      console.log('Tüm bilgiler panoya kopyalandı');
    }).catch(err => {
      console.error('Kopyalama sırasında hata oluştu:', err);
    });
  }, [extractedInfo]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
        event.preventDefault();
        copyAllToClipboard();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [copyAllToClipboard]);

  useEffect(() => {
    const resizeContent = () => {
      if (contentRef.current) {
        const windowHeight = window.innerHeight;
        const contentTop = contentRef.current.getBoundingClientRect().top;
        const maxHeight = windowHeight - contentTop - 20; // 20px for some bottom padding
        contentRef.current.style.maxHeight = `${maxHeight}px`;
      }
    };

    resizeContent();
    window.addEventListener('resize', resizeContent);

    return () => {
      window.removeEventListener('resize', resizeContent);
    };
  }, []);

  if (!extractedInfo) {
    return null;
  }

  return (
    <div className={styles.receiptDetails}>
      <div className={styles.headerContainer}>
        <InlineNotification
          kind={riskInfo.kind}
          title="Risk Durumu"
          subtitle={riskInfo.text}
          lowContrast
          hideCloseButton
          statusIconDescription="Risk durumu ikonu"
          className={styles.riskNotification}
        />
      </div>
      <StructuredListWrapper className={styles.structuredList}>
        <StructuredListBody>
          {Object.entries(extractedInfo).map(([key, value]) => (
            <StructuredListRow key={key}>
              <StructuredListCell className={styles.listHeader}>{key}</StructuredListCell>
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
          iconDescription="Rapor Et"
        >
          Rapor Et
        </Button>
        <div className={styles.rightButtons}>
          <Button renderIcon={Copy} onClick={copyAllToClipboard} size="sm" kind="ghost">
            Tümünü Kopyala
          </Button>
          <Button onClick={onClose} size="sm">
            Kapat
          </Button>
        </div>
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