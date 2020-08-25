import React from 'react'
import '../App.css';
import { toast } from 'react-toastify';

import axios from './../axios'
import Layout from '../hoc/layout/layout';
import Input from '../components/UI/Input'
import Loading from '../components/UI/Loading'
import { updateObject, checkValidity } from '../shared/utility';

class Setting extends React.Component {
    state = {
        settingForm: {
            oldPassword: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: '************'
                },
                value: '',
                label: "Old password",
                errorMsg: "Old password is required",
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            newPassword: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: '************'
                },
                value: '',
                label: "New password",
                errorMsg: "New password is required/minimum length 8",
                validation: {
                    required: true,
                    minLength: 8
                },
                valid: false,
                touched: false
            },
            confirmPassword: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: '************'
                },
                value: '',
                label: "Confirm password",
                errorMsg: "Confirm password and new password must be same",
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
        },
        formIsValid: false,
        loader: false
    }
    orderHandler = (event) => {
        event.preventDefault();

        const formData = {};
        for (let formElementIdentifier in this.state.settingForm) {
            formData[formElementIdentifier] = this.state.settingForm[formElementIdentifier].value;
        }
        this.setState({
            ...this.setState,
            loader: true
        })
        axios.post('/admin/changePassword', formData)
            .then(result => {
                if (result.data.status == "success") {
                    this.setState(
                        {
                            ...this.state,
                            loader: false,
                        }
                    )
                    toast.success(result.data.message);
                }
            }).catch(error => {
                console.log({ error })
                this.setState({
                    ...this.setState,
                    loader: false
                })
                if (error.response.data) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error(error.message);

                }
            })

    }

    inputChangedHandler = (event, inputIdentifier) => {
        let valid = checkValidity(event.target.value, this.state.settingForm[inputIdentifier].validation)
        if (inputIdentifier === 'confirmPassword') {
            valid = event.target.value == this.state.settingForm['newPassword'].value && valid
        }

        const updatedFormElement = updateObject(this.state.settingForm[inputIdentifier], {
            value: event.target.value,
            valid: valid,
            touched: true
        });

        const updatedsettingForm = updateObject(this.state.settingForm, {
            [inputIdentifier]: updatedFormElement
        });

        let formIsValid = true;
        for (let inputIdentifier in updatedsettingForm) {
            formIsValid = updatedsettingForm[inputIdentifier].valid && formIsValid;
        }
        this.setState({ settingForm: updatedsettingForm, formIsValid: formIsValid });
    }

    render() {
        const formElementsArray = [];
        for (let key in this.state.settingForm) {
            formElementsArray.push({
                id: key,
                config: this.state.settingForm[key]
            });
        }
        let form = (
            <form onSubmit={this.orderHandler} id="change-password-form">
                {formElementsArray.map(formElement => (
                    <Input
                        key={formElement.id}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        invalid={!formElement.config.valid}
                        shouldValidate={formElement.config.validation}
                        touched={formElement.config.touched}
                        label={formElement.config.label}
                        errorMsg={formElement.config.errorMsg}
                        changed={(event) => this.inputChangedHandler(event, formElement.id)} />
                ))}
                <button disabled={!this.state.formIsValid}>Submit</button>
            </form>
        );
        return <Layout>
            <Loading loader={this.state.loader} />
            <div className="WrapperArea">
                <div className="WrapperBox">
                    <div className="Small-Wrapper">
                        <h4 className="Title">Change password</h4>
                        <div className="PasswordArea">
                            <div className="row">
                                <div className="col-sm-7">
                                    {form}
                                </div>


                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </Layout>
    }
}
export default Setting