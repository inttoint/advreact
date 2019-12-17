import { createStore, applyMiddleware } from "redux";
import createRootReducer from "./reducer";
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';
import createSagaMiddleware from 'redux-saga';
import rootSaga from "../redux/saga";
import history from '../history';

const sagaMiddleware = createSagaMiddleware();
const enhancer = applyMiddleware(sagaMiddleware, routerMiddleware(history), thunk, logger);

const store = createStore(
  createRootReducer(history),
  enhancer);
window.store = store;

sagaMiddleware.run(rootSaga);

export default store;