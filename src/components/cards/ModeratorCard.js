import React from 'react';

function ModeratorCard({ item, onViewItem }) {
    const handleCardClick = () => {
        onViewItem(item);
    };

    const isArticle = item.type === 'article';
    
    const getShortDescription = () => {
        if (isArticle) {
            if (!item.content) return 'Статья без описания';
            const cleanContent = item.content
                .replace(/#+\s+/g, '')
                .replace(/\*\*/g, '')
                .replace(/[-•]\s+/g, '');
            const words = cleanContent.split(' ');
            return words.length > 15 ? words.slice(0, 15).join(' ') + '...' : cleanContent;
        } else {
            return item.description || 'Рецепт без описания';
        }
    };

    return (
        <div className="moderator-recipe-card" onClick={handleCardClick}>
            <div 
                className="moderator-recipe-img" 
                style={{backgroundImage: `url(${item.image || (isArticle ? 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' : 'https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')})`}}
            ></div>
            <div className="moderator-recipe-content">
                <h3>{item.title}</h3>
                <p>{getShortDescription()}</p>
                <div className="moderator-recipe-meta">
                    <span>{isArticle ? '📝 Статья' : `📁 ${item.category}`}</span>
                    <span>📅 {new Date(item.createdAt).toLocaleDateString('ru-RU')}</span>
                    {isArticle && item.author && <span>✍️ {item.author}</span>}
                </div>
                <div className="moderator-recipe-tags">
                    <span className="moderator-tag" style={{
                        background: item.status === 'pending' ? '#f39c12' : 
                                   item.status === 'approved' ? '#27ae60' : 
                                   item.status === 'rejected' ? '#e74c3c' : '#95a5a6',
                        color: 'white'
                    }}>
                        {item.status === 'pending' ? '⏳ На модерации' : 
                         item.status === 'approved' ? '✅ Опубликовано' : 
                         item.status === 'rejected' ? '❌ Отклонено' : '🗑️ Удалено'}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default ModeratorCard;
