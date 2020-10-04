import React, { Component, Fragment } from 'react';
import Facebook from '@material-ui/icons/Facebook';
import { Field, reduxForm } from 'redux-form';
import { compose } from 'redux';
import { combineValidators, isRequired } from 'revalidate';
import { Link } from 'react-router-dom';
import './Signup.css';
import { signInUser, signInWithFacebook } from '../../actions/authActions';

// Text input component
import TextInput from '../common/TextInput';
import { connect } from 'react-redux';

const validate = combineValidators({
    email: isRequired({message: 'Please enter a valid email'}),
    password: isRequired({ message: 'Please enter your password' })
});

class Signup extends Component {
    submittedValues = values => {
        this.props.signInUser(values);
    }
    render() {
        const { handleSubmit, submitting, invalid, loading, authError, signInWithFacebook } = this.props;
        return (
            <Fragment>
                <div className="auth__form">
                <img className="auth__form_logo" src="/assets/images/instagram_logo.png" alt="Instagram Logo"/>
                {/* <div className="auth__form__facebook_button">
                    <Facebook />
                    <span>Signup with facebook</span>
                </div> */}
                
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
                        type="password" 
                        placeholder="Password" 
                        component={TextInput}
                        name="password"
                    />
                    <br/>
                    <button disabled={invalid || submitting} type="submit" className="auth__submit_button" >
                        {loading ? 'Loading...' : 'log in'}
                    </button>
                    {authError && <p style={{ color: 'red', textAlign: 'center', width: 225, margin: '1px auto', marginBottom: 10 }}>{authError}</p>}
                </form>
                <div className="auth__form__divider">
                    <div className="form__left__line"></div>
                    <span>OR</span>
                    <div className="form__right__line"></div>
                </div>
                <div className="auth__form__facebook_button_login">
                    <Facebook />
                    <span onClick={signInWithFacebook}>Log in with facebook</span>
                </div>
                <span className="auth_form_policy" style={{color: 'blue', cursor: 'pointer'}}>Forgot password?</span>
            </div>
            <div className="form__have_account">
                    <span>Don't have an account?</span> 
                    <span className="have_account_link">
                        {' '}
                        <Link to="/accounts/signup">Sign up</Link>
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
    signInUser,
    signInWithFacebook
}

export default compose(
    reduxForm({ form: 'signin', validate }),
    connect(mapStateToProps, actions)
)(Signup);

