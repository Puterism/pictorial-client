export const FETCH_ROOM_ID = 'room/FETCH_ROOM_ID';
export const FETCH_ROOM_ID_SUCCESS = 'room/FETCH_ROOM_ID_SUCCESS';
export const FETCH_ROOM_ID_FAILURE = 'room/FETCH_ROOM_ID_FAILURE';

export const fetchRoomID = (nickname) => ({
  type: FETCH_ROOM_ID,
  payload: {
    nickname: nickname,
  },
});

export const fetchRoomIDSuccess = (response) => ({
  type: FETCH_ROOM_ID_SUCCESS,
  payload: response,
});

export const fetchRoomIDFailure = (response) => ({
  type: FETCH_ROOM_ID_FAILURE,
  payload: response,
});


const initialState = {
  id: '',
  nickname: '',
}

// reducer
function room(state = initialState, { type, payload }) {
  switch (type) {
    case FETCH_ROOM_ID:
      return {
        ...state,
        status: 'FETCHING',
      }
    case FETCH_ROOM_ID_SUCCESS: 
      return {
        ...state,
        ...payload.data,
        nickname: payload.nickname,
      };
    case FETCH_ROOM_ID_FAILURE:
      return {
        ...state,
        ...payload.response.data,
        id: '',
        nickname: '',
        showError: true,
      };
    
    default:
      return state;
  }
}

export default room;