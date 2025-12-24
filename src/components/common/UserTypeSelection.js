import React from 'react';

function UserTypeSelection({ onSelectUserType }) {
    return (
        <div style={{textAlign: 'center', padding: '2rem'}}>
            <h2>Выберите тип пользователя</h2>
            <div style={{display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap'}}>
                <div 
                    style={{
                        border: '2px solid #ddd',
                        borderRadius: '8px',
                        padding: '2rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        maxWidth: '300px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary-color)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#ddd'}
                    onClick={() => onSelectUserType('user')}
                >
                    <h3>Обычный пользователь</h3>
                    <p>Просмотр рецептов и статей, добавление материалов на модерацию</p>
                </div>
                <div 
                    style={{
                        border: '2px solid #ddd',
                        borderRadius: '8px',
                        padding: '2rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        maxWidth: '300px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary-color)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#ddd'}
                    onClick={() => onSelectUserType('moderator')}
                >
                    <h3>Модератор</h3>
                    <p>Просмотр и модерация рецептов и статей, редактирование материалов</p>
                </div>
            </div>
        </div>
    );
}

export default UserTypeSelection;
