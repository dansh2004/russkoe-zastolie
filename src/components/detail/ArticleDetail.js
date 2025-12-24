import React, { useState, useEffect, useRef } from 'react';
import ConfirmDialog from '../common/ConfirmDialog';

function ArticleDetail({ article, onBack, isModerator = false, onModerate, onEdit, onDelete, onUpdateArticle, onPermanentDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedArticle, setEditedArticle] = useState(article);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [showConfirmPermanentDelete, setShowConfirmPermanentDelete] = useState(false);
    
    const fileInputRef = useRef(null);

    useEffect(() => {
        setEditedArticle(article);
    }, [article]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedArticle(article);
    };

    const handleSave = () => {
        onUpdateArticle(editedArticle);
        setIsEditing(false);
    };

    const updateField = (field, value) => {
        setEditedArticle({
            ...editedArticle,
            [field]: value
        });
    };

    const updateImage = (image) => {
        setEditedArticle({
            ...editedArticle,
            image: image
        });
    };

    const updateSources = (sources) => {
        setEditedArticle({
            ...editedArticle,
            sources
        });
    };

    const handleDeleteConfirm = () => {
        setShowConfirmDelete(true);
    };

    const handleDeleteConfirmed = () => {
        onDelete(article);
        setShowConfirmDelete(false);
    };

    const handlePermanentDeleteConfirm = () => {
        setShowConfirmPermanentDelete(true);
    };

    const handlePermanentDeleteConfirmed = () => {
        if (onPermanentDelete) {
            onPermanentDelete(article);
        }
        setShowConfirmPermanentDelete(false);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                updateImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const formatArticleContent = (content) => {
        if (!content) return <p style={{ fontStyle: 'italic', color: '#666' }}>Содержание статьи отсутствует</p>;
        
        return content.split('\n').map((paragraph, index) => {
            if (paragraph.trim() === '') {
                return <div key={index} style={{ height: '1.5rem' }}></div>;
            }
            
            if (paragraph.startsWith('# ') || paragraph.startsWith('## ') || paragraph.startsWith('### ')) {
                const level = paragraph.startsWith('# ') ? 2 : 
                             paragraph.startsWith('## ') ? 3 : 4;
                const text = paragraph.replace(/^#+\s+/, '');
                
                if (level === 2) {
                    return <h2 key={index} className="article-heading-2">{text}</h2>;
                } else if (level === 3) {
                    return <h3 key={index} className="article-heading-3">{text}</h3>;
                } else {
                    return <h4 key={index} className="article-heading-4">{text}</h4>;
                }
            }
            
            if (paragraph.trim().startsWith('- ') || paragraph.trim().startsWith('• ')) {
                const listItems = paragraph.split(/(?:- |• )/).filter(item => item.trim() !== '');
                return (
                    <ul key={index} className="article-list">
                        {listItems.map((item, idx) => (
                            <li key={idx} className="article-list-item">{item.trim()}</li>
                        ))}
                    </ul>
                );
            }
            
            if (paragraph.includes('**')) {
                const parts = paragraph.split('**');
                return (
                    <p key={index} className="article-paragraph">
                        {parts.map((part, i) => 
                            i % 2 === 0 ? part : <strong key={i} style={{ color: 'var(--primary-color)' }}>{part}</strong>
                        )}
                    </p>
                );
            }
            
            return (
                <p key={index} className="article-paragraph">
                    {paragraph}
                </p>
            );
        });
    };

    return (
        <div className="recipe-detail-container">
            <div className="container">
                <button className="back-btn" onClick={onBack}>← Назад</button>
                <div className="article-detail">
                    <div className="recipe-header">
                        {editedArticle.image && (
                            isEditing ? (
                                <div>
                                    <div className="image-upload" onClick={handleImageClick}>
                                        <div className="upload-icon">📷</div>
                                        <div className="upload-placeholder">Нажмите для изменения фотографии</div>
                                        <input 
                                            type="file" 
                                            ref={fileInputRef}
                                            accept="image/*" 
                                            onChange={handleImageChange}
                                            style={{display: 'none'}}
                                        />
                                    </div>
                                    {editedArticle.image && (
                                        <img src={editedArticle.image} alt={editedArticle.title} className="image-preview" style={{display: 'block'}} />
                                    )}
                                </div>
                            ) : (
                                <img src={editedArticle.image} alt={editedArticle.title} className="recipe-image" />
                            )
                        )}
                    </div>
                    <div className="article-full-content">
                        {isEditing ? (
                            <div>
                                <input
                                    type="text"
                                    className="editable-input"
                                    value={editedArticle.title}
                                    onChange={(e) => updateField('title', e.target.value)}
                                    style={{fontSize: '2rem', fontWeight: '600', marginBottom: '1rem'}}
                                />
                            </div>
                        ) : (
                            <h1>{editedArticle.title}</h1>
                        )}
                        
                        <div className="recipe-meta">
                            <span>📝 Статья</span>
                            <span>📅 {new Date(article.createdAt).toLocaleDateString('ru-RU')}</span>
                            {article.author && <span>✍️ Автор: {article.author}</span>}
                        </div>
                        
                        {isEditing ? (
                            <div>
                                <textarea
                                    className="editable-article-content"
                                    value={editedArticle.content}
                                    onChange={(e) => updateField('content', e.target.value)}
                                    rows="15"
                                    placeholder={`Введите содержание статьи. Вы можете использовать:
# Заголовок уровня 1
## Заголовок уровня 2
### Заголовок уровня 3
- Элементы списка
• Другой вид списка
**жирный текст**

Обычные параграфы просто пишите с новой строки.`}
                                />
                            </div>
                        ) : (
                            <div className="article-content-formatted">
                                {formatArticleContent(editedArticle.content)}
                            </div>
                        )}
                        
                        {editedArticle.sources && editedArticle.sources.length > 0 && (
                            <div className="sources-section">
                                <h3>Источники и ссылки:</h3>
                                {isEditing ? (
                                    <div>
                                        {editedArticle.sources.map((source, index) => (
                                            <div key={index} className="source-item">
                                                <input
                                                    type="url"
                                                    className="form-control source-input"
                                                    value={source}
                                                    onChange={(e) => {
                                                        const newSources = [...editedArticle.sources];
                                                        newSources[index] = e.target.value;
                                                        updateSources(newSources);
                                                    }}
                                                />
                                                {editedArticle.sources.length > 1 && (
                                                    <button 
                                                        type="button" 
                                                        className="remove-btn"
                                                        onClick={() => {
                                                            const newSources = editedArticle.sources.filter((_, i) => i !== index);
                                                            updateSources(newSources);
                                                        }}
                                                    >
                                                        ✕
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button 
                                            type="button" 
                                            className="add-btn" 
                                            onClick={() => updateSources([...editedArticle.sources, ''])}
                                        >
                                            + Добавить источник
                                        </button>
                                    </div>
                                ) : (
                                    <ul className="sources-list">
                                        {editedArticle.sources.map((source, index) => (
                                            <li key={index}>
                                                <a href={source} target="_blank" rel="noopener noreferrer">
                                                    {source}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}

                        {isEditing ? (
                            <div className="edit-actions">
                                <button className="save-btn" onClick={handleSave}>Сохранить изменения</button>
                                <button className="cancel-btn" onClick={handleCancelEdit}>Отмена</button>
                            </div>
                        ) : (
                            <div className="recipe-actions">
                                {isModerator ? (
                                    <>
                                        {article.status === 'pending' ? (
                                            <>
                                                <button className="btn btn-approve" onClick={() => onModerate(article, 'approve')}>
                                                    Опубликовать
                                                </button>
                                                <button className="btn btn-reject" onClick={() => onModerate(article, 'reject')}>
                                                    Отклонить
                                                </button>
                                                <button className="btn edit-btn" onClick={handleEdit}>
                                                    ✏️ Редактировать
                                                </button>
                                            </>
                                        ) : article.status === 'rejected' ? (
                                            <>
                                                <button className="btn btn-approve" onClick={() => onModerate(article, 'approve')}>
                                                    Опубликовать
                                                </button>
                                                <button className="btn restore-btn" onClick={() => onModerate(article, 'restore')}>
                                                    Восстановить
                                                </button>
                                                <button className="btn edit-btn" onClick={handleEdit}>
                                                    ✏️ Редактировать
                                                </button>
                                                <button className="btn delete-btn" onClick={handleDeleteConfirm}>
                                                    🗑️ Удалить
                                                </button>
                                            </>
                                        ) : article.status === 'deleted' ? (
                                            <>
                                                <button className="btn restore-btn" onClick={() => onModerate(article, 'restore')}>
                                                    Восстановить
                                                </button>
                                                <button className="btn permanent-delete-btn" onClick={handlePermanentDeleteConfirm}>
                                                    🗑️ Удалить безвозвратно
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button className="btn edit-btn" onClick={handleEdit}>
                                                    ✏️ Редактировать
                                                </button>
                                                <button className="btn delete-btn" onClick={handleDeleteConfirm}>
                                                    🗑️ Удалить
                                                </button>
                                            </>
                                        )}
                                    </>
                                ) : null}
                            </div>
                        )}

                        <ConfirmDialog
                            isOpen={showConfirmDelete}
                            message={`Вы действительно хотите удалить статью "${article.title}"?`}
                            onConfirm={handleDeleteConfirmed}
                            onCancel={() => setShowConfirmDelete(false)}
                        />

                        <ConfirmDialog
                            isOpen={showConfirmPermanentDelete}
                            message={`Вы действительно хотите безвозвратно удалить статью "${article.title}"?`}
                            onConfirm={handlePermanentDeleteConfirmed}
                            onCancel={() => setShowConfirmPermanentDelete(false)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ArticleDetail;
