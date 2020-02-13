import { all, fork } from 'redux-saga/effects';
import roomSaga from './room';

export default function* rootSaga() {
  yield all([
    fork(roomSaga),
  ]);
}
