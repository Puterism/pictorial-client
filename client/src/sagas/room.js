import { takeLatest, all, call, put } from 'redux-saga/effects';
// import { eventChannel } from 'redux-saga';
import {
  FETCH_ROOM_CODE, FETCH_ROOM_CODE_SUCCESS, FETCH_ROOM_CODE_FAILURE, 
  CONNECT_ROOM, CONNECT_ROOM_SUCCESS, CONNECT_ROOM_FAILURE,
} from '../modules/room';
import { push } from 'connected-react-router';
import { createRoom } from '../apis';
// import io from 'socket.io-client';

// function connect() {
//   const socket = io('/room');
//   return new Promise(resolve => {
//     socket.on('connect', () => {
//       resolve(socket);
//     });
//   });
// }

// function subscribe(socket) {
//   return eventChannel(emit => {
//     socket.on('message', ({ text }) => {
//       console.log(text);
//     });

//     return function unsubscribe() {
//       socket.off();
//     }
//   })
// }

// function* read(socket) {
//   const channel = yield call(subscribe, socket);
//   while (true) {
//     const action = yield take(channel);
//     yield put(action);
//   }
// }

// function* write(socket) {
//   while (true) {
//     const { payload } = yield take(`${sendMessage}`);
//     socket.emit('message', payload);
//   }
// }

// function* handleIO(socket) {
//   yield fork(read, socket);
//   // yield fork(write, socket);
// }

function* fetchRoomIDSaga(action) {
  const { payload } = action;
  if (!payload) return;

  try {
    const response = yield call(createRoom, payload);
    yield put({ type: FETCH_ROOM_CODE_SUCCESS, payload: { ...response, ...payload }});
    yield put(push(`/room/${response.data.roomCode}`, { code: response.data.roomCode }));
    // yield take(CONNECT_ROOM, connectRoomSaga);
  } catch (error) {
    yield put({ type: FETCH_ROOM_CODE_FAILURE, payload: error });
  }
}

function* connectRoomSaga(action) {
  const { payload } = action;
  if (!payload) return;

  try {
    // const socket = yield call(connect);
    // const task = yield fork(handleIO, socket);
    // socket.emit('join', payload.name, payload.code);

    yield put({ type: CONNECT_ROOM_SUCCESS, payload: { ...payload }});
    yield put(push(`/room/${payload.code}`, { name: payload.name, code: payload.code }));
  } catch (error) {
    yield put({ type: CONNECT_ROOM_FAILURE, payload: {  ...error }});
  }
}

// function* flow() {
//   while (true) {
//     try {
//       let { payload } = yield take(CONNECT_ROOM);
//       const socket = yield call(connect);
//       socket.emit('join', payload.name, payload.code);
//       const task = yield fork(handleIO, socket);
//       yield put({ type: CONNECT_ROOM_SUCCESS, payload: { ...payload }});
//     } catch (error) {
//       yield put({ type: CONNECT_ROOM_FAILURE, payload: {  ...error }});
//     }
//   }
// }

export default function* roomSaga() {
  yield all([
    takeLatest(FETCH_ROOM_CODE, fetchRoomIDSaga),
    takeLatest(CONNECT_ROOM, connectRoomSaga),
    // fork(flow),
  ])
}
