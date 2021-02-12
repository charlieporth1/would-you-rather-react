import {createBrowserHistory} from 'history';
import {applyMiddleware, compose, createStore} from 'redux';
import {routerMiddleware} from 'connected-react-router';
import { logger } from "redux-logger";
import createRootReducer from './reducers';

export const history = createBrowserHistory({window: window});

export default function configureStore(preloadedState) {
    let store = createStore(
        createRootReducer(history), // root reducer with router state
        preloadedState,
        compose(
            applyMiddleware(
                routerMiddleware(history), // for dispatching history actions
                (process.env.NODE_ENV === "development" && logger)
            ),
        ),
    );
    return store
}

