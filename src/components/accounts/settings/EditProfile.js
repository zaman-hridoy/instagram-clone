import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import { Field, reduxForm } from 'redux-form';
import TextInput from '../../common/TextInput';
import TextArea from '../../common/TextArea';
import SelectInput from '../../common/SelectInput';
import { updateUserProfile } from '../../../actions/authActions';
import { connect } from 'react-redux';
import AppLoader from '../../common/loader/Loader';

class EditProfile extends Component {
    handleProfileSubmit = (values) => {
        this.props.updateUserProfile(values);
    }
    render() {
        const { pristine, handleSubmit, authLoading } = this.props;
        
        if(authLoading) return <AppLoader />
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
                        <p>Change Profle Photo</p>
                    </div>
                </div>

                
                <form className="profile__form" onSubmit={handleSubmit(this.handleProfileSubmit)}>
                    {/* name */}
                    <div className="profle__name edit_profile_style">
                        <label className="edit_profile_label">Name</label>
                        <div className="form__group">
                            <Field 
                                name="fullname"
                                type="text"
                                placeholder="Name"
                                component={TextInput}
                                className="edit__input"
                            />
                            <p className="form_helper_text">Help people discover your account by using the name you're known by: either your full name, nickname, or business name.</p>
                        </div>
                    </div>
                    {/* username */}
                    <div className="profle__name edit_profile_style">
                        <label className="edit_profile_label">Username</label>
                        <div className="form__group">
                            <Field 
                                name="username"
                                type="text"
                                placeholder="Username"
                                component={TextInput}
                                className="edit__input"
                            />
                            <p className="form_helper_text">In most cases, you'll be able to change your username back to zaman_hridoy_007 for another 14 days.</p>
                        </div>
                    </div>
                    {/* website */}
                    <div className="profle__name edit_profile_style">
                        <label className="edit_profile_label">Website</label>
                        <div className="form__group">
                            <Field 
                                name="website"
                                type="text"
                                placeholder="Website"
                                component={TextInput}
                                className="edit__input"
                            />
                        </div>
                    </div>
                    {/* bio */}
                    <div className="profle__name edit_profile_style">
                        <label className="edit_profile_label">Bio</label>
                        <div className="form__group">
                            <Field 
                                name="bio"
                                type="text"
                                placeholder="Bio"
                                component={TextArea}
                                className="edit__input"
                                rows={3}
                            />
                        </div>
                    </div>
                    {/* Personal Information */}
                    <div className="personal_info">
                        <h4 style={{ color: 'grey' }}>Personal Information</h4>
                        <p className="form_helper_text">
                            Provide your personal information, even if the account is used for a business, a pet or something else. This won't be a part of your public profile.
                        </p>
                    </div>
                    {/* email */}
                    <div className="profle__name edit_profile_style">
                        <label className="edit_profile_label">Email</label>
                        <div className="form__group">
                            <Field 
                                name="email"
                                type="email"
                                placeholder="Email"
                                component={TextInput}
                                className="edit__input"
                            />
                        </div>
                    </div>
                    {/* Phone number */}
                    <div className="profle__name edit_profile_style">
                        <label className="edit_profile_label">Phone number</label>
                        <div className="form__group">
                            <Field 
                                name="phone"
                                type="number"
                                placeholder="Phone number"
                                component={TextInput}
                                className="edit__input"
                            />
                        </div>
                    </div>
                    {/* Phone number */}
                    <div className="profle__name edit_profile_style">
                        <label className="edit_profile_label">Gender</label>
                        <div className="form__group">
                            <Field 
                                name="gender"
                                type="select"
                                placeholder="Gender"
                                component={SelectInput}
                                className="edit__input"
                            />
                        </div>
                    </div>
                    <button disabled={pristine} type="submit" className="edit_profile_button">SUBMIT</button>
                </form>
            </div>
        )
    }
}

const actions = {
    updateUserProfile
}

const mapStateToProps = state => {
    const initialValues = {};
    if(state.auth.profile) {
        initialValues.fullname = state.auth.profile.fullname;
        initialValues.username = state.auth.profile.displayName;
        initialValues.website = state.auth.profile.website;
        initialValues.bio = state.auth.profile.bio;
        initialValues.email = state.auth.profile.email;
        initialValues.phone = state.auth.profile.phone;
        initialValues.gender = state.auth.profile.gender;
    }
    return {
        profile: state.auth.profile,
        authLoading: state.auth.loading,
        initialValues
    }
};

export default connect(mapStateToProps, actions)(reduxForm({
    form: 'edit_profile', 
    enableReinitialize: true
})(EditProfile));