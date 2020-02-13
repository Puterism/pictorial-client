import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import room from './room';

const rootReducer = (history) => combineReducers({
  router: connectRouter(history),
  room,
});

export default rootReducer;