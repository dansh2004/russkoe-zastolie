import React, { useState, useEffect } from 'react';

function EditableField({ value, onSave, fieldType = 'text', isEditing, onEdit, onCancel }) {
    const [editValue, setEditValue] = useState(value);
    
    useEffect(() => {
        setEditValue(value);
    }, [value]);
    
    const handleSave = () => {
        onSave(editValue);
    };
    
    const handleCancel = () => {
        setEditValue(value);
        onCancel();
    };
    
    if (isEditing) {
        return (
            <div>
                {fieldType === 'textarea' ? (
                    <textarea
                        className={fieldType === 'article' ? "editable-article-content" : "editable-textarea"}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        rows={fieldType === 'article' ? "15" : "3"}
                    />
                ) : (
                    <input
                        type="text"
                        className="editable-input"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                    />
                )}
            </div>
        );
    }
    
    return (
        <div 
            className="editable-field"
            onClick={onEdit}
        >
            {value}
        </div>
    );
}

export default EditableField;
