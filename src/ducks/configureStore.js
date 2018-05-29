import {Map,Iterable} from 'immutable'
import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import {createLogger} from 'redux-logger'
import { composeWithDevTools } from 'remote-redux-devtools';
import rootReducer from './reducers'


const loggerMiddleware = createLogger({
    stateTransformer: (state) => {
        if (Iterable.isIterable(state)) return state.toJS();
        else return state;
    }
});


const composeEnhancers = composeWithDevTools({});

let Store = createStore(
    rootReducer,
    new Map(),
    compose(
        applyMiddleware(
            //loggerMiddleware, // neat middleware that logs actions
            thunkMiddleware // lets us dispatch() functions,
        ),
        window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : noop => noop,
    )
);

export default Store;

