import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { fetchRoomCode, connectRoom, setName, setCode, checkRoomCode, } from '../modules/room'

export default function useRoom() {
  const name = useSelector((state) => state.room.name);
  const code = useSelector((state) => state.room.code);
  const errorMsg = useSelector((state) => state.room.errorMsg);
  
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

  const onCheckRoomCode = useCallback(
    (code) => dispatch(checkRoomCode(code)),
    [dispatch]
  );

  return {
    name, code, errorMsg,
    onFetchRoomID,
    onConnectRoom,
    onSetName, onSetCode,
    onCheckRoomCode,
  };
}