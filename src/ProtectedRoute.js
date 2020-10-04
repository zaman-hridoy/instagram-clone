import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

const ProtectedRoute = ({
    isAuthenticated,
    component: Component,
    ...rest
}) => 
{
    // console.log(isAuthenticated)
    return (
        <Route {...rest} component={(props) => (
            isAuthenticated ? (
                <Component {...props} />
            ) : (
                <Redirect to="/accounts/signin" />
            )
        )} />
    );
}

const mapStateToProps = state => ({
    isAuthenticated: !!state.auth.user?.uid
})

export default connect(mapStateToProps)(ProtectedRoute);
