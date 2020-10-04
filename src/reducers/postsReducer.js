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

} from '../actions/constants';

const initialState = {
    posts: [],
    loading: false,
    progress: 0,
    isProgress: false,
    requestedUserPosts: [],
    requestedSavedPosts: [],
    requestedPost: null
}

const postsReducers = (state=initialState, action) => {
    switch(action.type) {
        case START_FETCHING_POSTS: 
            return {
                ...state,
                loading: true
            }
        case FETCH_POSTS: 
            return {
                ...state,
                posts: [...action.payload],
                loading: false,
                progress: 0,
                isProgress: false
            }
        case FINISH_FETCHING_POSTS: 
            return {
                ...state,
                loading: false
            }
        case POST_UPLOAD_PROGRESS:
            return {
                ...state,
                isProgress: action.payload.isProgress,
                progress: action.payload.progress
            }
        case CLEAR_UPLOAD_PROGRESS:
            return {
                ...state,
                progress: 0,
                isProgress: false
            }
        case REQUESTED_USER_POSTS:
            return {
                ...state,
                requestedUserPosts: [...action.payload],
                loading: false
            }
        case REQUESTED_SAVED_POSTS:
            return {
                ...state,
                requestedSavedPosts: [...action.payload],
                loading: false
            }
        case GET_REQUESTED_POST:
            return {
                ...state,
                requestedPost: action.payload,
                loading: false
            }
        case SET_LOADING:
            return {
                ...state,
                loading: true
            }
        case REMOVE_LOADING:
            return {
                ...state,
                loading: false
            }
        default: 
            return state;
    }
}

export default postsReducers;