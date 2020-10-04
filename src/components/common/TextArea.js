import React, { Fragment } from 'react';

const TextInput = ({input, placeholder, type, className, rows, meta: { touched, error }}) => {
    return (
        <Fragment>
            <textarea 
                { ...input } 
                placeholder={placeholder} 
                type={type} 
                className={className} 
                rows={rows}
            />
            {touched && error && <p style={{ color: 'red', textAlign: 'left', width: 225, margin: '1px auto' }}>{error}</p>}
        </Fragment>
    );
}

export default TextInput;
