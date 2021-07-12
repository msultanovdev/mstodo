import React, { useState } from 'react';
import axios from 'axios';

import './Tasks.css';
import addSvg from '../../assets/img/add.svg';

const AddTaskFrom = ({ list, onAddTask }) => {
    const [visibleForm, setVisibleForm] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const toggleVisibility = () => {
        setVisibleForm(!visibleForm);
        setInputValue('');
    };

    const addTask = () => {
        const obj = {
            "listId": list.id,
            "text": inputValue,
            "completed": false
        };
        setIsLoading(true);
        axios.post('http://localhost:3001/tasks', obj).then(({ data }) => {
            onAddTask(list.id, data);
            toggleVisibility();
        }).catch('Ошибка, задача не добавлена')
        .finally(
            setIsLoading(false)
        );
    };

    return (
        <div className="tasks__form">
                {
                    !visibleForm ?
                    <div onClick={toggleVisibility} className="tasks__form-new">
                        <img src={addSvg} alt="add icon" />
                        <span>Добавить задачу</span>
                    </div>
                 :
                    ( <div className="tasks__form-create">
                        <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="field" placeholder="Текст задачи" />
                        <button disabled={isLoading} onClick={addTask} className="button">{isLoading ? 'Добавление...' : 'Добавить задачу'}</button>
                        <button onClick={toggleVisibility} className="button button--grey">Отмена</button>
                    </div> )
                }
        </div>
    )
}

export default AddTaskFrom;
