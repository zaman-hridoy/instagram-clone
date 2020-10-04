import { 
    START_FETCHING_POSTS, 
    FETCH_POSTS, 
    FINISH_FETCHING_POSTS, 
    POST_UPLOAD_PROGRESS,
    CLEAR_UPLOAD_PROGRESS,
    SET_LOADING,
    REMOVE_LOADING,
    REQUESTED_USER_POSTS,
    REQUESTED_SAVED_POSTS,
    GET_REQUESTED_POST
} from './constants';
import firebase from '../firebase';
import cuid from 'cuid';
import { toastr } from 'react-redux-toastr';
import { firestore } from 'firebase';
import { objectToArray } from '../utls/utils';

// fetch posts
export const fetchPosts = () => {
    return async (dispatch) => {
        dispatch({ type: START_FETCHING_POSTS });
        try {
            const postsRef = firebase.firestore().collection('posts');
            await postsRef.onSnapshot(snapshot => {
                const posts = [];
                for(let i=0; i<snapshot.docs.length; i++) {
                    const post = {
                        id: snapshot.docs[i].id,
                        ...snapshot.docs[i].data()
                    }
                    posts.push(post);
                }
                // console.log(posts)
                dispatch({
                    type: FETCH_POSTS,
                    payload: posts
                });
            })
            
            dispatch({ type: FINISH_FETCHING_POSTS });
        } catch(err) {
            console.log(err);
            dispatch({ type: REMOVE_LOADING });
        }
    }
}

export const createPost = (post) => {
    return async (dispatch, getState) => {

        dispatch({ type: SET_LOADING });

        const postRef = firebase.firestore().collection('posts');
        const userId = getState().auth.user.uid;
        const displayName = getState().auth.profile.displayName;
        const photoURL = getState().auth.profile.photoURL || '';
        const array = Array.from({ length: post.files.length }, (value, index) => index);

        try {
                const uploadedImages = await Promise.all(array.map(async index => {
                const image = post.files[index];
                const imageName = cuid(); // set unique image name
                const metadata = { contentType: image.type };

                const storageRef = firebase.storage().ref(`${userId}/user_post_images/${imageName}`);
                const uploadTask = storageRef.put(image, metadata);
                const url = await new Promise((resolve, reject) => {
                    uploadTask.on('state_changed', snapshot => {
                        const percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        // console.log(percentage);
                        dispatch({
                            type: POST_UPLOAD_PROGRESS,
                            payload: {
                                progress: percentage,
                                isProgress: true
                            }
                        });
                    }, error => reject(error),
                    async () => {
                        const downloadUrl = await uploadTask.snapshot.ref.getDownloadURL();
                        resolve(downloadUrl);
                    });
                });
                return { name: imageName, url };
            }));
            // console.log(uploadedImages)
            const newPost = {
                userId,
                displayName,
                photoURL, 
                description: post.description,
                images: uploadedImages,
                createAt: new Date(Date.now())
            }
            await postRef.add(newPost);
            toastr.success('Success!', 'Post has been created');
            dispatch({ type: REMOVE_LOADING });
            setTimeout(() => {
                dispatch({ type: CLEAR_UPLOAD_PROGRESS })
            }, 1000);
        }catch(err) {
            console.log(err);
            toastr.error('Oops!', 'Something went wrong! please try again.');
        }
    }
}

// added likes in to a post
export const addPostLikes = (postId) => {
    return async (dispatch, getState) => {
        const userId = getState().auth.user.uid;
        const displayName = getState().auth.profile.displayName;
        const photoURL = getState().auth.profile.photoURL || '';
        const fullname = getState().auth.profile.fullname || '';

        // const likesRef = firebase.firestore().collection('likes');
        const postRef = firebase.firestore().collection('posts');
        const userRef = firebase.firestore().collection('users');

        try {
            const like = {
                postId,
                userId,
                displayName,
                photoURL,
                fullname,
                date: new Date(Date.now())
             }
            await postRef.doc(postId).update({
                [`likes.${userId}`] : like
            });

            // add notifications 
            const postSnapshot = await postRef.doc(postId).get();
            // console.log(postSnapshot);
            if(postSnapshot.exists) {
                const postOwnerId = await postSnapshot.get('userId');
                if(postOwnerId !== userId) {
                    await userRef.doc(postOwnerId)
                             .collection('notifications')
                             .doc(`${postId}_${userId}`)
                             .set({
                                userId,
                                postId,
                                displayName,
                                photoURL,
                                type: 'like',
                                date: new Date(Date.now())
                            });
                }
            }

        } catch(err) {
            console.log(err);
            toastr.error('Oops!', 'Something went wrong! please try again.');
        }
    }
}

// remove likes in to a post
export const removePostLikes = (postId) => {
    return async (dispatch, getState) => {
        const userId = getState().auth.user.uid;
        // const likesRef = firebase.firestore().collection('likes');
        const postRef = firebase.firestore().collection('posts');
        const userRef = firebase.firestore().collection('users');
        try {
            
            await postRef.doc(postId).update({
                [`likes.${userId}`] : firestore.FieldValue.delete()
            });
            // remove notification
            const postSnapshot = await postRef.doc(postId).get();
            if(postSnapshot.exists) {
                const postOwnerId = await postSnapshot.get('userId');
                const nSnapshot = await userRef.doc(postOwnerId)
                                .collection('notifications')
                                .doc(`${postId}_${userId}`)
                                .delete()
                console.log(nSnapshot)
            }
        } catch(err) {
            console.log(err);
            toastr.error('Oops!', 'Something went wrong! please try again.');
        }
    }
}

// comment on a post
export const commentOnPost = (comment, postId, post) => {
    return async (dispatch, getState) => {
        const userId = getState().auth.user.uid;
        const displayName = getState().auth.profile.displayName;
        const photoURL = getState().auth.profile.photoURL || '';
        const userRef = firebase.firestore().collection('users');
        const postRef = firebase.firestore().collection('posts');
        const makeCommentId = cuid();
        try {
            const comments = await postRef.doc(postId)
                        .update({
                            comments: firestore.FieldValue.arrayUnion({
                                userId,
                                postId,
                                comment,
                                displayName,
                                photoURL,
                                commentId: makeCommentId,
                                date: new Date(Date.now())
                            })
                        });
            // add comment notification
            // console.log(post.userId, userId)
            if(post.userId !== userId) {
                const postSnapshot = await postRef.doc(postId).get();
                if(postSnapshot.exists) {
                    const postOwnerId = await postSnapshot.get('userId');
                    // console.log(postOwnerId)
                    if(postOwnerId !== userId) {
                        await userRef.doc(postOwnerId).collection('notifications').add({
                            userId,
                            postId,
                            comment,
                            displayName,
                            photoURL,
                            type: 'comment',
                            commentId: makeCommentId,
                            date: new Date(Date.now())
                        });
                    }
                }
            }
        } catch(err) {
            console.log(err);
            toastr.error('Oops!', 'Something went wrong! please try again.');
        }
    }
}

// get requested user posts
export const getRequestedUserPosts = userId => {
    return async (dispatch) => {
        dispatch({ type: SET_LOADING });
        const postsRef = firebase.firestore().collection('posts');

        try {
            const postQuery = postsRef.where('userId', '==', userId);
            await postQuery.onSnapshot(snapshot => {
                // console.log(snapshot);
                if(!snapshot.empty) {
                    const posts = [];
                    for(let i=0; i<snapshot.docs.length; i++) {
                        const post = {
                            id: snapshot.docs[i].id,
                            ...snapshot.docs[i].data()
                        }
                        posts.push(post);
                    }
                    // console.log(posts)
                    dispatch({
                        type: REQUESTED_USER_POSTS,
                        payload: posts
                    });
                }else {
                    dispatch({ type: REMOVE_LOADING });
                }
            });
            
        } catch (err) {
            console.log(err);
            dispatch({ type: REMOVE_LOADING });
        }
    } 
}

// save posts
export const saveUserPost = postId => {
    return async (dispatch, getState) => {
        const userId = getState().auth.user.uid;
        const postRef = firebase.firestore().collection('posts');
        console.log(postId, userId)
        try {
            await postRef.doc(postId).update({
                [`saved.${userId}`] : {
                    saved: true,
                    userId
                }
            });
            toastr.success('Success!', 'Post has been saved');
        } catch(err) {
            console.log(err);
            toastr.error('Oops!', 'Something went wrong! please try again.');
        }
    }
}

// remove saved posts
export const removeSavedPost = postId => {
    return async (dispatch, getState) => {
        const userId = getState().auth.user.uid;
        const postRef = firebase.firestore().collection('posts');
        console.log(postId, userId)
        try {
            await postRef.doc(postId).update({
                [`saved.${userId}`] : firestore.FieldValue.delete()
            });
            toastr.success('Success!', 'Post removed successfully');
        } catch(err) {
            console.log(err);
            toastr.error('Oops!', 'Something went wrong! please try again.');
        }
    }
}

// get user saved posts
export const getUserSavedPosts = () => {
    return async (dispatch, getState) => {
        dispatch({ type: SET_LOADING });
        const userId = getState().auth.user.uid;
        const postsRef = firebase.firestore().collection('posts');

        try {
            // const postQuery = postsRef.where(`saved.${userId}`, '==', userId);
            // await postsRef.onSnapshot(snapshot => {
            //     console.log(snapshot);
            //     if(!snapshot.empty) {
            //         const posts = [];
            //         for(let i=0; i<snapshot.docs.length; i++) {
            //             const post = {
            //                 id: snapshot.docs[i].id,
            //                 ...snapshot.docs[i].data()
            //             }
            //             posts.push(post);
            //         }
            //         const savedPostsUserId = objectToArray(posts.saved);
            //         console.log(savedPostsUserId)
            //         // dispatch({
            //         //     type: REQUESTED_SAVED_POSTS,
            //         //     payload: posts
            //         // });
            //     }
            //     dispatch({ type: REMOVE_LOADING });
            // });

            const postsSnapshot = await postsRef.get();
                if(!postsSnapshot.empty) {
                    const posts = postsSnapshot.docs.filter(post => {
                        // const savedUsers = objectToArray(post.data().saved);
                        if(post.data().saved) {
                            return post.data().saved[userId]
                        }
                    }).map(post => ({
                        id: post.id,
                        ...post.data()
                    }))
                    // console.log(posts)
                    dispatch({
                        type: REQUESTED_SAVED_POSTS,
                        payload: posts
                    });
                }else {
                    dispatch({ type: REMOVE_LOADING });
                }
        } catch (err) {
            console.log(err);
            toastr.error('Oops!', 'Something went wrong! please try again.');
            dispatch({ type: REMOVE_LOADING });
        }
    } 
}

// get requested post
export const getRequestedPost = (postId, history) => {
    return async (dispatch) => {
        const postRef = firebase.firestore().collection('posts');

        try {
            await postRef.doc(postId).onSnapshot(snapshot => {
                if(snapshot.exists) {
                    const post = {
                        id: snapshot.id,
                        ...snapshot.data()
                    }
                    dispatch({
                        type: GET_REQUESTED_POST,
                        payload: post
                    })
                }else {
                    history.goBack();
                }
            });
            dispatch({ type: REMOVE_LOADING });
        } catch (err) {
            console.log(err);
            toastr.error('Oops!', 'Something went wrong! please try again.');
            dispatch({ type: REMOVE_LOADING });
        }
    }
}

// delete post
export const deletePost = postId => {
    return async (dispatch, getState) => {
        const userId = getState().auth.user.uid;
        const postRef = firebase.firestore().collection('posts').doc(postId);

        try {
            const postSnapshot = await postRef.get();
           if(postSnapshot.exists) {
               console.log(postSnapshot.data())
               if(postSnapshot.data().images.length > 0) {
                   // delete all image from storage
                   postSnapshot.data().images.forEach(image => {
                    const imageRef = firebase.storage().ref(userId)
                            .child(`user_post_images/${image.name}`);

                        imageRef.delete().then(() => {
                            console.log('success');
                        }).catch(err => {
                            console.log(err);
                            toastr.error('Oops!', 'Something went wrong! please try again.');
                        })
                   })
               }
            //    const storageRef = firebase.storage().ref(`${userId}/user_post_images/${imageName}`);
               // delete post itself
               await postRef.delete();
               toastr.success('Success!', 'Post has been deleted successfully');
           }
        } catch(err) {
            console.log(err);
            toastr.error('Oops!', 'Something went wrong! please try again.');
        }
    }
}

