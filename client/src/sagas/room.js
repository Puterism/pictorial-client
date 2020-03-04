import { takeLatest, take, delay, fork, call, put, apply, select } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import {
  FETCH_ROOM_CODE, CONNECT_ROOM, CHECK_ROOM_CODE, IMAGE_READY, 
  SET_ROUND, SET_TIME_LIMIT, SET_PROFILE, SET_NOW_ROUND, SET_NEXT_ROUND,
  SET_GAME_READY, SET_GAME_START, SET_GAME_START_SUCCESS,
  SET_GAME_IMAGE_DOWNLOADED, SET_GAME_IN_PROGRESS, SET_NOW_COUNTDOWN_TIME,
  CLICKED_WRONG, CLICKED_ANSWER,
  SET_NOW_IMAGE, SET_NEXT_IMAGE, SET_SHOW_SCOREBOARD,
  fetchRoomCodeSuccess, fetchRoomCodeFailure,
  connectRoomSuccess, connectRoomFailure,
  checkRoomCodeSuccess, checkRoomCodeFailure,
  imageReady, imageReadySuccess, imageReadyFailure, 
  setUserList, setRoomData, setGameStartSuccess,
  setGameImageDownloaded, setGameInProgress,
  setNowCountdownTime, setNowTime,
  setNowRound, setNextRound, 
  setNowImage, setNextImage,
  setShowImage, setShowScoreboard, setResultUserList, setShowResult, 
} from '../modules/room';
import { push } from 'connected-react-router';
import { createRoom, checkRoomCode, connectRoom, imageReadyRequest } from '../apis';
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

    // 현재 유저 정보 받아옴
    socket.on('userData', ({ userList }) => {
      emit(setUserList(userList));
    });

    // 방 정보 변경
    socket.on('roomData', ({ roomData }) => {      
      emit(setRoomData({ round: roomData.round, timeLimit: roomData.time }));
    });

    // 게임 시작 버튼을 누군가 눌러 이미지 업로드 화면으로 다 같이 전환
    socket.on('gameStart', () => {
      emit(setGameStartSuccess());
    });

    // 이미지 업로드가 다 되어 준비가 완료된 유저 데이터
    socket.on('readyUserData', ({ userList }) => {
      emit(setUserList(userList));
    });

    // 모든 유저가 이미지 업로드를 마친 상태
    socket.on('allUserReady', () => {
      emit(imageReady());
    });

    // 모든 유저가 게임에 사용될 이미지 다운로드를 마친 상태
    socket.on('allUserDownload', () => {
      emit(setGameInProgress(true));
    });

    // 이미지 문제 표시 전 카운트다운
    socket.on('countdown', ({ time }) => {
      emit(setNowCountdownTime(time));
    });

    // 문제를 맞추어야 하는 제한 시간
    socket.on('timer', ({ time }) => {
      emit(setNowTime(time));
    });

    socket.on('updateScore', ({ userList }) => {
      emit(setUserList(userList));
    });

    socket.on('roundFinish', () => {
      console.log('roundFinish');
      emit(setShowScoreboard(true));
    });


    return function unsubscribe() {
      socket.off('message');
      socket.off('userData');
      socket.off('roomData');
      socket.off('readyUserData');
      socket.off('allUserReady');
      socket.off('allUserDownload');
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

function* setGameStartSaga(socket) {
  while (true) {
    // payload === true면 'gameStart', payload === false면 'gameFinish'
    const { payload } = yield take(SET_GAME_START);
    const code = yield select(state => state.room.code);
    
    yield apply(socket, socket.emit, ['setGameStart', code, payload]);
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

function* setProfileSaga(socket) {
  while (true) {
    const { payload }  = yield take(SET_PROFILE);
    
    const name = yield select(state => state.room.name);
    const code = yield select(state => state.room.code);
    
    yield apply(socket, socket.emit, ['profileChange', name, code, payload]);
  }
}

function* setGameReadySaga(socket) {
  while (true) {
    yield take(SET_GAME_READY);

    const name = yield select(state => state.room.name);
    const code = yield select(state => state.room.code);
    
    yield apply(socket, socket.emit, ['ready', name, code]);
  }
}

function* setGameStartSuccessSaga() {
  while (true) {
    yield take(SET_GAME_START_SUCCESS);

    const code = yield select(state => state.room.code);
    
    yield put(push(`/room/${code}/upload`));
  }
}

function* setGameImageDownloadedSaga(socket) {
  while (true) {
    yield take(SET_GAME_IMAGE_DOWNLOADED);

    const name = yield select(state => state.room.name);
    const code = yield select(state => state.room.code);

    yield apply(socket, socket.emit, ['imageDownload', name, code]);
  }
}

function* setGameInProgressSaga() {
  while (true) {
    yield take(SET_GAME_IN_PROGRESS);

    yield put(setNowImage(1));
    yield put(setNowRound(1)); 

    // const code = yield select(state => state.room.code);
    // const timeLimit = yield select(state => state.room.timeLimit);
    
    // yield apply(socket, socket.emit, ['roundReady', code]);
    
  }
}

function* setNowImageSaga(socket) {
  while (true) {
    yield take(SET_NOW_IMAGE);

    const code = yield select(state => state.room.code);
    
    yield apply(socket, socket.emit, ['roundReady', code]);
  }
}

// function* setNowRoundSaga(socket) {
//   while (true) {
//     yield take(SET_NOW_ROUND);

//     const code = yield select(state => state.room.code);
//     const nowImage = yield select(state => state.room.nowImage);
//     // const timeLimit = yield select(state => state.room.timeLimit);
//     // if (nowImage < 1) {
//     //   yield apply(socket, socket.emit, ['roundReady', code]);
//     // }
//   }
// }

function* setNowCountdownTimeSaga(socket) {
  while (true) {
    // socket.on 으로 받아온 nowCountdownTime 값
    const { payload } = yield take(SET_NOW_COUNTDOWN_TIME); 

    // 현재 설정되어 있는 nowCountdown 값 
    // const nowCountdownTime = yield select(state => state.room.nowCountdownTime);

    const code = yield select(state => state.room.code);

    if (payload <= 0) {
      // 카운트다운이 0이면 문제 이미지를 보여준다
      yield put(setShowImage(true));
      yield apply(socket, socket.emit, ['roundStart', code, 0]);
    }
  }
}

function* clickedWrongSaga(socket) {
  while (true) {
    const { payload } = yield take(CLICKED_WRONG);

    const name = yield select(state => state.room.name);
    const code = yield select(state => state.room.code);

    yield console.log(CLICKED_WRONG)

    // socket.emit('score', name, roomCode, isCorrect, sec)
    yield apply(socket, socket.emit, ['score', name, code, false, payload]);
  }
}

function* clickedAnswerSaga(socket) {
  while (true) {
    const { payload } = yield take(CLICKED_ANSWER);

    const name = yield select(state => state.room.name);
    const code = yield select(state => state.room.code);
    yield console.log(CLICKED_ANSWER)


    // socket.emit('score', name, roomCode, isCorrect, sec)
    yield apply(socket, socket.emit, ['score', name, code, true, payload]);
  }
}

function* setNextImageSaga() {
  while (true) {
    yield take(SET_NEXT_IMAGE);
    
    const round = yield select(state => state.room.round);
    const nowImage = yield select(state => state.room.nowImage);
    const userList = yield select(state => state.room.userList);
    const userCount = userList.length;

    if (((nowImage % userCount) + 1) < userCount || (userCount === 1)) { 
      yield console.log('next round');
      yield put(setNextRound());
    }
    if ((nowImage + 1) <= (userCount * round)) {
      // 문제 내야할 이미지가 남아 있다면 다음 이미지 선택
      yield put(setNowImage(nowImage + 1));
      yield put(setShowScoreboard(false));
    } else {
      // 남아 있지 않다면
    }
  }
}

function* setNextRoundSaga() {
  while (true) {
    yield take(SET_NEXT_ROUND);

    const nowRound = yield select(state => state.room.nowRound);
    const round = yield select(state => state.room.round);
    const nowImage = yield select(state => state.room.nowImage);
    const userList = yield select(state => state.room.userList);
    const userCount = userList.length;

    if ((nowImage + 1) > userCount * round) {
      // 게임이 끝나면 유저 리스트를 점수 순으로 정렬하여 배치하고 결과를 띄운다.
      const userList = yield select(state => state.room.userList);
      let resultUserList = [ ...userList ];

      resultUserList.sort((a, b) => {
        if (a.score > b.score) {
          return -1;
        }
        if (a.score < b.score) {
          return 1;
        }
        return 0;
      });
      
      yield put(setResultUserList(resultUserList));
      yield put(setShowResult(true));

      yield console.log('game end');
    } else {
      yield put(setNowRound(nowRound + 1));
    }
  }
}

function* setShowScoreboardSaga() {
  while (true) {
    const { payload } = yield take(SET_SHOW_SCOREBOARD);

    if (payload) {
      yield delay(3000);

      yield put(setNextImage());
      yield put(setShowScoreboard(false));
      // TODO: 타이머 타이밍이 틀어짐
      // TODO: 스톱워치 구현하기
      // TODO: 점수판에서 변화값 계산해서 보여주기
    }
  }
}

function* handleSocket(socket) {
  yield fork(read, socket);

  yield fork(setRoundSaga, socket);
  yield fork(setTimeLimitSaga, socket);
  yield fork(setProfileSaga, socket);
  yield fork(setGameReadySaga, socket);
  yield fork(setGameStartSaga, socket);
  yield fork(setGameStartSuccessSaga);
  yield fork(setGameImageDownloadedSaga, socket);
  yield fork(setGameInProgressSaga, socket);
  yield fork(setNowCountdownTimeSaga, socket);
  yield fork(clickedWrongSaga, socket);
  yield fork(clickedAnswerSaga, socket);
  yield fork(setNowImageSaga, socket);
  // yield fork(setNowRoundSaga, socket);
  yield fork(setShowScoreboardSaga, socket);
  yield fork(setNextImageSaga);
  yield fork(setNextRoundSaga);
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

function* checkRoomCodeSaga(action) {
  const { payload } = action;
  if (!payload) return;

  try {
    // const actions = yield take(CHECK_ROOM_CODE);
    // const payload = actions.payload;

    const response = yield call(checkRoomCode, payload);
    yield put(checkRoomCodeSuccess({ ...response, ...payload }));
  } catch (error) {
    yield put(checkRoomCodeFailure(error));
    yield put(push(`/`));
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
      yield take(IMAGE_READY);

      const code = yield select(state => state.room.code);
  
      const response = yield call(imageReadyRequest, code);
      const { data } = yield response;
      let { answerList } = yield data;
      yield answerList.forEach((answer) => {
        answer.answerAuto = JSON.parse(answer.answerAuto);
      });
      const answer = yield answerList;
      yield console.log(answer);
      
      yield put(imageReadySuccess(answer));
      yield put(setGameImageDownloaded());
    } catch (error) {
      yield put(imageReadyFailure({ ...error }));
    }
  }
}

export default function* roomSaga() {
  yield fork(fetchRoomCodeSaga);
  yield fork(connectRoomSaga);
  yield takeLatest(CHECK_ROOM_CODE, checkRoomCodeSaga);
  yield fork(imageReadySaga);
}
