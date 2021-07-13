import React, { useState, useEffect } from 'react';
import List from '../List/List';
import AddList from '../AddList/AddList';
import Tasks from '../Tasks/Tasks';
import axios from 'axios';
import { Route, useHistory, useLocation } from "react-router-dom";

import './MenuList.css';
import listSvg from '../../assets/img/list.svg';

const MenuList = () => {
    const [lists, setLists] = useState(null);
    const [colors, setColors] = useState(null);
    const [activeItem, setActiveItem] = useState(null);
    let history = useHistory();
    let location = useLocation();

    useEffect(() => {
        axios.get('http://localhost:3001/lists?_expand=color&_embed=tasks').then(({data}) => {
            setLists(data);
        });
        axios.get('http://localhost:3001/colors').then(({data}) => {
            setColors(data);
        });
    }, []);

    useEffect(() => {
        const listId = location.pathname.split('lists/')[1];
        if(lists) {
            const list = lists.find(list => list.id === Number(listId));
            setActiveItem(list);
        }
    }, [lists, location.pathname]);

    const onAddList = (obj) => {
        const newLists = [...lists, obj];
        setLists(newLists);
    };

    const onAddTask = (listId, taskObj) => {
        const newLists = lists.map((item) => {
            if(item.id === listId) {
                item.tasks = [...item.tasks, taskObj];
            }
            return item;
        });
        setLists(newLists);
    }

    const onDeleteList = (item) => {
        axios.delete(`http://localhost:3001/lists/${item.id}`);
        const updatedLists = [...lists];
        const indexOfDeletedTodo = lists.findIndex((todoInArray) => todoInArray.id  === item.id);
        updatedLists.splice(indexOfDeletedTodo, 1);
        setLists(updatedLists);
    }
    
    const onEditListTitle = (id, title) => {
        const newLists = lists.map(item => {
            if(item.id === id) {
                item.name = title;
            }
            return item;
        });
        setLists(newLists)
    }

    const onEditTask = (listId, taskObj) => {
        const newTaskText = window.prompt('Изменить текст задачу', taskObj.text);

        if(!newTaskText) {
            return;
        }

        const newLists = lists.map(list => {
            if(list.id === listId) 
                { 
                    list.tasks = list.tasks.map(list => {
                        if(list.id === taskObj.id) {
                            list.text = newTaskText;
                        }
                        return list;
                    }); 
                } 
                return list;
            });
            axios.patch(`http://localhost:3001/tasks/${taskObj.id}`, {
                text: newTaskText
            })
            .then(setLists(newLists))
            .catch(() =>{
            alert('Ошибка! Не удалось изменить название задачи!');
        });
    }


    const onRemoveTask = ( listId, taskId ) => {
        if(window.confirm('Вы действительно хотите удалить задачу?')) {
            const newLists = lists.map(item => {
                if(item.id === listId) 
                { 
                    item.tasks = item.tasks.filter(task => task.id !== taskId); 
                } 
                return item;
            });
            axios.delete(`http://localhost:3001/tasks/${taskId}`)
            .then(setLists(newLists))
            .catch(() =>{
            alert('Ошибка! Не удалось удалить задаучу!');
        });
    }
};

    // const onCompleteTask = (listId, taskId, completed) => {
    //     const newList = lists.map(list => {
    //     if (list.id === listId) {
    //         list.tasks = list.tasks.map(task => {
    //         if (task.id === taskId) {
    //             task.completed = completed;
    //         }
    //         return task;
    //         });
    //     }
    //     return list;
    //     });
    //     setLists(newList);
    //     axios
    //     .patch('http://localhost:3001/tasks/' + taskId, {
    //         completed
    //     })
    //     .catch(() => {
    //         alert('Не удалось обновить задачу');
    //     });
    // };

    return(
        <div className="todo">
            {
                lists && <div className="todo__sidebar">
                <List
                    onClickItem={() => { 
                        history.push('/');
                    }}
                    items={[
                    {   
                        active: history.location.pathname === '/',
                        icon: <img src={listSvg} alt='icon' />,
                        name: 'Список задач',
                    }
                        ]}
                    />
                <List items={lists} 
                    isRemovable
                    onRemove={(item) => onDeleteList(item)}
                    onClickItem={list => { 
                        history.push(`/lists/${list.id}`);
                    }}
                    activeItem={activeItem}
                />
                <AddList onAdd={onAddList} colors={colors} />
                
                </div>
            }
            <div className="todo__tasks">
                <Route exact path="/">
                { lists &&
                    lists.map(list => {
                        return (
                            <Tasks 
                            key={list.id}
                            list={list}
                            onAddTask={onAddTask}
                            onEditTitle={onEditListTitle}
                            onEditTask={onEditTask}
                            onRemoveTask={onRemoveTask}
                            withoutEmpty
                        />
                        );
                    })
                }
                </Route>
                <Route path="/lists/:id">
                    {lists && activeItem &&
                        <Tasks 
                            onRemoveTask={onRemoveTask} 
                            onEditTask={onEditTask} 
                            list={activeItem} 
                            onAddTask={onAddTask} 
                            onEditTitle={onEditListTitle} 
                        />
                    }
                </Route>
            </div>
        </div>
    );
}

export default MenuList;