import React, { useState, useEffect } from 'react';

function SearchParameters({ onFilterChange, activeFilters }) {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [selectedDifficulties, setSelectedDifficulties] = useState([]);
    const [caloriesRange, setCaloriesRange] = useState({ min: '', max: '' });

    const categories = [
        "Первые блюда", "Вторые блюда", "Салаты", "Закуски", 
        "Десерты", "Выпечка", "Напитки"
    ];

    const ingredients = [
        "Картофель", "Капуста", "Лук", "Морковь", "Свёкла", "Огурцы", 
        "Грибы", "Греча", "Рис", "Ржаная мука", "Пшеничная мука", 
        "Сметана", "Творог", "Простокваша", "Ряженка", "Кефир", 
        "Сливочное масло", "Свинина", "Говядина", "Курица", "Рыба", 
        "Чеснок", "Укроп", "Лавровый лист", "Чёрный перец", 
        "Красный перец", "Хрен", "Горчица", "Мёд",
        "Растительное масло", "Куриное яйцо"
    ];

    const difficulties = ["легкая", "средняя", "сложная"];

    useEffect(() => {
        setSelectedCategories(activeFilters.categories || []);
        setSelectedIngredients(activeFilters.ingredients || []);
        setSelectedDifficulties(activeFilters.difficulties || []);
        setCaloriesRange(activeFilters.calories || { min: '', max: '' });
    }, [activeFilters]);

    const handleCategoryChange = (category) => {
        const updatedCategories = selectedCategories.includes(category)
            ? selectedCategories.filter(c => c !== category)
            : [...selectedCategories, category];
        
        setSelectedCategories(updatedCategories);
        applyFilters(updatedCategories, selectedIngredients, selectedDifficulties, caloriesRange);
    };

    const handleIngredientChange = (ingredient) => {
        const updatedIngredients = selectedIngredients.includes(ingredient)
            ? selectedIngredients.filter(i => i !== ingredient)
            : [...selectedIngredients, ingredient];
        
        setSelectedIngredients(updatedIngredients);
        applyFilters(selectedCategories, updatedIngredients, selectedDifficulties, caloriesRange);
    };

    const handleDifficultyChange = (difficulty) => {
        const updatedDifficulties = selectedDifficulties.includes(difficulty)
            ? selectedDifficulties.filter(d => d !== difficulty)
            : [...selectedDifficulties, difficulty];
        
        setSelectedDifficulties(updatedDifficulties);
        applyFilters(selectedCategories, selectedIngredients, updatedDifficulties, caloriesRange);
    };

    const handleCaloriesChange = (field, value) => {
        const updatedRange = {
            ...caloriesRange,
            [field]: value
        };
        
        setCaloriesRange(updatedRange);
        applyFilters(selectedCategories, selectedIngredients, selectedDifficulties, updatedRange);
    };

    const applyFilters = (categories, ingredients, difficulties, calories) => {
        onFilterChange({
            categories,
            ingredients,
            difficulties,
            calories
        });
    };

    const clearFilters = () => {
        setSelectedCategories([]);
        setSelectedIngredients([]);
        setSelectedDifficulties([]);
        setCaloriesRange({ min: '', max: '' });
        onFilterChange({
            categories: [],
            ingredients: [],
            difficulties: [],
            calories: { min: '', max: '' }
        });
    };

    return (
        <div className="search-params">
            <h3>Поиск по параметрам</h3>

            <div className="params-grid">
                <div className="param-group">
                    <h4>Категории:</h4>
                    <ul className="param-list">
                        {categories.map(category => (
                            <li key={category}>
                                <input
                                    type="checkbox"
                                    id={`cat-${category}`}
                                    checked={selectedCategories.includes(category)}
                                    onChange={() => handleCategoryChange(category)}
                                />
                                <label htmlFor={`cat-${category}`}>{category}</label>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="param-group">
                    <h4>Ингредиенты:</h4>
                    <ul className="param-list">
                        {ingredients.map(ingredient => (
                            <li key={ingredient}>
                                <input
                                    type="checkbox"
                                    id={`ing-${ingredient}`}
                                    checked={selectedIngredients.includes(ingredient)}
                                    onChange={() => handleIngredientChange(ingredient)}
                                />
                                <label htmlFor={`ing-${ingredient}`}>{ingredient}</label>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="param-group">
                    <h4>Сложность:</h4>
                    <ul className="param-list">
                        {difficulties.map(difficulty => (
                            <li key={difficulty}>
                                <input
                                    type="checkbox"
                                    id={`diff-${difficulty}`}
                                    checked={selectedDifficulties.includes(difficulty)}
                                    onChange={() => handleDifficultyChange(difficulty)}
                                />
                                <label htmlFor={`diff-${difficulty}`}>{difficulty}</label>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="param-group">
                    <h4>Калорийность:</h4>
                    <div className="calories-range">
                        <span>от:</span>
                        <input
                            type="number"
                            className="calories-input"
                            value={caloriesRange.min}
                            onChange={(e) => handleCaloriesChange('min', e.target.value)}
                            placeholder="0"
                            min="0"
                        />
                        <span>до:</span>
                        <input
                            type="number"
                            className="calories-input"
                            value={caloriesRange.max}
                            onChange={(e) => handleCaloriesChange('max', e.target.value)}
                            placeholder="1000"
                            min="0"
                        />
                    </div>
                    <button 
                        className="btn" 
                        onClick={clearFilters}
                        style={{marginTop: '1rem', width: '100%'}}
                    >
                        Сбросить фильтры
                    </button>
                </div>
            </div>

            <div className="active-filters">
                {selectedCategories.map(category => (
                    <span key={category} className="active-filter">
                        {category}
                        <button 
                            className="active-filter-remove"
                            onClick={() => handleCategoryChange(category)}
                        >
                            ×
                        </button>
                    </span>
                ))}
                {selectedIngredients.map(ingredient => (
                    <span key={ingredient} className="active-filter">
                        {ingredient}
                        <button 
                            className="active-filter-remove"
                            onClick={() => handleIngredientChange(ingredient)}
                        >
                            ×
                        </button>
                    </span>
                ))}
                {selectedDifficulties.map(difficulty => (
                    <span key={difficulty} className="active-filter">
                        {difficulty}
                        <button 
                            className="active-filter-remove"
                            onClick={() => handleDifficultyChange(difficulty)}
                        >
                            ×
                        </button>
                    </span>
                ))}
                {(caloriesRange.min || caloriesRange.max) && (
                    <span className="active-filter">
                        Калории: {caloriesRange.min || 0}-{caloriesRange.max || '∞'}
                        <button 
                            className="active-filter-remove"
                            onClick={() => setCaloriesRange({ min: '', max: '' })}
                        >
                            ×
                        </button>
                    </span>
                )}
            </div>
        </div>
    );
}

export default SearchParameters;