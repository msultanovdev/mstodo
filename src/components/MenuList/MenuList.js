import React, { useState, useEffect } from 'react';
import List from '../List/List';
import AddList from '../AddList/AddList';
import Tasks from '../Tasks/Tasks';
import axios from 'axios';

import './MenuList.css';
import listSvg from '../../assets/img/list.svg';

const MenuList = () => {
    const [lists, setLists] = useState(null);
    const [colors, setColors] = useState(null);
    const [activeItem, setActiveItem] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:3001/lists?_expand=color&_embed=tasks').then(({data}) => {
            setLists(data);
        });
        axios.get('http://localhost:3001/colors').then(({data}) => {
            setColors(data);
        });
    }, []);

    const onAddList = (obj) => {
        const newLists = [...lists, obj];
        setLists(newLists);
    };

    const onAddTask = (listId, taskObj) => {
        const newLists = lists.map((item, key) => {
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

    return(
        <div className="todo">
            {
                lists && <div className="todo__sidebar">
                <List
                    items={[
                    {   
                        active: true,
                        icon: <img src={listSvg} alt='icon' />,
                        name: 'Список задач',
                    }
                        ]}
                    />
                <List items={lists} 
                    isRemovable
                    onRemove={(item) => onDeleteList(item)}
                    onClickItem={item => { 
                        setActiveItem(item);
                    }}
                    activeItem={activeItem}
                />
                <AddList onAdd={onAddList} colors={colors} />
                
                </div>
            }
                
            {lists && activeItem &&
            <div className="todo__tasks">
                <Tasks list={activeItem} onAddTask={onAddTask} onEditTitle={onEditListTitle} />
            </div>}
        </div>
    );
}

export default MenuList;