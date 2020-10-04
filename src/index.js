import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
// import "slick-carousel/slick/slick.css"; 
// import "slick-carousel/slick/slick-theme.css";
import 'semantic-ui-css/semantic.min.css';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';
import './index.css';
import App from './App';
import ReduxToastr from 'react-redux-toastr'
import * as serviceWorker from './serviceWorker';

import store from './store/configureStore';

ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <ReduxToastr 
            position="top-right"
            transitionIn="fadeIn"
            transitionOut="fadeOut"
        />
        <App />
      </BrowserRouter>
    </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
