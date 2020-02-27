import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { fetchRoomCode, connectRoom, checkRoomCode,
  setName, setCode, setErrorMessage,
  setRound, setTimeLimit, setUserList,
  imageReady, setGameReady, setGameStart,
} from '../modules/room'

export default function useRoom() {
  const name = useSelector((state) => state.room.name);
  const code = useSelector((state) => state.room.code);
  const round = useSelector((state) => state.room.round);
  const timeLimit = useSelector((state) => state.room.timeLimit);
  const connected = useSelector((state) => state.room.connected);
  const errorMessage = useSelector((state) => state.room.errorMessage);
  const userList = useSelector((state) => state.room.userList);
  const images = useSelector((state) => state.room.images);
  
  const dispatch = useDispatch();

  const onFetchRoomID = useCallback(
    (name) => dispatch(fetchRoomCode(name)),
    [dispatch]
  );
  
  const onConnectRoom = useCallback(
    (name, code) => dispatch(connectRoom(name, code)),
    [dispatch]
  );

  const onSetName = useCallback(
    (name) => dispatch(setName(name)),
    [dispatch]
  );

  const onSetCode = useCallback(
    (code) => dispatch(setCode(code)),
    [dispatch]
  );
  
  const onSetErrorMessage = useCallback(
    (message) => dispatch(setErrorMessage(message)),
    [dispatch]
  );

  const onCheckRoomCode = useCallback(
    (code) => dispatch(checkRoomCode(code)),
    [dispatch]
  );

  const onSetRound = useCallback(
    (round) => dispatch(setRound(round)),
    [dispatch]
  );

  const onSetTimeLimit = useCallback(
    (time) => dispatch(setTimeLimit(time)),
    [dispatch]
  );

  const onSetUserList = useCallback(
    (list) => dispatch(setUserList(list)),
    [dispatch]
  );

  const onSetGameReady = useCallback(
    () => dispatch(setGameReady()),
    [dispatch]
  );

  const onSetGameStart = useCallback(
    (status) => dispatch(setGameStart(status)),
    [dispatch]
  );

  const onImageReady = useCallback(
    (code) => dispatch(imageReady(code)),
    [dispatch]
  );

  return {
    name, code, errorMessage, round, timeLimit, connected, userList, images,
    onFetchRoomID,
    onConnectRoom,
    onSetName, onSetCode, onSetRound, onSetTimeLimit,
    onCheckRoomCode, onSetUserList, onImageReady,
    onSetErrorMessage, onSetGameReady, onSetGameStart,
  };
}