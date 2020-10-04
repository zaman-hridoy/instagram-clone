import React, { Fragment } from 'react';

const TextInput = ({input, placeholder, type, className, meta: { touched, error }}) => {
    return (
        <Fragment>
            <input 
                { ...input } 
                placeholder={placeholder} 
                type={type} 
                className={className} 
            />
            {touched && error && <p style={{ color: 'red', textAlign: 'left', width: 225, margin: '1px auto' }}>{error}</p>}
        </Fragment>
    );
}

export default TextInput;
