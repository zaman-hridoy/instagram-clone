import React, { Component, Fragment } from 'react';
import Posts from '../posts/Posts';
import Avatar from '@material-ui/core/Avatar';
import { connect } from 'react-redux';
import AppLoader from '../common/loader/Loader';
import { Link } from 'react-router-dom';
import ReactSlider from './Slider';


import './Homepage.css';

import { getAllUnfollowerUsers } from '../../utls/utils';
import { startFollowing } from '../../actions/authActions';

class Homepage extends Component {
    state = {
        windowWidth: window.innerWidth
    }
    componentDidMount() {
        window.addEventListener('resize', () => {
            this.setState({ windowWidth: window.innerWidth });
        })
    }
    render() {
        const { authLoading, profile, user, startFollowing } = this.props;
        const users= getAllUnfollowerUsers(this.props.allUsers, this.props.following);
        // console.log(this.state.windowWidth);
        if(authLoading) return <AppLoader />
        
        return (
            <div className="app__container">
                {this.state.windowWidth < 768 && <div className="slick__carousel">
                        <ReactSlider 
                            users={users} 
                            startFollowing={startFollowing} 
                            authLoading={authLoading} 
                        />
                </div>}
                <div className="app__row">
                    <Posts />
                    {this.state.windowWidth > 767 && <div className="app_col_3">
                        <div className="home_username">
                            <Link to={`/accounts/profile/${user?.uid}`}>
                                <Avatar 
                                    style={{ width: 50, height: 50, marginRight: 10 }} 
                                    className="post__avatar" alt={profile?.fullname || 'Unknown'} 
                                    src={profile && (profile.photoURL ||"/assets/images/avatar.png")} 
                                />
                            </Link>
                            <div className="home_user_name_show">
                                <Link to={`/accounts/profile/${user?.uid}`}>{profile && (profile.displayName || 'Guest')}</Link>
                                <p>{profile && (profile.fullname || 'Guest')}</p>
                            </div>
                        </div>
                        <div className="home_suggestions_sections">
                            <div className="home_suggenstions_header">
                                <h4>Suggestions for you</h4>
                                <Link to="/">See All</Link>
                            </div>
                            {users?.map(user => (
                                <div key={user.id}>
                                    <div className="suggestions_to_follow">
                                        <Link to={`/accounts/profile/`}>
                                            <Avatar 
                                                style={{ width: 30, height: 30, marginRight: 10 }} 
                                                className="post__avatar" alt={profile?.fullname || 'Unknown'} 
                                                src={user && (user.photoURL ||"/assets/images/avatar.png")} 
                                            />
                                            <span>{user?.displayName}</span>
                                        </Link>
                                        <div className="sugges__user_follow" onClick={() => startFollowing(user?.id)}>follow</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    }
                </div>
            </div>
        )
    }
}

const actions = {
    startFollowing
}

const mapStateToProps = state => ({
    authLoading: state.auth.loading,
    profile:  state.auth.profile,
    user: state.auth.user,
    allUsers: state.auth.allUsers,
    following: state.auth.loggedInFollowing
})

export default connect(mapStateToProps, actions)(Homepage);