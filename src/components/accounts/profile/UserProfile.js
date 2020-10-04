import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Create from '@material-ui/icons/Create';
import Avatar from '@material-ui/core/Avatar';
import Dropzone from 'react-dropzone';
import './Profile.css';
import { connect } from 'react-redux';
import { getRequestedUser, updatePhotoURL, setProfilePhoto, deleteProfilePhoto, startFollowing, unFollowing } from '../../../actions/authActions';
import { getRequestedUserPosts, getUserSavedPosts } from '../../../actions/postsActions';
import ProfileTab from './ProfileTab';
import AppLoader from '../../common/loader/Loader';
import Modal from './Modal';

class UserProfile extends Component {
    state = {
        openModal: false,
        selectedPhoto: null
    }

    openModal = () => this.setState({ openModal: true });
    closeModal = () => this.setState({ openModal: false });

    async componentDidMount() {
        const { user, history, match } = this.props;
        // if(user?.uid === match.params.id) {
        //     history.push('/accounts/profile');
        // }else {
        //     this.props.getRequestedUser(match.params.id, history);
        // }

        await this.props.getRequestedUser(match.params.id, history);
        await this.props.getRequestedUserPosts(match.params.id);
    }

    componentDidUpdate(prevProps) {
        if(this.props.match.params.id !== prevProps.match.params.id) {
            this.props.getRequestedUser(this.props.match.params.id, this.props.history);
            this.props.getRequestedUserPosts(this.props.match.params.id);
        }
    }
    // shouldComponentUpdate(nextProps) {
    //     console.log(this.props, {nextProps})
    //     return true;
    // }
    handleUploadFiles = async files => {
        if(files) {
            await this.props.updatePhotoURL(files[0]);
        }
    }

    selectProfilePhoto = photo => {
        this.setState({ selectedPhoto: photo });
        this.openModal()
    }

    render() {
        const { user, profile, authLoading, match, requestedUserPosts, postLoading, requestedSavedPosts, getUserSavedPosts, photoUPloading } = this.props;
        // console.log({photoUPloading})
        const isLoggedInUser = user?.uid === profile?.id;
        const isFollowing = this.props.followers.some(data => data.followerId === user?.uid);
        if(authLoading) return <AppLoader />
        return (
            <div className="app__container">
                <Modal 
                    open={this.state.openModal}
                    setOpen={this.openModal}
                    setClose={this.closeModal}
                    selectedPhoto={this.state.selectedPhoto}
                    setProfilePhoto={this.props.setProfilePhoto}
                    deleteProfilePhoto={this.props.deleteProfilePhoto}
                    isLoggedInUser={isLoggedInUser}
                />
                <div className="app__row">
                    <div className="app_col_3">
                        <div className="profile_image">
                            <div className="profile_image_container">
                                {/* <img 
                                    className="profile_photourl" 
                                    src={profile && (profile.photoURL || "/assets/images/avatar.png")} 
                                    alt={profile && profile.fullname || 'guest'}
                                /> */}
                                <Avatar 
                                    style={{ width: 120, height: 120, cursor: 'pointer' }} 
                                    className="profile_photourl"
                                    alt={profile?.fullname || 'Unknown'} 
                                    src={profile && (profile.photoURL || "/assets/images/avatar.png")}
                                    onClick={this.openOptionsHandler}
                                />
                                
                                <Dropzone 
                                    onDrop={acceptedFiles => this.handleUploadFiles(acceptedFiles)}
                                    multiple={false}
                                >
                                    {({getRootProps, getInputProps}) => (
                                        <section>
                                        <div {...getRootProps()}>
                                            <input {...getInputProps()} />
                                            <Create style={{ color: '#333', cursor: 'pointer' }} />
                                        </div>
                                        </section>
                                    )}
                                </Dropzone>
                                
                            </div>
                        </div>
                    </div>
                    <div className="app_col_7">
                        <div className="profile_user_info">
                            <div className="profile_user_name">
                                <h2>{profile && (profile.displayName || 'Guest')}</h2>
                                {isLoggedInUser ? 
                                (<Link to="/accounts/settings">
                                    Edit profile
                                </Link>) : (
                                    !isFollowing ? (
                                        <button className="follow__buton" onClick={() => this.props.startFollowing(profile?.id)}>Follow</button>
                                    ): (
                                        <button className="unfollow__buton" onClick={() => this.props.unFollowing(profile?.id)}>Unfollow</button>
                                    )
                                )
                                }
                            </div>
                            <div className="post_follower_counts">
                                <div className="posts_count">
                                    <strong>{requestedUserPosts.length || 0}</strong>
                                    {' '}
                                    <span>posts</span>
                                </div>
                                <div className="followers_count">
                                    <strong>{this.props.followers?.length || 0}</strong>
                                    {' '}
                                    <span>Followers</span>
                                </div>
                                <div className="following_count">
                                    <strong>{this.props.following?.length || 0}</strong>
                                    {' '}
                                    <span>Following</span>
                                </div>
                            </div>
                            <h2 className="profile_fullname">{profile && (profile.fullname || 'Guest')}</h2>
                        </div>
                    </div>
                </div>
                <ProfileTab 
                    id={match.params.id} 
                    posts={requestedUserPosts}
                    loading={postLoading}
                    requestedSavedPosts={requestedSavedPosts}
                    getUserSavedPosts={getUserSavedPosts}
                    isLoggedInUser={isLoggedInUser}
                    profile={profile}
                    selectProfilePhoto={this.selectProfilePhoto}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        profile:state.auth.userProfile,
        user: state.auth.user,
        authLoading: state.auth.loading,
        requestedUserPosts: state.posts.requestedUserPosts,
        requestedSavedPosts: state.posts.requestedSavedPosts,
        postLoading: state.posts.loading,
        photoUPloading: state.auth.uploading,
        followers: state.auth.followers,
        following: state.auth.following
    }
};

const actions = {
    getRequestedUser,
    getRequestedUserPosts,
    getUserSavedPosts,
    updatePhotoURL,
    setProfilePhoto,
    deleteProfilePhoto,
    startFollowing,
    unFollowing
}

export default connect(mapStateToProps, actions)(UserProfile);
