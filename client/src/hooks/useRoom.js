import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { fetchRoomID } from '../modules/room'

export default function useRoom() {
  const id = useSelector((state) => state.room.id);
  const dispatch = useDispatch();

  const onFetchRoomID = useCallback(
    (nickname) => dispatch(fetchRoomID(nickname)),
    [dispatch]);

  return {
    id,
    onFetchRoomID,
  };
}