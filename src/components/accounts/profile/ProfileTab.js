import React from 'react';
import PhotoAlbum from '@material-ui/icons/PhotoAlbum';
import ListAlt from '@material-ui/icons/ListAlt';
import TurnedIn from '@material-ui/icons/TurnedIn';
import LocalOffer from '@material-ui/icons/LocalOffer';
import { Switch, Route, NavLink, Redirect } from 'react-router-dom';
import ProfileTaggedPosts from './ProfileTaggedPosts';
import ProfilePosts from './ProfilePosts';
import ProfileSavedPosts from './ProfileSavedPosts';
import ProfilePhotos from './ProfilePhotos';

const ProfileTab = ({ id, posts, loading, requestedSavedPosts, getUserSavedPosts, isLoggedInUser, profile, selectProfilePhoto }) => {
    return (
        <div className="profile__tab_wrapper">
            <div className="profile_tab_options">
                <NavLink activeClassName="profile__tab_item" to={`/accounts/profile/${id}/profile-photos`}>
                    <PhotoAlbum /> <span>Profile Photos</span>
                </NavLink>
                <NavLink activeClassName="profile__tab_item" to={`/accounts/profile/${id}/posts`}>
                    <ListAlt /> <span>POSTS</span>
                </NavLink>
                {isLoggedInUser && (
                    <NavLink onClick={getUserSavedPosts} activeClassName="profile__tab_item" to={`/accounts/profile/${id}/saved`}>
                        <TurnedIn /> <span>SAVED</span>
                    </NavLink>
                )}
                {/* <NavLink activeClassName="profile__tab_item" to={`/accounts/profile/${id}/tagged`}>
                    <LocalOffer /> <span>TAGGED</span>
                </NavLink> */}
            </div>
                <Redirect from={`/accounts/profile/${id}`} to={`/accounts/profile/${id}/profile-photos`} />
            <Switch>
                <Route path="/accounts/profile/:id/profile-photos" render={() => <ProfilePhotos 
                        profile={profile} loading={loading} 
                        selectProfilePhoto={selectProfilePhoto}
                />} />
                <Route path="/accounts/profile/:id/posts" render={() => <ProfilePosts posts={posts} loading={loading} />} />
                {isLoggedInUser && (
                    <Route path="/accounts/profile/:id/saved" render={() => <ProfileSavedPosts posts={requestedSavedPosts} loading={loading} />} />
                )}
                {/* <Route path="/accounts/profile/:id/tagged" component={ProfileTaggedPosts} /> */}
            </Switch>
        </div>
    );
}

export default ProfileTab;
