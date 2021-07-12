import React from 'react';
import axios from 'axios';

import AddTaskFrom from './AddTaskForm';
import editSvg from '../../assets/img/edit.svg';
import './Tasks.css';

const Tasks = ({ list, onEditTitle, onAddTask }) => {

    const editTitle = () => {
        const newTitle = window.prompt('Введите новое название списка', list.name);
        if(newTitle) {
            onEditTitle(list.id, newTitle);
            axios.patch(`http://localhost:3001/lists/${list.id}`, { 
                name: newTitle
            }).catch(() =>{
                alert('Ошибка! Не удалось обновить название списка!');
            });
        }
    }   

    return (
        <div className="tasks">
            <h2 className="tasks__title">
                {list.name}
                <img onClick={editTitle} className="tasks__title-pen" src={editSvg} alt="edit icon" />
            </h2>

            <div className="tasks__items">
                {!list.tasks.length && <h2>Задачи отсутствуют</h2>}
                {
                    list.tasks.map(task => {
                        return (
                            <div key={task.id} className="tasks__items-row">
                                <div className="tasks__items-checkbox">
                                    <input id={task.id} type="checkbox" />
                                    <label htmlFor={task.id}>
                                        <svg width="11" height="8" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9.29999 1.20001L3.79999 6.70001L1.29999 4.20001" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </label>
                                </div>
                                <input readOnly className="tasks__items-title" value={task.text} />
                            </div>
                        );
                    })
                }

                <AddTaskFrom list={list} onAddTask={onAddTask} />                
            </div>
        </div>
    );
};

export default Tasks;