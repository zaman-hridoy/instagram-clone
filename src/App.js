import React, { Component } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import './App.css';
import { getLoggedInUser } from './actions/authActions';
import { connect } from 'react-redux';

// components
import Header from './components/header/Header';
import Homepage from './components/homepage/Homepage';
import Signup from './components/accounts/Signup';
import Signin from './components/accounts/Signin';
import Settings from './components/accounts/settings/Settings';
// import Profile from './components/accounts/profile/Profile';
import AppLoader from './components/common/loader/Loader';
import UserProfile from './components/accounts/profile/UserProfile';
import SinglePost from './components/posts/SinglePost';
import ProtectedRoute from './ProtectedRoute';
class App extends Component {
  async componentDidMount() {
    await this.props.getLoggedInUser(this.props.history);
  }
  render() {
    const { user, authLoading, isLogged } = this.props;
    if(authLoading) return <AppLoader />
    return (
      <div className="app">
            {/* Header */}
            <Header />
            {/* body */}
                <Switch>
                  <ProtectedRoute exact path="/" component={Homepage}/>
                  <Route path="/accounts/signup" component={Signup} />
                  <Route path="/accounts/signin" component={Signin} />
                  <Route path="/accounts/settings" component={Settings} />
                  <Route path="/accounts/profile/:id" component={UserProfile} />
                  <Route path="/posts/:id" component={SinglePost} />
                </Switch>
      </div>
    );
  }
}

const actions = {
  getLoggedInUser
}

const mapStateToProps = state => ({
  user: state.auth.user,
  authLoading: state.auth.authLoading,
  isLogged: state.auth.user !== null
});

export default withRouter(connect(mapStateToProps, actions)(App));
