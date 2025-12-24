import React, { useState, useEffect, useRef } from 'react';

function AddRecipeForm({ onClose, isModerator = false, recipeToEdit = null, isEditing = false, recipeType = 'detailed' }) {
    const [formData, setFormData] = useState(recipeToEdit ? {
        title: recipeToEdit.title || '',
        description: recipeToEdit.description || '',
        cookingTime: recipeToEdit.cookingTime || '',
        difficulty: recipeToEdit.difficulty || 'легкая',
        category: recipeToEdit.category || 'Первые блюда',
        calories: recipeToEdit.calories || ''
    } : {
        title: '',
        description: '',
        cookingTime: '',
        difficulty: 'легкая',
        category: 'Первые блюда',
        calories: ''
    });
    
    const [ingredients, setIngredients] = useState(recipeToEdit ? 
        recipeToEdit.ingredients || [''] : ['']);
    const [steps, setSteps] = useState(recipeToEdit ? 
        recipeToEdit.steps || [{ text: '', image: null }] : [{ text: '', image: null }]);
    const [image, setImage] = useState(recipeToEdit ? recipeToEdit.image : null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const stepFileInputRefs = useRef([]);
    const mainImageInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        if (name === 'calories') {
            const caloriesValue = parseInt(value);
            if (caloriesValue < 0) {
                setError('Калорийность должна быть положительным числом');
            } else {
                setError('');
            }
        }
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

    const addIngredient = () => {
        setIngredients([...ingredients, '']);
    };

    const updateIngredient = (index, value) => {
        const newIngredients = [...ingredients];
        newIngredients[index] = value;
        setIngredients(newIngredients);
    };

    const removeIngredient = (index) => {
        const newIngredients = ingredients.filter((_, i) => i !== index);
        setIngredients(newIngredients);
    };

    const addStep = () => {
        setSteps([...steps, { text: '', image: null }]);
    };

    const updateStep = (index, value) => {
        const newSteps = [...steps];
        newSteps[index].text = value;
        setSteps(newSteps);
    };

    const handleStepImageChange = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newSteps = [...steps];
                newSteps[index].image = e.target.result;
                setSteps(newSteps);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeStep = (index) => {
        const newSteps = steps.filter((_, i) => i !== index);
        setSteps(newSteps);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.title || !formData.description || ingredients.some(ing => !ing) || steps.some(step => !step.text)) {
            setError('Все поля обязательны для заполнения');
            return;
        }

        if (formData.calories && parseInt(formData.calories) < 0) {
            setError('Калорийность должна быть положительным числом');
            return;
        }

        const recipeData = {
            id: isEditing ? recipeToEdit.id : Date.now(),
            ...formData,
            ingredients: ingredients.filter(ing => ing.trim() !== ''),
            steps: steps.filter(step => step.text.trim() !== ''),
            image: image || 'https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            status: isEditing ? recipeToEdit.status : (isModerator ? 'approved' : 'pending'),
            createdAt: isEditing ? recipeToEdit.createdAt : new Date().toISOString(),
            likes: isEditing ? (recipeToEdit.likes || 0) : 0,
            likedBy: isEditing ? (recipeToEdit.likedBy || []) : [],
            type: 'recipe',
            recipeType: recipeType
        };

        if (isEditing) {
            if (recipeToEdit.status === 'approved') {
                const recipes = JSON.parse(localStorage.getItem('recipes') || '[]');
                const updatedRecipes = recipes.map(r => 
                    r.id === recipeToEdit.id ? recipeData : r
                );
                localStorage.setItem('recipes', JSON.stringify(updatedRecipes));
            } else {
                const pendingRecipes = JSON.parse(localStorage.getItem('pendingRecipes') || '[]');
                const updatedPendingRecipes = pendingRecipes.map(r => 
                    r.id === recipeToEdit.id ? recipeData : r
                );
                localStorage.setItem('pendingRecipes', JSON.stringify(updatedPendingRecipes));
            }
            setSuccess('Рецепт успешно обновлен!');
        } else {
            if (isModerator) {
                const recipes = JSON.parse(localStorage.getItem('recipes') || '[]');
                recipes.push(recipeData);
                localStorage.setItem('recipes', JSON.stringify(recipes));
                setSuccess('Рецепт успешно опубликован!');
            } else {
                const pendingRecipes = JSON.parse(localStorage.getItem('pendingRecipes') || '[]');
                pendingRecipes.push(recipeData);
                localStorage.setItem('pendingRecipes', JSON.stringify(pendingRecipes));
                setSuccess('Рецепт отправлен на модерацию! После проверки он будет опубликован.');
            }
        }

        setTimeout(() => {
            onClose();
            if (window.appUpdateCallback) {
                window.appUpdateCallback();
            }
        }, 1000);
    };

    const handleStepImageClick = (index) => {
        if (stepFileInputRefs.current[index]) {
            stepFileInputRefs.current[index].click();
        }
    };

    const handleMainImageClick = () => {
        if (mainImageInputRef.current) {
            mainImageInputRef.current.click();
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="title">Название рецепта</label>
                <input 
                    type="text" 
                    id="title" 
                    name="title" 
                    className="form-control" 
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Введите название рецепта"
                />
            </div>

            <div className="form-group">
                <label htmlFor="description">Краткое описание</label>
                <textarea 
                    id="description" 
                    name="description" 
                    className="form-control" 
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Опишите ваше блюдо"
                    rows="3"
                />
            </div>

            <div className="form-group">
                <label>Фотография блюда</label>
                <div className="image-upload" onClick={handleMainImageClick}>
                    <div className="upload-icon">📷</div>
                    <div className="upload-placeholder">Нажмите для загрузки фотографии</div>
                    <input 
                        type="file" 
                        ref={mainImageInputRef}
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
                <label>Ингредиенты</label>
                <div className="ingredients-list">
                    {ingredients.map((ingredient, index) => (
                        <div key={index} className="ingredient-item">
                            <input
                                type="text"
                                className="form-control ingredient-input"
                                value={ingredient}
                                onChange={(e) => updateIngredient(index, e.target.value)}
                                placeholder={`Ингредиент ${index + 1}`}
                            />
                            {ingredients.length > 1 && (
                                <button 
                                    type="button" 
                                    className="remove-btn"
                                    onClick={() => removeIngredient(index)}
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                <button type="button" className="add-btn" onClick={addIngredient}>
                    + Добавить ингредиент
                </button>
            </div>

            <div className="form-group">
                <label>Шаги приготовления</label>
                <div className="steps-list">
                    {steps.map((step, index) => (
                        <div key={index} className="step-with-image">
                            <div className="step-item">
                                <div className="step-number">{index + 1}</div>
                                <textarea
                                    className="form-control step-input"
                                    value={step.text}
                                    onChange={(e) => updateStep(index, e.target.value)}
                                    placeholder={`Опишите шаг ${index + 1}`}
                                    rows="2"
                                />
                                {steps.length > 1 && (
                                    <button 
                                        type="button" 
                                        className="remove-btn"
                                        onClick={() => removeStep(index)}
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                            {recipeType === 'detailed' && (
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
                            )}
                            {step.image && (
                                <div className="step-image-container">
                                    <img src={step.image} alt={`Шаг ${index + 1}`} className="step-image-preview" style={{display: 'block'}} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <button type="button" className="add-btn" onClick={addStep}>
                    + Добавить шаг
                </button>
            </div>

            <div className="form-group">
                <label htmlFor="cookingTime">Время приготовления</label>
                <input 
                    type="text" 
                    id="cookingTime" 
                    name="cookingTime" 
                    className="form-control" 
                    value={formData.cookingTime}
                    onChange={handleChange}
                    placeholder="Например: 30 минут"
                />
            </div>

            <div className="form-group">
                <label htmlFor="calories">Калорийность (ккал)</label>
                <input 
                    type="number" 
                    id="calories" 
                    name="calories" 
                    className="form-control" 
                    value={formData.calories}
                    onChange={handleChange}
                    placeholder="Например: 250"
                    min="0"
                />
            </div>

            <div className="form-group">
                <label htmlFor="difficulty">Сложность</label>
                <select 
                    id="difficulty" 
                    name="difficulty" 
                    className="form-control" 
                    value={formData.difficulty}
                    onChange={handleChange}
                >
                    <option value="легкая">Легкая</option>
                    <option value="средняя">Средняя</option>
                    <option value="сложная">Сложная</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="category">Категория</label>
                <select 
                    id="category" 
                    name="category" 
                    className="form-control" 
                    value={formData.category}
                    onChange={handleChange}
                >
                    <option value="Первые блюда">Первые блюда</option>
                    <option value="Вторые блюда">Вторые блюда</option>
                    <option value="Салаты">Салаты</option>
                    <option value="Закуски">Закуски</option>
                    <option value="Десерты">Десерты</option>
                    <option value="Выпечка">Выпечка</option>
                    <option value="Напитки">Напитки</option>
                </select>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="form-footer">
                <button type="submit" className="btn btn-moderator">
                    {isEditing ? 'Обновить рецепт' : (isModerator ? 'Опубликовать рецепт' : 'Отправить модератору')}
                </button>
                <button type="button" className="btn" onClick={onClose}>Отмена</button>
            </div>
        </form>
    );
}

export default AddRecipeForm;
