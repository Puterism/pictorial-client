import { takeLatest, all, call, put } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import {
  FETCH_ROOM_CODE, FETCH_ROOM_CODE_SUCCESS, FETCH_ROOM_CODE_FAILURE,
} from '../modules/room';
import { push } from 'connected-react-router';
import { createRoom } from '../apis';
import io from 'socket.io-client';

function connect() {
  const socket = io('http://localhost:3001');
  return new Promise(resolve => {
    socket.on('connect', () => {
      resolve(socket);
    });
  });
}

function subscribe(socket) {
  return eventChannel(emit => {
    socket.on('join', ({ name }) => {
      emit('join')
    })
  })
}
function* fetchRoomIDSaga(action) {
  const { payload } = action;
  if (!payload) return;

  try {
    const response = yield call(createRoom, payload);
    yield put({ type: FETCH_ROOM_CODE_SUCCESS, payload: { ...response, ...payload }});
    yield put(push(`/room/${response.data.id}`, { id: response.data.id }));
  } catch (error) {
    yield put({ type: FETCH_ROOM_CODE_FAILURE, payload: error });
  }
}

export default function* roomSaga() {
  yield all([
    takeLatest(FETCH_ROOM_CODE, fetchRoomIDSaga),
  ])
}
