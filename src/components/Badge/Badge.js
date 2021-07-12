import React from 'react';

import './Badge.css';

const Badge = ({ itemColor, onClick, className }) => {
    return(
        <i onClick={onClick} className={`badge badge--${itemColor} ${className} `}></i>
    );
}

export default Badge;