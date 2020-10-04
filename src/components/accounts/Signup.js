import React, { Component, Fragment } from 'react';
import Facebook from '@material-ui/icons/Facebook';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { composeValidators, combineValidators, isRequired, hasLengthGreaterThan } from 'revalidate';
import './Signup.css';
import { signupUser, signInWithFacebook } from '../../actions/authActions';

// Text input component
import TextInput from '../common/TextInput';
import { connect } from 'react-redux';

const validate = combineValidators({
    email: isRequired({message: 'Please enter a valid email'}),
    fullname: composeValidators(
        isRequired({ message: 'Please enter your fullname' }),
        hasLengthGreaterThan(2)({ message: 'Full name needs to be at least 3 characters' })
    )(),
    username: isRequired({ message: 'Please enter your username' }),
    password: isRequired({ message: 'Please enter your password' })
});

class Signup extends Component {
    submittedValues = values => {
        this.props.signupUser(values);
    }
    render() {
        const { handleSubmit, submitting, invalid, loading, authError, signInWithFacebook } = this.props;
        return (
            <Fragment>
                <div className="auth__form">
                <img className="auth__form_logo" src="/assets/images/instagram_logo.png" alt="Instagram Logo"/>
                <h4 className="auth__form__title">
                    Sign up to see photos and videos from your friends.
                </h4>
                <div className="auth__form__facebook_button">
                    <Facebook />
                    <span onClick={signInWithFacebook}>Signup with facebook</span>
                </div>
                <div className="auth__form__divider">
                    <div className="form__left__line"></div>
                    <span>OR</span>
                    <div className="form__right__line"></div>
                </div>
                <form className="auth_form_input" onSubmit={handleSubmit(this.submittedValues)}>
                    <Field 
                        className="auth__input" 
                        type="email" 
                        placeholder="Email" 
                        component={TextInput} 
                        name="email"
                    />
                    <Field 
                        className="auth__input" 
                        type="text" 
                        placeholder="Full Name"
                        component={TextInput}
                        name="fullname" 
                    />
                    <Field 
                        className="auth__input" 
                        type="text" 
                        placeholder="Username"
                        component={TextInput}
                        name="username"
                    />
                    <Field 
                        className="auth__input" 
                        type="password" 
                        placeholder="Password" 
                        component={TextInput}
                        name="password"
                    />
                    <br/>
                    <button disabled={invalid || submitting} type="submit" className="auth__submit_button" >
                        {loading ? 'Loading...' : 'Sign up'}
                    </button>
                    {authError && <p style={{ color: 'red', textAlign: 'center', width: 225, margin: '1px auto', marginBottom: 10 }}>{authError}</p>}
                </form>
                <span className="auth_form_policy">By signing up, you agree to our <strong>Terms , Data Policy</strong> and <strong>Cookies Policy</strong> .</span>
            </div>
            <div className="form__have_account">
                    <span>Have an account?</span> 
                    <span className="have_account_link">
                        {' '}
                        <Link to="/accounts/signin">Log in</Link>
                    </span>
            </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    authError: state.auth.error,
    loading: state.auth.loading
})

const actions = {
    signupUser,
    signInWithFacebook
}

export default compose(
    reduxForm({ form: 'signup', validate }),
    connect(mapStateToProps, actions)
)(Signup);

