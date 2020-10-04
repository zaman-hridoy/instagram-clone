import { STARTS_TO_LOADING, 
    AUTH_SUCCESS, 
    AUTH_ACTION_ERROR,
    GET_LOGGED_IN_USER,
    LOGGED_IN_LOADING,
    END_LOGGED_LOADING,
    END_LOADING, 
    GET_REQUESTED_USER,
    GET_NOTIFICATIONS,
    START_TO_UPLOAD_PROFILE_PHOTO,
    ENDS_TO_UPLOAD_PROFILE_PHOTO,
    GET_FOLLOWERS,
    GET_FOLLOWING,
    GET_FOLLOWERS_FOR_LOGGED_IN,
    GET_FOLLOWING_FOR_LOGGED_IN,
    GET_ALL_USERS
} from '../actions/constants';

const initialState = {
    user: null,
    profile: null,
    notifications: [],
    followers: [],
    following: [],
    loggedInFollowers: [],
    loggedInFollowing: [],
    error: null,
    loading: false,
    userProfile: null,
    uploading: false,
    authLoading: false,
    allUsers: []
}

const authReducer = (state=initialState, action) => {
    switch(action.type) {
        case STARTS_TO_LOADING:
            return {
                ...state,
                loading: true,
                error: null
            }
        case AUTH_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null
            }
        case AUTH_ACTION_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case LOGGED_IN_LOADING:
            return {
                ...state,
                authLoading: true
            }
        case GET_LOGGED_IN_USER:
            return {
                ...state,
                loading: false,
                authLoading: false,
                user: action.payload.user,
                profile: action.payload.profile,
                error: null
            }
        case END_LOGGED_LOADING:
            return {
                ...state,
                authLoading: false
            }
        case GET_REQUESTED_USER:
            return {
                ...state,
                loading: false,
                userProfile: action.payload
            }
        case GET_NOTIFICATIONS:
            return {
                ...state,
                notifications: action.payload
            }
        case GET_FOLLOWERS:
            return {
                ...state,
                followers: action.payload
            }
        case GET_FOLLOWING:
            return {
                ...state,
                following: action.payload
            }
    
        case GET_FOLLOWERS_FOR_LOGGED_IN:
            return {
                ...state,
                loggedInFollowers: action.payload
            }
        case GET_FOLLOWING_FOR_LOGGED_IN:
            return {
                ...state,
                loggedInFollowing: action.payload
            }
        case END_LOADING:
            return {
                ...state,
                loading: false
            }

        case START_TO_UPLOAD_PROFILE_PHOTO: 
            return {
                ...state,
                uploading: true
            }
        case ENDS_TO_UPLOAD_PROFILE_PHOTO: 
            return {
                ...state,
                uploading: false
            }
        case GET_ALL_USERS:
            return {
                ...state,
                allUsers: action.payload
            }
        default:
            return state;

    }
}

export default authReducer;