// src/store.js
import { createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import rootReducer from '../reducers';// Assuming you have a root reducer

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
