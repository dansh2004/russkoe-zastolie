import React, { useState, useRef } from 'react';

function AddArticleForm({ onClose, isModerator = false, articleToEdit = null, isEditing = false }) {
    const [formData, setFormData] = useState(articleToEdit ? {
        title: articleToEdit.title || '',
        content: articleToEdit.content || '',
        author: articleToEdit.author || ''
    } : {
        title: '',
        content: '',
        author: ''
    });
    const [image, setImage] = useState(articleToEdit ? articleToEdit.image : null);
    const [sources, setSources] = useState(articleToEdit ? articleToEdit.sources || [''] : ['']);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const addSource = () => {
        setSources([...sources, '']);
    };

    const updateSource = (index, value) => {
        const newSources = [...sources];
        newSources[index] = value;
        setSources(newSources);
    };

    const removeSource = (index) => {
        const newSources = sources.filter((_, i) => i !== index);
        setSources(newSources);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.title || !formData.content) {
            setError('Название и содержание статьи обязательны для заполнения');
            return;
        }

        const articleImage = image ||
               (articleToEdit && articleToEdit.image) ||
               'https://images.unsplash.com/photo-1565299507177-b0ac66763828?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';
        const articleData = {
            id: isEditing ? articleToEdit.id : Date.now(),
            ...formData,
            image: articleImage,
            sources: sources.filter(source => source.trim() !== ''),
            status: isEditing ? articleToEdit.status : (isModerator ? 'approved' : 'pending'),
            createdAt: isEditing ? articleToEdit.createdAt : new Date().toISOString(),
            type: 'article'
        };

        if (isEditing) {
            if (articleToEdit.status === 'approved') {
                const articles = JSON.parse(localStorage.getItem('articles') || '[]');
                const updatedArticles = articles.map(a => 
                    a.id === articleToEdit.id ? articleData : a
                );
                localStorage.setItem('articles', JSON.stringify(updatedArticles));
            } else {
                const pendingArticles = JSON.parse(localStorage.getItem('pendingArticles') || '[]');
                const updatedPendingArticles = pendingArticles.map(a => 
                    a.id === articleToEdit.id ? articleData : a
                );
                localStorage.setItem('pendingArticles', JSON.stringify(updatedPendingArticles));
            }
            setSuccess('Статья успешно обновлена!');
        } else {
            if (isModerator) {
                const articles = JSON.parse(localStorage.getItem('articles') || '[]');
                articles.push(articleData);
                localStorage.setItem('articles', JSON.stringify(articles));
                setSuccess('Статья успешно опубликована!');
            } else {
                const pendingArticles = JSON.parse(localStorage.getItem('pendingArticles') || '[]');
                pendingArticles.push(articleData);
                localStorage.setItem('pendingArticles', JSON.stringify(pendingArticles));
                setSuccess('Статья отправлена на модерацию! После проверки она будет опубликована.');
            }
        }

        setTimeout(() => {
            onClose();
            if (window.appUpdateCallback) {
                window.appUpdateCallback();
            }
        }, 1000);
    };

    const handleImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="articleTitle">Название статьи</label>
                <input 
                    type="text" 
                    id="articleTitle" 
                    name="title" 
                    className="form-control" 
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Введите название статьи"
                />
            </div>

            <div className="form-group">
                <label htmlFor="articleAuthor">Автор (необязательно)</label>
                <input 
                    type="text" 
                    id="articleAuthor" 
                    name="author" 
                    className="form-control" 
                    value={formData.author}
                    onChange={handleChange}
                    placeholder="Имя автора"
                />
            </div>

            <div className="form-group">
                <label>Главное изображение</label>
                <div className="image-upload" onClick={handleImageClick}>
                    <div className="upload-icon">📷</div>
                    <div className="upload-placeholder">Нажмите для загрузки изображения</div>
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        accept="image/*" 
                        onChange={handleImageChange}
                        style={{display: 'none'}}
                    />
                </div>
                {image && (
                    <img src={image} alt="Preview" className="image-preview" style={{display: 'block'}} />
                )}
            </div>

            <div className="form-group">
                <label htmlFor="articleContent">Содержание статьи</label>
                <textarea 
                    id="articleContent" 
                    name="content" 
                    className="form-control article-content" 
                    value={formData.content}
                    onChange={handleChange}
                    placeholder={`Введите текст статьи`}
                    rows="15"
                />
            </div>

            <div className="form-group">
                <label>Источники и ссылки</label>
                <div className="source-links">
                    {sources.map((source, index) => (
                        <div key={index} className="source-item">
                            <input
                                type="url"
                                className="form-control source-input"
                                value={source}
                                onChange={(e) => updateSource(index, e.target.value)}
                                placeholder="https://example.com"
                            />
                            {sources.length > 1 && (
                                <button 
                                    type="button" 
                                    className="remove-btn"
                                    onClick={() => removeSource(index)}
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                <button type="button" className="add-btn" onClick={addSource}>
                    + Добавить источник
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="form-footer">
                <button type="submit" className="btn btn-moderator">
                    {isEditing ? 'Обновить статью' : (isModerator ? 'Опубликовать статью' : 'Отправить модератору')}
                </button>
                <button type="button" className="btn" onClick={onClose}>Отмена</button>
            </div>
        </form>
    );
}

export default AddArticleForm;
