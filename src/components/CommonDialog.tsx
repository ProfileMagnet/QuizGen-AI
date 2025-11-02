import React from 'react';
import './CommonDialog.css';

interface CommonDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onRetry?: () => void;
  onCancel?: () => void;
  retryText?: string;
  cancelText?: string;
  showRetry?: boolean;
  showCancel?: boolean;
  type?: 'error' | 'warning' | 'info';
}

const CommonDialog: React.FC<CommonDialogProps> = ({
  isOpen,
  title,
  message,
  onRetry,
  onCancel,
  retryText = 'Retry',
  cancelText = 'Cancel',
  showRetry = true,
  showCancel = true,
  type = 'info'
}) => {
  if (!isOpen) return null;

  return (
    <div className="common-dialog-overlay">
      <div className={`common-dialog dialog-${type}`}>
        <div className="dialog-header">
          <h3>{title}</h3>
        </div>
        <div className="dialog-body">
          <p>{message}</p>
        </div>
        <div className="dialog-footer">
          {showCancel && (
            <button 
              className={`dialog-button cancel-button ${type === 'error' ? 'error' : ''}`} 
              onClick={onCancel}
            >
              {cancelText}
            </button>
          )}
          {showRetry && (
            <button 
              className={`dialog-button retry-button ${type === 'error' ? 'error' : ''}`} 
              onClick={onRetry}
            >
              {retryText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommonDialog;