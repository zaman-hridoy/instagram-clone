import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { reducer as formReducer } from 'redux-form';
import { reducer as toastrReducer } from 'react-redux-toastr';

// reducers
import postsReducers from '../reducers/postsReducer';
import authReducer from '../reducers/authReducer';

const rootReducer = combineReducers({
    posts: postsReducers,
    auth: authReducer,
    form: formReducer,
    toastr: toastrReducer
});

const store = createStore(rootReducer, composeWithDevTools(
    applyMiddleware(thunk)
));

export default store;
