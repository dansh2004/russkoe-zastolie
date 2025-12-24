import React from 'react';

function ArticleCard({ article, onViewArticle }) {
    const handleCardClick = () => {
        onViewArticle(article);
    };

    const getShortDescription = () => {
        if (!article.content) return 'Статья без описания';
        
        const cleanContent = article.content
            .replace(/#+\s+/g, '')
            .replace(/\*\*/g, '')
            .replace(/[-•]\s+/g, '');
        
        const words = cleanContent.split(' ');
        if (words.length > 20) {
            return words.slice(0, 20).join(' ') + '...';
        }
        return cleanContent;
    };

    return (
        <div className="article-card" onClick={handleCardClick}>
            <div 
                className="article-img" 
                style={{backgroundImage: `url(${article.image || 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'})`}}
            ></div>
            <div className="article-content-preview">
                <h3>{article.title}</h3>
                <div className="article-meta">
                    <span>📝 Статья</span>
                    <span>📅 {new Date(article.createdAt).toLocaleDateString('ru-RU')}</span>
                    {article.author && <span>✍️ {article.author}</span>}
                </div>
                <p className="article-text-preview">{getShortDescription()}</p>
                <a className="read-more">Читать далее →</a>
            </div>
        </div>
    );
}

export default ArticleCard;