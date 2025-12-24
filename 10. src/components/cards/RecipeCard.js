import React, { useState, useEffect } from 'react';

function RecipeCard({ recipe, onViewRecipe, onLike, currentUser }) {
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(recipe.likes || 0);

    useEffect(() => {
        if (currentUser && recipe.likedBy) {
            setIsLiked(recipe.likedBy.includes(currentUser.id || currentUser.type));
        }
        setLikeCount(recipe.likes || 0);
    }, [recipe, currentUser]);

    const handleLike = (e) => {
        e.stopPropagation();
        
        const newIsLiked = !isLiked;
        const newLikeCount = newIsLiked ? likeCount + 1 : Math.max(0, likeCount - 1);
        
        setIsLiked(newIsLiked);
        setLikeCount(newLikeCount);
        
        onLike(recipe.id, newIsLiked);
    };

    const handleCardClick = () => {
        onViewRecipe(recipe);
    };

    return (
        <div className="recipe-card" onClick={handleCardClick}>
            <div 
                className="recipe-img" 
                style={{backgroundImage: `url(${recipe.image || 'https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'})`}}
            ></div>
            <div className="recipe-content">
                <h3>{recipe.title}</h3>
                <p>{recipe.description}</p>
                <div className="recipe-meta">
                    <span>📁 {recipe.category}</span>
                    <span>⏱️ {recipe.cookingTime}</span>
                    <span>🔥 {recipe.calories} ккал</span>
                </div>
                <div className="ingredients-line">
                    {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
                        <span key={index} className="ingredient-tag">{ingredient}</span>
                    ))}
                    {recipe.ingredients.length > 3 && (
                        <span className="ingredient-tag">+{recipe.ingredients.length - 3}</span>
                    )}
                </div>
                <div className="recipe-tags">
                    <span className="tag">{recipe.difficulty}</span>
                    <button 
                        className={`tag ${isLiked ? 'liked' : ''}`} 
                        onClick={handleLike}
                        style={{
                            border: 'none', 
                            background: isLiked ? '#27ae60' : '#f0f0f0', 
                            color: isLiked ? 'white' : 'var(--accent-color)', 
                            cursor: 'pointer'
                        }}
                    >
                        {isLiked ? '❤️' : '🤍'} {likeCount}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RecipeCard;
