import React from 'react';

function ConfirmDialog({ isOpen, message, onConfirm, onCancel }) {
    if (!isOpen) return null;
    
    return (
        <div className="confirm-dialog">
            <div className="confirm-content">
                <div className="confirm-message">{message}</div>
                <div className="confirm-buttons">
                    <button className="confirm-cancel" onClick={onCancel}>Отмена</button>
                    <button className="confirm-ok" onClick={onConfirm}>OK</button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDialog;