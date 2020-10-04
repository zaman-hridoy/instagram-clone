import { STARTS_TO_LOADING, 
    AUTH_SUCCESS, 
    AUTH_ACTION_ERROR, 
    GET_LOGGED_IN_USER, 
    GET_NOTIFICATIONS,
    END_LOADING, 
    GET_REQUESTED_USER ,
    START_TO_UPLOAD_PROFILE_PHOTO,
    ENDS_TO_UPLOAD_PROFILE_PHOTO,
    GET_FOLLOWERS,
    GET_FOLLOWING,
    GET_FOLLOWERS_FOR_LOGGED_IN,
    GET_FOLLOWING_FOR_LOGGED_IN,
    LOGGED_IN_LOADING,
    END_LOGGED_LOADING,
    GET_ALL_USERS
} from './constants';
import firebase from '../firebase';
import myfirebase from 'firebase';
import { toastr } from 'react-redux-toastr';
import cuid from 'cuid';
import { objectToArray } from '../utls/utils';

//signup with email and password
export const signupUser = user => {
    return async dispatch => {
        dispatch({ type:  STARTS_TO_LOADING});
        try {
            const userRef = firebase.firestore().collection('users');
            const authUser =  await firebase.auth().createUserWithEmailAndPassword(user.email, user.password);
            if(authUser) {
                if(authUser.displayName) {
                    // do not update displayname
                    console.log(authUser.displayName);
                }else {
                    // update displayname
                    authUser.user.updateProfile({
                        displayName: user.username
                    });
                    await userRef.doc(authUser.user.uid).set({
                        fullname: user.fullname,
                        displayName: user.username,
                        email: user.email
                    });
                }
                getLoggedInUser();
            }else {
                console.log('user not logged in');
            }
            dispatch({ type: AUTH_SUCCESS });
        }catch(err) {
            console.log(err);
            dispatch({ type: AUTH_ACTION_ERROR, payload: err.message })
        }
    }
}

//sign in with email and password
export const signInUser = user => {
    console.log(user)
    return async dispatch => {
        dispatch({ type:  STARTS_TO_LOADING});
        try {
            const authUser =  await firebase.auth().signInWithEmailAndPassword(user.email, user.password);
            if(authUser) {
                console.log(authUser)
                getLoggedInUser();
                dispatch({ type: AUTH_SUCCESS });
            }else {
                console.log('user not logged in');
                dispatch({ type: END_LOADING })
            }
        }catch(err) {
            console.log(err);
            dispatch({ type: AUTH_ACTION_ERROR, payload: err.message })
        }
    }
}

// sign in with facebook
export const signInWithFacebook = () => {
    return async dispatch => {
        try {
            const userRef = firebase.firestore().collection('users');
            const provider = new myfirebase.auth.FacebookAuthProvider();
            const currentUser = await firebase.auth().signInWithPopup(provider);
            await userRef.doc(currentUser.user.uid).set({
                displayName: currentUser.user.displayName,
                email: currentUser.user.email,
                photoURL: currentUser.user.photoURL
            });
        } catch(err) {
            console.log(err);
        }
    }
}

// get notifications
const getUserNotifications = async (userId, dispatch) => {
        try {
            const notificationRef = firebase.firestore()
                                .collection('users')
                                .doc(userId)
                                .collection('notifications');
            await notificationRef.onSnapshot(snapshot => {
                // console.log(snapshot)
                const notifications = [];
                if(!snapshot.empty) {
                    for(let i=0; i< snapshot.docs.length; i++) {
                        const n = {
                            id: snapshot.docs[i].id,
                            ...snapshot.docs[i].data()
                        }
                        notifications.push(n);
                    }
                }
                dispatch({
                    type: GET_NOTIFICATIONS,
                    payload: notifications
                });
            })
        } catch(err) {
            console.log(err);
            toastr.error('Oops!', 'Something went wrong! please try again.');
        }
}

// get followers and following
const getFolloersAndFollowing = async (userId, dispatch) => {
    try {
        const followersRef = firebase.firestore()
                            .collection('users')
                            .doc(userId)
                            .collection('followers');
        const followingRef = firebase.firestore()
                            .collection('users')
                            .doc(userId)
                            .collection('following');
        await followersRef.onSnapshot(snapshot => {
            // console.log(snapshot)
            const followers = [];
            if(!snapshot.empty) {
                for(let i=0; i< snapshot.docs.length; i++) {
                    const n = {
                        id: snapshot.docs[i].id,
                        ...snapshot.docs[i].data()
                    }
                    followers.push(n);
                }
            }
            // console.log({followers})
            dispatch({
                type: GET_FOLLOWERS,
                payload: followers
            });
        });
        await followingRef.onSnapshot(snapshot => {
            // console.log(snapshot)
            const following = [];
            if(!snapshot.empty) {
                for(let i=0; i< snapshot.docs.length; i++) {
                    const n = {
                        id: snapshot.docs[i].id,
                        ...snapshot.docs[i].data()
                    }
                    following.push(n);
                }
            }
            // console.log({following})
            dispatch({
                type: GET_FOLLOWING,
                payload: following
            });
        });
    } catch(err) {
        console.log(err);
        toastr.error('Oops!', 'Something went wrong! please try again.');
    }
}

// get loggedIn user followers and following
const getLoggedInUserFolloersAndFollowing = async (userId, dispatch) => {
    try {
        const followersRef = firebase.firestore()
                            .collection('users')
                            .doc(userId)
                            .collection('followers');
        const followingRef = firebase.firestore()
                            .collection('users')
                            .doc(userId)
                            .collection('following');
        await followersRef.onSnapshot(snapshot => {
            // console.log(snapshot)
            const followers = [];
            if(!snapshot.empty) {
                for(let i=0; i< snapshot.docs.length; i++) {
                    const n = {
                        id: snapshot.docs[i].id,
                        ...snapshot.docs[i].data()
                    }
                    followers.push(n);
                }
            }
            // console.log({followers})
            dispatch({
                type: GET_FOLLOWERS_FOR_LOGGED_IN,
                payload: followers
            });
        });
        await followingRef.onSnapshot(snapshot => {
            // console.log(snapshot)
            const following = [];
            if(!snapshot.empty) {
                for(let i=0; i< snapshot.docs.length; i++) {
                    const n = {
                        id: snapshot.docs[i].id,
                        ...snapshot.docs[i].data()
                    }
                    following.push(n);
                }
            }
            // console.log({following})
            dispatch({
                type: GET_FOLLOWING_FOR_LOGGED_IN,
                payload: following
            });
        });
    } catch(err) {
        console.log(err);
        toastr.error('Oops!', 'Something went wrong! please try again.');
    }
}
// get all users
const getAllUsers = async (userId, dispatch) => {
    try {
        const userRef = firebase.firestore().collection('users');
        await userRef.onSnapshot(snapshot => {
            if(!snapshot.empty) {
                const users = [];
                for(let i=0; i<snapshot.docs.length; i++) {
                    const user = {
                        id: snapshot.docs[i].id,
                        ...snapshot.docs[i].data()
                    }
                    users.push(user);
                }
                const filteredUser = users.filter(user => user.id !== userId);
                dispatch({
                    type: GET_ALL_USERS,
                    payload: filteredUser
                });
            }
        })
    } catch(err) {
        console.log(err);
        toastr.error('Oops!', 'Something went wrong! Please try again.');
    }
}

//get logged in user
export const getLoggedInUser = (history) => {
    return async dispatch => {
        dispatch({ type:  LOGGED_IN_LOADING});
        try {
            const userRef = firebase.firestore().collection('users');
            await firebase.auth().onAuthStateChanged( async user => {
                // console.log(user)
                if(user) {
                    // const userProfile = await userRef.doc(user.uid).get(); // get profile and user
                    await userRef.doc(user.uid).onSnapshot(snapshot => {
                        if(snapshot.exists) {
                            const data = {
                                user,
                                profile: {
                                    id: snapshot.id,
                                    ...snapshot.data()
                                }
                            }
                            dispatch({
                                type: GET_LOGGED_IN_USER,
                                payload: data
                            });
                            history.push('/');
                        }else {
                            dispatch({ type: END_LOGGED_LOADING });
                        }
                    });

                    // get user notifications
                    getUserNotifications(user.uid, dispatch);
                    getLoggedInUserFolloersAndFollowing(user.uid, dispatch);
                    // get all user
                    getAllUsers(user.uid, dispatch);
                    return user;
                }else {
                    console.log('user not logged in');
                    dispatch({ type: END_LOGGED_LOADING })
                }
            });
            
        } catch(err) {
            console.log(err);
            dispatch({ type: AUTH_ACTION_ERROR, payload: err.message })
        }
    }
}


// update user profile
export const updateUserProfile = userData => {
    return async (dispatch, getState) => {
        const userId = getState().auth.user.uid;
        const userRef = firebase.firestore().collection('users');
        const dataToUpdate = {
            fullname: userData.fullname || '',
            displayName: userData.username || '',
            website: userData.website || '',
            bio: userData.bio || '',
            email: userData.email || '',
            phone: userData.phone || '',
            gender: userData.gender || '',
        }
        try {
            const updatedProfile = await userRef.doc(userId).update(dataToUpdate);
            // console.log(updateUserProfile);
            // console.log(userData)
            toastr.success('Success!', 'Profile has been updated');
        } catch (err) {
            console.log(err);
            toastr.error('Oops!', 'Something went wrong! Please try again.');
        }
    }
}

// sign out user
export const signoutUser = (history) => {
    return async (dispatch) => {
        try {
            await firebase.auth().signOut();
            history.push('/accounts/signin');
        } catch(err) {
            console.log(err);
        }
    }
}

// get user profile
export const getRequestedUser = (userId, history) => {
    return async (dispatch) => {
        dispatch({ type:  STARTS_TO_LOADING});
        try {
                await firebase.firestore().collection('users').doc(userId)
                    .onSnapshot(snapshot => {
                        if(snapshot.exists) {
                            // console.log({snapshot});
                            const user = {
                                id: snapshot.id,
                                ...snapshot.data()
                            }
                            getFolloersAndFollowing(snapshot.id, dispatch)
                            dispatch({
                                type: GET_REQUESTED_USER,
                                payload: user
                            })
                        }else {
                            history.goBack();
                            dispatch({ type: END_LOADING })
                        }
                    })
        } catch (err) {
            console.log(err);
            toastr.error('Oops!', 'Something went wrong! Please try again.');
            dispatch({ type: AUTH_ACTION_ERROR, payload: err.message })
        }
    }
}

// upload and update user photoURL
export const updatePhotoURL = (file) => {
    return async (dispatch, getState) => {
        dispatch({ type: START_TO_UPLOAD_PROFILE_PHOTO });
        const userId = getState().auth.user.uid;
        // console.log(userId);
        try {
            const batch = firebase.firestore().batch();
            const metadata = { contentType: file.type };
            const imageName = cuid();
            const storageRef = await firebase.storage().ref(userId).child(`profile_images/${imageName}`);
            const uploadTask = await storageRef.put(file, metadata);
            // console.log(uploadTask)
            const downloadUrl = await uploadTask.ref.getDownloadURL();
            const userRef = firebase.firestore().collection('users').doc(userId);
            const postQuery = firebase.firestore().collection('posts')
                            .where('userId', '==', userId);
            // firebase.firestore().runTransaction(transaction => {
            //     return transaction.get(userRef)
            //     .then((doc) => {
            //         if(doc.exists) {
            //             transaction.update(userRef, {
            //                 photoURL: downloadUrl
            //             })
            //         }
            //     }).catch(err => console.log(err));
            // }).then(() => {
            //     toastr.success('Success!', 'Profile photo updated successfully.')
            // }).catch(err => console.log(err));

            // update profile user photo
            batch.update(userRef, {
                photoURL: downloadUrl
            });

            // add new photo to user's profile
            await userRef.update({
                [`photos.${imageName}`]: {
                    url: downloadUrl,
                    name: imageName
                }
            })


            const postsSnapshot = await postQuery.get();
            // console.log(postsSnapshot)
            // update post user photo
            if(!postsSnapshot.empty) {
                // console.log(postsSnapshot)
                for(let i=0; i<postsSnapshot.docs.length; i++) {
                    const postDocRef = firebase.firestore().collection('posts').doc(postsSnapshot.docs[i].id);
                
                    batch.update(postDocRef, {
                        photoURL: downloadUrl,
                        [`likes.${userId}.photoURL`]: downloadUrl
                    })
                }
            }

            // update user photo on others posts like
            const otherpostsnapshot = await firebase.firestore().collection('posts').get();
            // console.log(otherpostsnapshot)

            if(!otherpostsnapshot.empty) {
                // console.log(otherpostsnapshot)
                const posts = []
                for(let i=0; i<otherpostsnapshot.docs.length; i++) {
                    const post = {
                        id: otherpostsnapshot.docs[i].id,
                        ...otherpostsnapshot.docs[i].data()
                    }
                    posts.push(post);
                }
                if(posts) {
                    posts.forEach(post => {
                        const likesSnap = objectToArray(post.likes).filter(like => like.userId === userId);
                        // console.log(likesSnap)
                        // console.log(likesSnap[0].postId);
                        if(likesSnap.length > 0) {
                            const postDocRef = firebase.firestore().collection('posts').doc(likesSnap[0].postId);
                
                            batch.update(postDocRef, {
                                [`likes.${userId}.photoURL`]: downloadUrl
                            })
                        }
                    });
                }
            }

            await batch.commit()

            toastr.success('Success!', 'Profile photo updated successfully.')

            dispatch({ type: ENDS_TO_UPLOAD_PROFILE_PHOTO })
        } catch(err) {
            console.log(err);
            dispatch({ type: ENDS_TO_UPLOAD_PROFILE_PHOTO })
            toastr.error('Oops!', 'Something went wrong! Please try again.');
        }
    }
}

// update or set existing photo as profile photo
// update user photoURL
export const setProfilePhoto = (url) => {
    return async (dispatch, getState) => {
        dispatch({ type: START_TO_UPLOAD_PROFILE_PHOTO });
        const userId = getState().auth.user.uid;
        // console.log(userId);
        try {
            const batch = firebase.firestore().batch();
            const userRef = firebase.firestore().collection('users').doc(userId);
            const postQuery = firebase.firestore().collection('posts')
                            .where('userId', '==', userId);

            // update profile user photo
            batch.update(userRef, {
                photoURL: url
            });


            const postsSnapshot = await postQuery.get();
            // update post user photo
            if(!postsSnapshot.empty) {
                for(let i=0; i<postsSnapshot.docs.length; i++) {
                    const postDocRef = firebase.firestore().collection('posts').doc(postsSnapshot.docs[i].id);
                
                    batch.update(postDocRef, {
                        photoURL: url,
                        [`likes.${userId}.photoURL`]: url
                    })
                }
            }

            // update user photo on others posts like
            const otherpostsnapshot = await firebase.firestore().collection('posts').get();
            // console.log(otherpostsnapshot)

            if(!otherpostsnapshot.empty) {
                const posts = []
                for(let i=0; i<otherpostsnapshot.docs.length; i++) {
                    const post = {
                        id: otherpostsnapshot.docs[i].id,
                        ...otherpostsnapshot.docs[i].data()
                    }
                    posts.push(post);
                }
                if(posts) {
                    posts.forEach(post => {
                        const likesSnap = objectToArray(post.likes).filter(like => like.userId === userId);
                    
                        // console.log(likesSnap[0].postId);
                        if(likesSnap.length > 0) {
                            const postDocRef = firebase.firestore().collection('posts').doc(likesSnap[0].postId);
                
                            batch.update(postDocRef, {
                                [`likes.${userId}.photoURL`]: url
                            })
                        }
                    });
                }
            }

            await batch.commit()

            toastr.success('Success!', 'Profile photo updated successfully.')

            dispatch({ type: ENDS_TO_UPLOAD_PROFILE_PHOTO })
        } catch(err) {
            console.log(err);
            dispatch({ type: ENDS_TO_UPLOAD_PROFILE_PHOTO })
            toastr.error('Oops!', 'Something went wrong! Please try again.');
        }
    }
}

// delete profile photo
export const deleteProfilePhoto = photoname => {
    return async (dispatch, getState) => {
        const userId = getState().auth.user.uid;
        const userRef = firebase.firestore().collection('users').doc(userId);
        const storageRef = firebase.storage().ref(userId).child(`profile_images/${photoname}`);
        try {
            await storageRef.delete();
            await userRef.update({
                [`photos.${photoname}`]: myfirebase.firestore.FieldValue.delete()
            })
            toastr.success('Success!', 'Profile photo successfully deleted');
        }catch (err) {
            console.log(err);
            toastr.error('Oops!', 'Something went wrong! Please try again.');
        }
    }
}

// clear notifications
export const clearNotifications = () => {
    return async (dispatch, getState) => {
        const userId = getState().auth.user.uid;
        try {
            const nRefs = firebase.firestore()
                            .collection('users')
                            .doc(userId)
                            .collection('notifications');
            const allDocs = await nRefs.get();
            if(!allDocs.empty) {
                for(let i=0; i<allDocs.docs.length; i++) {
                    const eachNrefs = firebase.firestore()
                            .collection('users')
                            .doc(userId)
                            .collection('notifications')
                            .doc(allDocs.docs[i].id)
                    await eachNrefs.delete();
                }   
                // toastr.success('Success!', 'Notifications has been cleared');
            }
        } catch(err) {
            console.log(err);
            toastr.error('Oops!', 'Something went wrong! Please try again.');
        }
    }
}

// follow
export const startFollowing = followerId => {
    return async (dispatch, getState) => {
        const userId = getState().auth.user.uid;
        const displayName = getState().auth.user.displayName || '';
        const photoURL = getState().auth.profile.photoURL || '';
        try {
            const followerRef = firebase.firestore().collection('users').doc(followerId).collection('followers');
            const followerNotificationsRef = firebase.firestore().collection('users').doc(followerId).collection('notifications');
            const userRef = firebase.firestore().collection('users').doc(userId).collection('following');

            // data going to be stored on follower collection ex. john
            await followerRef.doc(`${followerId}_${userId}`).set({
                ownId: followerId, // john
                followerId: userId, // my id
                displayName,
                photoURL,
                following: true
            });

            // send notification
            await followerNotificationsRef.doc(`${followerId}_${userId}`).set({
                followerId: userId,
                displayName,
                photoURL,
                type: 'follow',
                date: new Date(Date.now())
            });

            // data going to stored user collection as following
            const followerDocs = await firebase.firestore().collection('users').doc(followerId).get();
            if(followerDocs.exists) {
                await userRef.doc(`${followerId}_${userId}`).set({
                    followingId: followerId,
                    displayName: followerDocs.data().displayName,
                    photoURL : followerDocs.data().photoURL,
                    type: 'follow',
                    date: new Date(Date.now())
                });
            }

        } catch(err) {
            console.log(err);
            toastr.error('Oops!', 'Something went wrong! Please try again.');
        }
    }
}

// unfollow
export const unFollowing = followerId => {
    return async (dispatch, getState) => {
        const userId = getState().auth.user.uid;
        const displayName = getState().auth.user.displayName;
        const photoURL = getState().auth.profile.photoURL;
        try {
            const followerRef = firebase.firestore().collection('users').doc(followerId).collection('followers');
            const followerNotificationsRef = firebase.firestore().collection('users').doc(followerId).collection('notifications');
            const userRef = firebase.firestore().collection('users').doc(userId).collection('following');

            // data going to be stored on follower collection ex. john
            await followerRef.doc(`${followerId}_${userId}`).delete();

            // send notification
            await followerNotificationsRef.doc(`${followerId}_${userId}`).delete();

            // data going to stored user collection as following
            const followerDocs = await firebase.firestore().collection('users').doc(followerId).get();
            if(followerDocs.exists) {
                await userRef.doc(`${followerId}_${userId}`).delete();
            }

        } catch(err) {
            console.log(err);
            toastr.error('Oops!', 'Something went wrong! Please try again.');
        }
    }
}
