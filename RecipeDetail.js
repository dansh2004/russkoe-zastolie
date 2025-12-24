import React, { useState, useEffect, useRef } from 'react';
import ConfirmDialog from '../common/ConfirmDialog';

function RecipeDetail({ recipe, onBack, isModerator = false, onModerate, onEdit, onDelete, onUpdateRecipe, currentUser, onPermanentDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedRecipe, setEditedRecipe] = useState(recipe);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [showConfirmPermanentDelete, setShowConfirmPermanentDelete] = useState(false);
    
    const stepFileInputRefs = useRef([]);
    const mainImageInputRef = useRef(null);

    useEffect(() => {
        setEditedRecipe(recipe);
    }, [recipe]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedRecipe(recipe);
    };

    const handleSave = () => {
        onUpdateRecipe(editedRecipe);
        setIsEditing(false);
    };

    const updateField = (field, value) => {
        setEditedRecipe({
            ...editedRecipe,
            [field]: value
        });
    };

    const updateImage = (image) => {
        setEditedRecipe({
            ...editedRecipe,
            image: image
        });
    };

    const updateIngredients = (ingredients) => {
        setEditedRecipe({
            ...editedRecipe,
            ingredients
        });
    };

    const updateSteps = (steps) => {
        setEditedRecipe({
            ...editedRecipe,
            steps
        });
    };

    const handleDeleteConfirm = () => {
        setShowConfirmDelete(true);
    };

    const handleDeleteConfirmed = () => {
        onDelete(recipe);
        setShowConfirmDelete(false);
    };

    const handlePermanentDeleteConfirm = () => {
        setShowConfirmPermanentDelete(true);
    };

    const handlePermanentDeleteConfirmed = () => {
        if (onPermanentDelete) {
            onPermanentDelete(recipe);
        }
        setShowConfirmPermanentDelete(false);
    };

    const handleStepImageChange = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newSteps = [...editedRecipe.steps];
                if (!newSteps[index]) {
                    newSteps[index] = { text: '', image: null };
                }
                newSteps[index] = {
                    ...newSteps[index],
                    image: e.target.result
                };
                setEditedRecipe({
                    ...editedRecipe,
                    steps: newSteps
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleStepImageClick = (index) => {
        if (stepFileInputRefs.current[index]) {
            stepFileInputRefs.current[index].click();
        }
    };

    const handleRemoveStepImage = (index) => {
        const newSteps = [...editedRecipe.steps];
        if (newSteps[index]) {
            newSteps[index] = {
                ...newSteps[index],
                image: null
            };
            setEditedRecipe({
                ...editedRecipe,
                steps: newSteps
            });
        }
    };

    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                updateImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMainImageClick = () => {
        if (mainImageInputRef.current) {
            mainImageInputRef.current.click();
        }
    };

    const categories = [
        { value: "Первые блюда", label: "Первые блюда" },
        { value: "Вторые блюда", label: "Вторые блюда" },
        { value: "Салаты", label: "Салаты" },
        { value: "Закуски", label: "Закуски" },
        { value: "Десерты", label: "Десерты" },
        { value: "Выпечка", label: "Выпечка" },
        { value: "Супы", label: "Супы" }
    ];

    const difficulties = [
        { value: "легкая", label: "Легкая" },
        { value: "средняя", label: "Средняя" },
        { value: "сложная", label: "Сложная" }
    ];

    return (
        <div className="recipe-detail-container">
            <div className="container">
                <button className="back-btn" onClick={onBack}>← Назад</button>
                <div className="recipe-detail">
                    <div className="recipe-header">
                        {editedRecipe.image && (
                            isEditing ? (
                                <div>
                                    <div className="image-upload" onClick={handleMainImageClick}>
                                        <div className="upload-icon">📷</div>
                                        <div className="upload-placeholder">Нажмите для изменения фотографии</div>
                                        <input 
                                            type="file" 
                                            ref={mainImageInputRef}
                                            accept="image/*" 
                                            onChange={handleMainImageChange}
                                            style={{display: 'none'}}
                                        />
                                    </div>
                                    {editedRecipe.image && (
                                        <img src={editedRecipe.image} alt={editedRecipe.title} className="image-preview" style={{display: 'block'}} />
                                    )}
                                </div>
                            ) : (
                                <img src={editedRecipe.image} alt={editedRecipe.title} className="recipe-image" />
                            )
                        )}
                    </div>
                    <div className="recipe-info">
                        {isEditing ? (
                            <div>
                                <input
                                    type="text"
                                    className="editable-input"
                                    value={editedRecipe.title}
                                    onChange={(e) => updateField('title', e.target.value)}
                                    style={{fontSize: '2rem', fontWeight: '600', marginBottom: '1rem'}}
                                />
                            </div>
                        ) : (
                            <h1>{editedRecipe.title}</h1>
                        )}
                        
                        <div className="recipe-meta">
                            <span>
                                📁 
                                {isEditing ? (
                                    <select 
                                        className="editable-select"
                                        value={editedRecipe.category}
                                        onChange={(e) => updateField('category', e.target.value)}
                                        style={{display: 'inline-block', width: 'auto', marginLeft: '0.5rem'}}
                                    >
                                        {categories.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <span>{editedRecipe.category}</span>
                                )}
                            </span>
                            
                            {editedRecipe.cookingTime && (
                                <span>
                                    ⏱️ 
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="editable-input"
                                            value={editedRecipe.cookingTime}
                                            onChange={(e) => updateField('cookingTime', e.target.value)}
                                            style={{display: 'inline-block', width: 'auto', marginLeft: '0.5rem'}}
                                        />
                                    ) : (
                                        <span>{editedRecipe.cookingTime}</span>
                                    )}
                                </span>
                            )}
                            
                            {editedRecipe.calories && (
                                <span>
                                    🔥 
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            className="editable-input"
                                            value={editedRecipe.calories}
                                            onChange={(e) => updateField('calories', e.target.value)}
                                            style={{display: 'inline-block', width: '80px', marginLeft: '0.5rem'}}
                                            min="0"
                                        />
                                    ) : (
                                        <span>{editedRecipe.calories} ккал</span>
                                    )}
                                </span>
                            )}
                            
                            <span>❤️ {editedRecipe.likes || 0} лайков</span>
                            
                            {editedRecipe.difficulty && (
                                <span>
                                    {isEditing ? (
                                        <select 
                                            className="editable-select"
                                            value={editedRecipe.difficulty}
                                            onChange={(e) => updateField('difficulty', e.target.value)}
                                            style={{display: 'inline-block', width: 'auto', marginLeft: '0.5rem'}}
                                        >
                                            {difficulties.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <span>{editedRecipe.difficulty}</span>
                                    )}
                                </span>
                            )}
                        </div>
                        
                        {isEditing ? (
                            <div>
                                <textarea
                                    className="editable-textarea"
                                    value={editedRecipe.description}
                                    onChange={(e) => updateField('description', e.target.value)}
                                    rows="3"
                                />
                            </div>
                        ) : (
                            <p>{editedRecipe.description}</p>
                        )}
                        
                        <div className="ingredients-section">
                            <h3>Ингредиенты:</h3>
                            {isEditing ? (
                                <div>
                                    {editedRecipe.ingredients.map((ingredient, index) => (
                                        <div key={index} className="ingredient-item">
                                            <input
                                                type="text"
                                                className="form-control ingredient-input"
                                                value={ingredient}
                                                onChange={(e) => {
                                                    const newIngredients = [...editedRecipe.ingredients];
                                                    newIngredients[index] = e.target.value;
                                                    updateIngredients(newIngredients);
                                                }}
                                            />
                                            {editedRecipe.ingredients.length > 1 && (
                                                <button 
                                                    type="button" 
                                                    className="remove-btn"
                                                    onClick={() => {
                                                        const newIngredients = editedRecipe.ingredients.filter((_, i) => i !== index);
                                                        updateIngredients(newIngredients);
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
                                        onClick={() => updateIngredients([...editedRecipe.ingredients, ''])}
                                    >
                                        + Добавить ингредиент
                                    </button>
                                </div>
                            ) : (
                                <div className="ingredients-line">
                                    {editedRecipe.ingredients.map((ingredient, index) => (
                                        <span key={index} className="ingredient-tag">{ingredient}</span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="steps-section">
                            <h3>Способ приготовления:</h3>
                            {isEditing ? (
                                <div>
                                    {editedRecipe.steps.map((step, index) => (
                                        <div key={index} className="step-with-image">
                                            <div className="step-item">
                                                <div className="step-number">{index + 1}</div>
                                                <textarea
                                                    className="form-control step-input"
                                                    value={typeof step === 'object' ? step.text : step}
                                                    onChange={(e) => {
                                                        const newSteps = [...editedRecipe.steps];
                                                        if (typeof step === 'object') {
                                                            newSteps[index] = { ...step, text: e.target.value };
                                                        } else {
                                                            newSteps[index] = e.target.value;
                                                        }
                                                        updateSteps(newSteps);
                                                    }}
                                                    rows="2"
                                                />
                                                {editedRecipe.steps.length > 1 && (
                                                    <button 
                                                        type="button" 
                                                        className="remove-btn"
                                                        onClick={() => {
                                                            const newSteps = editedRecipe.steps.filter((_, i) => i !== index);
                                                            updateSteps(newSteps);
                                                        }}
                                                    >
                                                        ✕
                                                    </button>
                                                )}
                                            </div>
                                            {editedRecipe.recipeType === 'detailed' && (
                                                <div>
                                                    <div className="step-image-upload">
                                                        <div 
                                                            className="upload-icon"
                                                            style={{cursor: 'pointer'}}
                                                            onClick={() => handleStepImageClick(index)}
                                                        >📷</div>
                                                        <div 
                                                            className="upload-placeholder"
                                                            style={{cursor: 'pointer'}}
                                                            onClick={() => handleStepImageClick(index)}
                                                        >Добавить фото к шагу</div>
                                                        <input 
                                                            type="file" 
                                                            ref={el => stepFileInputRefs.current[index] = el}
                                                            accept="image/*" 
                                                            onChange={(e) => handleStepImageChange(index, e)}
                                                            style={{display: 'none'}}
                                                        />
                                                    </div>
                                                    {step.image && (
                                                        <div className="step-image-container">
                                                            <img src={step.image} alt={`Шаг ${index + 1}`} className="step-image-preview" style={{display: 'block', maxWidth: '100%', maxHeight: '300px'}} />
                                                            <div className="step-image-edit-overlay">
                                                                <button 
                                                                    type="button"
                                                                    className="remove-btn"
                                                                    onClick={() => handleRemoveStepImage(index)}
                                                                    style={{position: 'relative', zIndex: 3}}
                                                                >
                                                                    Удалить фото
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    <button 
                                        type="button" 
                                        className="add-btn" 
                                        onClick={() => updateSteps([...editedRecipe.steps, { text: '', image: null }])}
                                    >
                                        + Добавить шаг
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    {editedRecipe.steps.map((step, index) => (
                                        <div key={index} className="step-with-image">
                                            <div className="step-item">
                                                <div className="step-number">{index + 1}</div>
                                                <div className="step-content">
                                                    {typeof step === 'object' ? step.text : step}
                                                </div>
                                            </div>
                                            {step.image && (
                                                <div className="step-image-container">
                                                    <img src={step.image} alt={`Шаг ${index + 1}`} className="step-image-preview" style={{display: 'block', maxWidth: '100%', maxHeight: '300px'}} />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {isEditing ? (
                            <div className="edit-actions">
                                <button className="save-btn" onClick={handleSave}>Сохранить изменения</button>
                                <button className="cancel-btn" onClick={handleCancelEdit}>Отмена</button>
                            </div>
                        ) : (
                            <div className="recipe-actions">
                                {isModerator ? (
                                    <>
                                        {recipe.status === 'pending' ? (
                                            <>
                                                <button className="btn btn-approve" onClick={() => onModerate(recipe, 'approve')}>
                                                    Опубликовать
                                                </button>
                                                <button className="btn btn-reject" onClick={() => onModerate(recipe, 'reject')}>
                                                    Отклонить
                                                </button>
                                                <button className="btn edit-btn" onClick={handleEdit}>
                                                    ✏️ Редактировать
                                                </button>
                                            </>
                                        ) : recipe.status === 'rejected' ? (
                                            <>
                                                <button className="btn btn-approve" onClick={() => onModerate(recipe, 'approve')}>
                                                    Опубликовать
                                                </button>
                                                <button className="btn restore-btn" onClick={() => onModerate(recipe, 'restore')}>
                                                    Восстановить
                                                </button>
                                                <button className="btn edit-btn" onClick={handleEdit}>
                                                    ✏️ Редактировать
                                                </button>
                                                <button className="btn delete-btn" onClick={handleDeleteConfirm}>
                                                    🗑️ Удалить
                                                </button>
                                            </>
                                        ) : recipe.status === 'deleted' ? (
                                            <>
                                                <button className="btn restore-btn" onClick={() => onModerate(recipe, 'restore')}>
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
                            message={`Вы действительно хотите удалить рецепт "${recipe.title}"?`}
                            onConfirm={handleDeleteConfirmed}
                            onCancel={() => setShowConfirmDelete(false)}
                        />

                        <ConfirmDialog
                            isOpen={showConfirmPermanentDelete}
                            message={`Вы действительно хотите безвозвратно удалить рецепт "${recipe.title}"?`}
                            onConfirm={handlePermanentDeleteConfirmed}
                            onCancel={() => setShowConfirmPermanentDelete(false)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecipeDetail;