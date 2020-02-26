import { takeLatest, take, fork, call, put, apply, select } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import {
  FETCH_ROOM_CODE, CONNECT_ROOM, CHECK_ROOM_CODE, IMAGE_READY, 
  SET_ROUND, SET_TIME_LIMIT,
  fetchRoomCodeSuccess, fetchRoomCodeFailure,
  connectRoomSuccess, connectRoomFailure,
  checkRoomCodeSuccess, checkRoomCodeFailure,
  imageReadySuccess, imageReadyFailure,
  setMemberList, setRoomData,
} from '../modules/room';
import { push } from 'connected-react-router';
import { createRoom, checkRoomCode, connectRoom, imageReady } from '../apis';
import socketConnection from '../libs/socketConnection';

function subscribe(socket, eventType) {
  return eventChannel(emit => {
    // const emitter = message => emit(message);

    // socket.on(eventType, emitter);
    // return function unsubscribe() {
    //   socket.off(eventType, emitter);
    // }

    socket.on('message', ({ text }) => {
      console.log(text);
    });

    socket.on('userData', ({ userList }) => {
      console.log(userList);
      emit(setMemberList(userList));
    });

    socket.on('roomData', ({ roomData }) => {
      console.log(roomData);
      
      emit(setRoomData({ round: roomData.round, timeLimit: roomData.time }));
    });

    socket.on('readyUserData', ({ userList }) => {
      console.log(userList);

      emit(setMemberList(userList));
    })

    return function unsubscribe() {
      socket.off('message');
      socket.off('userData');
      socket.off('roomData');
      socket.off('readyUserData');
    }
  });
}


function* read(socket, type) {
  const channel = yield call(subscribe, socket, type);
  while (true) {
    let action = yield take(channel);
    yield put(action);
  }
}

function* setRoundSaga(socket) {
  while (true) {
    const { payload } = yield take(SET_ROUND);
    const code = yield select(state => state.room.code);
    const time = yield select(state => state.room.timeLimit);
  
    yield apply(socket, socket.emit, ['setRoom', code, payload, time]);
  }
}

function* setTimeLimitSaga(socket) {
  while (true) {
    const { payload } = yield take(SET_TIME_LIMIT);
    const code = yield select(state => state.room.code);
    const round = yield select(state => state.room.round);

    yield apply(socket, socket.emit, ['setRoom', code, round, payload]);
  }
}

function* handleSocket(socket) {
  yield fork(read, socket);

  yield fork(setRoundSaga, socket);
  yield fork(setTimeLimitSaga, socket);
}

function* fetchRoomCodeSaga() {
  // const { payload } = action;
  // if (!payload) return;

  while (true) {
    try {
      const actions = yield take(FETCH_ROOM_CODE);
      const payload = actions.payload;

      const response = yield call(createRoom, payload);
      const socket = yield call(socketConnection);

      yield fork(handleSocket, socket);
      yield apply(socket, socket.emit, ['join', payload.name, response.data.roomCode]);
      
      yield put(fetchRoomCodeSuccess({ ...response, ...payload }));
      yield put(push(`/room/${response.data.roomCode}`, { code: response.data.roomCode }));
    } catch (error) {
      yield put(fetchRoomCodeFailure(error));
    }
  }
  
}

function* checkRoomCodeSaga() {
  // const { payload } = action;
  // if (!payload) return;

  while (true) {
    try {
      const actions = yield take(CHECK_ROOM_CODE);
      const payload = actions.payload;

      const response = yield call(checkRoomCode, payload);
      yield put(checkRoomCodeSuccess({ ...response, ...payload }));
    } catch (error) {
      yield put(checkRoomCodeFailure(error));
    }
  }
}


function* connectRoomSaga() {
  // const { payload } = action;
  // if (!payload) return;

  while (true) {
    try {
      const { payload } = yield take(CONNECT_ROOM);
      
      const response = yield call(connectRoom, payload);
      const socket = yield call(socketConnection);

      yield fork(handleSocket, socket);
      yield apply(socket, socket.emit, ['join', payload.name, payload.code]); 
  
      yield put(connectRoomSuccess({ ...response, ...payload }));
      yield put(push(`/room/${payload.code}`, { name: payload.name, code: payload.code }));
  
    } catch (error) {
      yield put(connectRoomFailure({ ...error }));
      yield put(push(`/`));
    }
  }
}

function* imageReadySaga() {
  // const { payload } = action;
  // if (!payload) return;

  while (true) {
    try {
      const { payload } = yield take(IMAGE_READY);

      const response = yield call(imageReady, payload);
      yield put(imageReadySuccess({ ...response }));
    } catch (error) {
      yield put(imageReadyFailure({ ...error }));
    }
  }
}

export default function* roomSaga() {
  yield takeLatest(IMAGE_READY, imageReadySaga);

  yield fork(fetchRoomCodeSaga);
  yield fork(connectRoomSaga);
  yield fork(checkRoomCodeSaga);
  // yield fork(imageReadySaga);

}
