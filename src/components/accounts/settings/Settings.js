import React, { Component } from 'react';
import {Switch, Route, NavLink, Redirect } from 'react-router-dom';
import './Settings.css';

// components
import EditProfile from './EditProfile';
import ChangePassword from './ChangePassword';

class Settings extends Component {
    render() {
        return (
            <div className="app__container">
                <div className="settings__wrapper">
                    <div className="settings__nav">
                        <div className="seetings_edit_profile">
                            <NavLink to="/accounts/settings/edit-profile" activeClassName="settings_nav_selected">
                                <strong>Edit Profile</strong>
                            </NavLink>
                        </div>
                        <div className="seetings_edit_profile">
                            <NavLink to="/accounts/settings/change-password" activeClassName="settings_nav_selected">
                                <strong>Change Password</strong>
                            </NavLink>
                        </div>
                    </div>
                    <div className="settings__options">
                        <Switch>
                            <Redirect exact from="/accounts/settings" to="/accounts/settings/edit-profile" />
                            <Route path="/accounts/settings/edit-profile" component={EditProfile} />
                            <Route path="/accounts/settings/change-password" component={ChangePassword} />
                        </Switch>
                    </div>
                </div>
                <span className="footer__info">© 2020 INSTAGRAM FROM FACEBOOK</span>
            </div>
        )
    }
}

export default Settings;