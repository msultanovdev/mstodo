import React from 'react';
import classNames from 'classnames';
import Badge from '../Badge/Badge';

import removeSvg from '../../assets/img/remove.svg';
import './List.css';

const List = ({ items, onClick, isRemovable, onRemove, onClickItem, activeItem }) => {
    const removeList = (item) => {
        if(window.confirm('Вы действительно хотите удалить список?')) {
            onRemove(item);
        }
    }

    return(
        <ul onClick={onClick} className="menu-list">
            {items.map((item, index) => (
                <li 
                    onClick={onClickItem ? () => onClickItem(item) : null} 
                    className={classNames(item.className, {
                        active: item.active 
                        ? item.active 
                        : activeItem && activeItem.id === item.id})}
                    key={index} 
                >
                     <i>{item.icon ? item.icon : <Badge itemColor={item.color.name} />}</i>
                    <span>
                        {item.name}
                        {item.tasks && item.tasks.length > 0 && ` (${item.tasks.length})`}
                    </span>
                    {
                        isRemovable && <img onClick={() => removeList(item)} className="menu-list__remove-icon" alt="remove icon" src={removeSvg} />
                    }
                </li>
            ))}    
        </ul>
    );
}

export default List;