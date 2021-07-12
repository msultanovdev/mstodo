import React, { useState, useEffect } from 'react';
import List from '../List/List';
import Badge from '../Badge/Badge';
import axios from 'axios';

import closeSvg from '../../assets/img/close.svg';
import addSvg from '../../assets/img/add.svg';

import './AddList.css';

const AddList = ({ colors, onAdd }) => {
    const [visibleForm, setVisibleForm] = useState(false);
    const [currentColor, setCurrentColor] = useState(3);
    const [isLoading, setIsLoading] = useState(false);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        if(Array.isArray(colors)) {
            setCurrentColor(colors[0].id);
        }
    }, [colors]);
    
    const onClose = () => {
        setVisibleForm(false);
        setInputValue('');
        setVisibleForm(false);
        setCurrentColor(colors[0].id);
    };

    const addList = () => {
        if(!inputValue) {
            alert('Введите название списка!');
        } 
        setIsLoading(true);
        axios
        .post('http://localhost:3001/lists', { name: inputValue, colorId: currentColor })
        .then(({data})=> { 
            const color = colors.filter(c => c.id === currentColor)[0].name;
            const listObj = {...data, color: { name: color }};
            onAdd(listObj);
            onClose();
         })
         .finally(() => {
            setIsLoading(false);
         });
    };
    
    return(
        <div className="add-list">
            <List 
            onClick={() => setVisibleForm(true)}
            items={[
                {
                    className: 'menu__add-list',
                    icon: <img className='menu__add-btn' src={addSvg} alt='icon' />,
                    name: 'Добавить список'
                }
            ]} 
            />
            {
                visibleForm && 
                <div className="add-list__form">
                <img   
                    onClick={onClose}
                    className="add-list__form-close-btn" 
                    src={closeSvg} 
                    alt="close icon" />
                <input 
                    className="field" 
                    type="text" 
                    placeholder="Название списка" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <div className="add-list__form-colors">
                    {
                        colors.map((color) => 
                        <Badge 
                        onClick={() => setCurrentColor(color.id)} 
                        key={color.id} 
                        itemColor={color.name}
                        className={currentColor === color.id && 'active'}
                        />)
                    }
                </div>
                <button onClick={addList} className="button" >
                    {isLoading ? 'Добавление' : 'Добавить'}
                </button>
            </div>
            }
        </div>
    );
}

export default AddList;