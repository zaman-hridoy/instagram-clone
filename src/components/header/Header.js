import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter, Redirect } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Home from '@material-ui/icons/Home';
import GroupOutlined from '@material-ui/icons/GroupOutlined';
import Notifications from '@material-ui/icons/Notifications';
import NotificationsNoneOutlined from '@material-ui/icons/NotificationsNoneOutlined';
import Send from '@material-ui/icons/Send';
import SearchOutlined from '@material-ui/icons/SearchOutlined';
import AddCircle from '@material-ui/icons/AddCircle';
import Person from '@material-ui/icons/Person';
import TurnedInNot from '@material-ui/icons/TurnedInNot';
import Settings from '@material-ui/icons/Settings';
import { signoutUser, clearNotifications } from '../../actions/authActions';
// import { getUserNotifications } from '../../actions/postsActions';
import formatDistance from 'date-fns/formatDistance'

import CreatePostModal from '../createPost/CreatePost';

class Header extends Component {
    state = {
        openOptions: false,
        open: false,
        showNotifications: false
    }
    componentDidMount() {
        // window.addEventListener('scroll', () => {
        //     if(window.scrollY > 10) {
        //         this.app__header.classList.add('sticky_active');
        //     }else {
        //         this.app__header.classList.remove('sticky_active');
        //     }
        // });

    }
    // componentWillUnmount() {
    //     window.removeEventListener('scroll');
    // }
    handleNotifications = () => this.setState({ showNotifications: !this.state.showNotifications });
    openOptionsHandler = () => {
        this.setState({
            openOptions: !this.state.openOptions
        });
    }
    setOpen = () => this.setState({ open : true});
    setClose = () => this.setState({ open : false});
    handleLogout = () => {
        this.openOptionsHandler();
        this.props.signoutUser(this.props.history);
        window.location.reload();
    }
    render() {
        const { openOptions, open } = this.state;
        const { loading, profile, signoutUser, user, history, notifications } = this.props;
        // if(loading && user === null) return <Redirect to="/accounts/signin" />;
        const sortNotifications = notifications?.sort((a, b) => new Date(b.date?.seconds*1000) - new Date(a.date?.seconds*1000));
        // console.log(sortNotifications)
        return (
            <div className="app__header" ref={node => this.app__header = node}>
                {/* create post modal */}
                <CreatePostModal 
                    open={open}
                    setOpen={this.setOpen}
                    setClose={this.setClose}
                />
                <div className="app__container">
                    {/* <div className="header__search mobile">
                        <input className="header_search_input" type="text" placeholder="Search..." />
                        <SearchOutlined />
                    </div> */}
                    {/* <div className="header__search_values">
                        values
                    </div> */}
                    <div className="header__items">
                        <Link to="/">
                            <img 
                                src="/assets/images/instagram_logo.png" 
                                alt="instagram"
                                className="app_header_logo"
                            />
                        </Link>
                        {user && (
                            <div className="header__search desktop">
                                <input className="header_search_input" type="text" placeholder="Search..." />
                                <SearchOutlined />
                            </div>
                        )}
                        {/* header option starts */}
                        {user && (
                            <div className="header__options">
                            <div className="header__search mobile">
                                <SearchOutlined style={{ marginRight: 10, color: "mediumvioletred", cursor: 'pointer', width: 35, height: 35 }}  />
                            </div>
                            <AddCircle onClick={this.setOpen} style={{ marginRight: 10, color: "mediumvioletred", cursor: 'pointer', width: 35, height: 35 }} />
                            <Link to="/">
                                <Home style={{ marginRight: 10, color: 'mediumvioletred', cursor: 'pointer', width: 35, height: 35 }} />
                            </Link>
                            {/* <GroupOutlined style={{ marginRight: 10, color: 'mediumvioletred', cursor: 'pointer', width: 35, height: 35 }}  /> */}
                            <div className="header__notifications">
                                {this.state.showNotifications ? (
                                    <Notifications onClick={this.handleNotifications} style={{ marginRight: 10,  color: 'mediumvioletred', cursor: 'pointer', width: 35, height: 35 }} />
                                ) : (

                                    <NotificationsNoneOutlined onClick={this.handleNotifications} style={{ marginRight: 10,  color: 'mediumvioletred', cursor: 'pointer', width: 35, height: 35 }} />
                                )}
                                {this.state.showNotifications && (
                                    <div className="notifications__box">
                                        <div className="notifications__box_inner">
                                            <div className="notifications__inner__scroll">
                                            {sortNotifications.length > 0 ? sortNotifications.map(n => (
                                                <Link key={n.id} className="each_notification" to={`${n.type === 'follow' ? '/accounts/profile/'+n.followerId : '/posts/'+n.postId}`}  onClick={this.handleNotifications}>
                                                    <Avatar 
                                                        style={{ width: 35, height: 35, cursor: 'pointer' }} 
                                                        className="post__avatar"
                                                        alt={n?.displayName || 'Unknown'} 
                                                        src={ n.photoURL || "/assets/images/avatar.png"} 
                                                    />
                                                    <div className="n__details">
                                                        <h4>{n.displayName}</h4>{' '} 
                                                        {n.type === 'like' && 
                                                            <div className="n__likes">
                                                                <span>
                                                                    likes your post
                                                                </span>
                                                                <span style={{ color: '#ccc', marginLeft: 20 }}>
                                                                    {formatDistance(new Date(Date.now()), new Date(n.date.seconds*1000))} ago.
                                                                </span>
                                                            </div>
                                                        }
                                                        {n.type === 'comment' && 
                                                            <div>
                                                                <span>
                                                                    commented your post. "{n.comment.length > 25 ? n.comment.substr(0, 25)+'...' : n.comment}"
                                                                </span>
                                                                <br/>
                                                                <span style={{ color: '#ccc' }}>
                                                                    {formatDistance(new Date(Date.now()), new Date(n.date.seconds*1000))} ago.
                                                                </span>
                                                            </div>
                                                        }
                                                        {n.type === 'follow' && 
                                                            <div className="n__follow">
                                                                <span>
                                                                    started following you.
                                                                </span>
                                                                <span style={{ color: '#ccc', marginLeft: 20 }}>
                                                                    {formatDistance(new Date(Date.now()), new Date(n.date.seconds*1000))} ago.
                                                                </span>
                                                            </div>
                                                        }
                                                    </div>
                                                </Link>
                                            )) :
                                                <div style={{ textAlign: 'center' }}>
                                                    <p>Empty</p>
                                                </div>
                                            }
                                            </div>
                                            {sortNotifications.length > 0 && (
                                                <div className="clear__notifications"
                                                    onClick={this.props.clearNotifications}
                                                >
                                                    <p>Clear notifications</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <Send style={{ marginRight: 10,  color: 'mediumvioletred', cursor: 'pointer', width: 30, height: 30, transform: 'rotate(-45deg)', marginTop: '-9px' }} />

                            <div className="Avatar_with_popup">
                                <Avatar 
                                    style={{ width: 30, height: 30, cursor: 'pointer' }} 
                                    className="post__avatar"
                                    alt={profile?.fullname || 'Unknown'} 
                                    src={ profile && (profile.photoURL || "/assets/images/avatar.png")} 
                                    onClick={this.openOptionsHandler}
                                />
                                {openOptions && (
                                    <div className="avatar__popup">
                                        <div className="avatar__profile avatar__common">
                                            <Person style={{ marginRight: 10 }} />
                                            <Link onClick={this.openOptionsHandler} to={`/accounts/profile/${user.uid}`}>
                                                <strong>Profile</strong>
                                            </Link>
                                        </div>
                                        <div className="avatar__saved avatar__common">
                                            <TurnedInNot style={{ marginRight: 10 }} />
                                            <span><strong>Saved</strong></span>
                                        </div>
                                        <div className="avatar__saved avatar__common">
                                            <Settings style={{ marginRight: 10 }} />
                                            <Link onClick={this.openOptionsHandler} to="/accounts/settings">
                                                <strong>Settings</strong>
                                            </Link>
                                        </div>
                                        <div className="avatar__logout"
                                            onClick={this.handleLogout}
                                        >
                                            Log out
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        )}
                        {/* header option ends */}
                    </div>
                </div>
            </div>
        );
    }
}

const actions = {
    signoutUser,
    clearNotifications
}

const mapStateToProps = state => ({
    user: state.auth.user,
    notifications: state.auth.notifications,
    profile: state.auth.profile,
    loading: state.auth.loading
});

export default withRouter(connect(mapStateToProps, actions)(Header));
