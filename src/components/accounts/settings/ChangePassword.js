import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import { Field, reduxForm } from 'redux-form';
import TextInput from '../../common/TextInput';
import { combineValidators, isRequired } from 'revalidate';

const validate = combineValidators({
    oldpassword: isRequired({ message: 'This field is required' }),
    newpassword: isRequired({ message: 'This field is required' })
})

class ChangePassword extends Component {
    handlePasswordChange = value => {
        console.log(value)
    }
    render() {
        const { invalid, submitting, handleSubmit } = this.props;
        return (
            <div className="edit_Profile_form">
                <div className="edit_profile_onwer">
                    <Avatar 
                        style={{ width: 40, height: 40, cursor: 'pointer', marginRight: 20 }} 
                        className="post__avatar"
                        alt="Remy Sharp" 
                        src="/assets/images/avatar.png"
                    />
                    <div className="edit_profile_username">
                        <h4>zaman_hridoy_007</h4>
                    </div>
                </div>

                
                <form className="profile__form" onSubmit={handleSubmit(this.handlePasswordChange)}>
                    {/* old password */}
                    <div className="profle__name edit_profile_style">
                        <label className="edit_profile_label">Old password</label>
                        <div className="form__group">
                            <Field 
                                name="oldpassword"
                                type="password"
                                placeholder="Old password"
                                component={TextInput}
                                className="edit__input"
                            />
                        </div>
                    </div>
                    {/* new password */}
                    <div className="profle__name edit_profile_style">
                        <label className="edit_profile_label">New password</label>
                        <div className="form__group">
                            <Field 
                                name="newpassword"
                                type="password"
                                placeholder="New password"
                                component={TextInput}
                                className="edit__input"
                            />
                        </div>
                    </div>
                    <button disabled={invalid || submitting} type="submit" className="edit_profile_button">Change password</button>
                </form>
            </div>
        )
    }
}

export default reduxForm({ form: 'update_password', validate})(ChangePassword);
