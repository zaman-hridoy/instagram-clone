import React, { Fragment } from 'react';

const SelectInput = ({ input, placeholder, className, meta: { touched, error } }) => {
    console.log(input);
    return (
        <Fragment>
            <select {...input} placeholder={placeholder} className={className}>
                <option value="" disabled>Please select your option</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="others">Others</option>
            </select>
            {touched && error && <p style={{ color: 'red', textAlign: 'left', width: 225, margin: '1px auto' }}>{error}</p>}
        </Fragment>
    );
}

export default SelectInput;
