import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getFriends,
  getIncomingRequests,
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend,
} from '../services/friends.service';

export function useFriends() {
  const { user } = useAuth();
  const [friends, setFriends] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [friendsList, requests] = await Promise.all([
        getFriends(user.uid),
        getIncomingRequests(user.uid),
      ]);
      setFriends(friendsList);
      setIncomingRequests(requests);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const addFriend = async (friendCode) => {
    await sendFriendRequest(user, friendCode);
  };

  const acceptRequest = async (senderUid) => {
    await acceptFriendRequest(user.uid, senderUid);
    await fetchAll();
  };

  const declineRequest = async (senderUid) => {
    await declineFriendRequest(user.uid, senderUid);
    await fetchAll();
  };

  const unfriend = async (friendUid) => {
    await removeFriend(user.uid, friendUid);
    await fetchAll();
  };

  return {
    friends,
    incomingRequests,
    loading,
    error,
    addFriend,
    acceptRequest,
    declineRequest,
    unfriend,
    refetch: fetchAll,
  };
}
