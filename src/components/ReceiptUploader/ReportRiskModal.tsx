import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  Select,
  SelectItem,
  TextArea,
  Button,
  Form,
  Stack
} from '@carbon/react';
import { WarningAlt } from '@carbon/icons-react';
import styles from './ReportRiskModal.module.css';

interface ReportRiskModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptId: string;
  onSubmit: (riskType: string, riskComment: string) => Promise<void>;
}

const ReportRiskModal: React.FC<ReportRiskModalProps> = ({
  isOpen,
  onClose,
  receiptId,
  onSubmit
}) => {
  const [riskType, setRiskType] = useState('');
  const [riskComment, setRiskComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      const focusTextArea = () => {
        if (textAreaRef.current) {
          textAreaRef.current.focus();
          // Cursor'u en sona taşı
          textAreaRef.current.setSelectionRange(
            textAreaRef.current.value.length,
            textAreaRef.current.value.length
          );
        }
      };

      // Modal açıldıktan sonra birkaç kez odaklanmayı dene
      const focusAttempts = [100, 300, 500, 1000];
      focusAttempts.forEach(delay => {
        setTimeout(focusTextArea, delay);
      });
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(riskType, riskComment);
      onClose();
    } catch (error) {
      console.error('Error submitting risk report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onRequestClose={onClose}
      modalHeading="Report Risk"
      modalLabel={`Receipt ID: ${receiptId}`}
      primaryButtonText="Report"
      secondaryButtonText="Cancel"
      onRequestSubmit={handleSubmit}
      primaryButtonDisabled={!riskType || !riskComment || isSubmitting}
      className={styles.reportRiskModal}
      preventCloseOnClickOutside
    >
      <Form onSubmit={handleSubmit}>
        <Stack gap={7}>
          <Select
            id="risk-type"
            labelText="Risk Type"
            value={riskType}
            onChange={(e) => setRiskType(e.target.value)}
            required
          >
            <SelectItem disabled hidden value="" text="Select" />
            <SelectItem value="fraud" text="Fraud" />
            <SelectItem value="suspicious" text="Suspicious Transaction" />
            <SelectItem value="other" text="Other" />
          </Select>
          <div className={styles.textAreaWrapper}>
            <label htmlFor="risk-comment" className={styles.textAreaLabel}>Description</label>
            <textarea
              id="risk-comment"
              value={riskComment}
              onChange={(e) => setRiskComment(e.target.value)}
              required
              rows={4}
              className={styles.riskCommentTextArea}
              ref={textAreaRef}
            />
          </div>
          <div className={styles.warningContainer}>
            <WarningAlt className={styles.warningIcon} />
            <p className={styles.warningText}>
              This report will be used in the risk assessment of the related receipt. Please provide accurate and detailed information.
            </p>
          </div>
        </Stack>
      </Form>
    </Modal>
  );
};

export default ReportRiskModal;