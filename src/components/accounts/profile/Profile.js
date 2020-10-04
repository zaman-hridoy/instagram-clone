import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import ProfileTab from './ProfileTab';

import './Profile.css';

class Profile extends Component {
    render() {
        const { profile } = this.props;
        return (
            <div className="app__container">
                <div className="app__row">
                    <div className="app_col_3">
                        <div className="profile_image">
                            <img 
                                className="profile_photourl" 
                                src={profile && (profile.photoURL || "/assets/images/avatar.png")} alt={profile && profile.fullname || 'guest'}
                            />
                        </div>
                    </div>
                    <div className="app_col_7">
                        <div className="profile_user_info">
                            <div className="profile_user_name">
                                <h2>{profile && (profile.displayName || 'Guest')}</h2>
                                <Link to="/accounts/settings">
                                    Edit profile
                                </Link>
                            </div>
                            <div className="post_follower_counts">
                                <div className="posts_count">
                                    <strong>0</strong>
                                    {' '}
                                    <span>posts</span>
                                </div>
                                <div className="followers_count">
                                    <strong>0</strong>
                                    {' '}
                                    <span>Followers</span>
                                </div>
                                <div className="following_count">
                                    <strong>0</strong>
                                    {' '}
                                    <span>Following</span>
                                </div>
                            </div>
                            <h2 className="profile_fullname">{profile && (profile.fullname || 'Guest')}</h2>
                        </div>
                    </div>
                </div>
                <ProfileTab />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    profile: state.auth.profile
})

export default connect(mapStateToProps)(Profile);
