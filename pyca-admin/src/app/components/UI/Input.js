import React from 'react'

const Input = ({ elementType, elementConfig, value, changed, label, invalid, shouldValidate, touched, errorMsg }) => {
    let inputElement = null;
    const inputClasses = ["form-control"];

    if (invalid && shouldValidate && touched) {
        inputClasses.push("is-invalid");
    }
    switch (elementType) {
        case ('input'):
            inputElement = <input
                className={inputClasses.join(" ")}
                {...elementConfig}
                value={value}
                onChange={changed} />;
            break;
        case ('textarea'):
            inputElement = <textarea
                className={inputClasses.join(" ")}
                {...elementConfig}
                value={value}
                onChange={changed} />;
            break;
        case ('select'):
            inputElement = (
                <select
                    className={inputClasses.join(" ")}
                    value={value}
                    onChange={changed}>
                    {elementConfig.options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.displayValue}
                        </option>
                    ))}
                </select>
            );
            break;
        default:
            inputElement = <input
                className={inputClasses.join(" ")}
                {...elementConfig}
                value={value}
                onChange={changed} />;
    }

    return (
        <div className="form-group">
            <label >{label}</label>
            {inputElement}
            {invalid && shouldValidate && touched && <span className="text-danger">{errorMsg}</span>}
        </div>
    );
}

export default Input