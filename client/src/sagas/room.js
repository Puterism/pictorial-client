import { takeLatest, all, call, put } from 'redux-saga/effects';
import {
  FETCH_ROOM_ID, FETCH_ROOM_ID_SUCCESS, FETCH_ROOM_ID_FAILURE,
} from '../modules/room';
import { push } from 'connected-react-router';
import { createRoom } from '../apis';

function* fetchRoomIDSaga(action) {
  const { payload } = action;
  if (!payload) return;

  try {
    const response = yield call(createRoom, payload);
    yield put({ type: FETCH_ROOM_ID_SUCCESS, payload: { ...response, ...payload }});
    yield put(push(`/room/${response.data.id}`, { id: response.data.id }));
  } catch (error) {
    yield put({ type: FETCH_ROOM_ID_FAILURE, payload: error });
  }
}

export default function* roomSaga() {
  yield all([
    takeLatest(FETCH_ROOM_ID, fetchRoomIDSaga),
  ])
}
