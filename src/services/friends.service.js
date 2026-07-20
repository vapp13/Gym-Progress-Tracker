import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getPublicProfile } from './publicProfile.service';

export async function getFriends(userId) {
  const snapshot = await getDocs(collection(db, 'users', userId, 'friends'));
  const friendIds = snapshot.docs.map((d) => d.id);

  const profiles = await Promise.all(friendIds.map((id) => getPublicProfile(id)));
  return profiles
    .map((profile, i) => (profile ? { ...profile, id: friendIds[i] } : { id: friendIds[i] }))
    .filter(Boolean);
}

export async function getIncomingRequests(userId) {
  const snapshot = await getDocs(collection(db, 'users', userId, 'friendRequests'));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// friendCode is currently just the other person's uid (see design notes).
export async function sendFriendRequest(currentUser, friendCode) {
  const targetUid = friendCode.trim();

  if (!targetUid || targetUid === currentUser.uid) {
    throw new Error('Enter a valid Friend Code.');
  }

  const targetProfile = await getPublicProfile(targetUid);
  if (!targetProfile) {
    throw new Error('No user found with that Friend Code.');
  }

  const requestRef = doc(db, 'users', targetUid, 'friendRequests', currentUser.uid);
  await setDoc(requestRef, {
    fromDisplayName: currentUser.displayName,
    fromPhotoURL: currentUser.photoURL,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
}

export async function acceptFriendRequest(currentUserId, senderUid) {
  const batch = writeBatch(db);

  const requestRef = doc(db, 'users', currentUserId, 'friendRequests', senderUid);
  batch.delete(requestRef);

  const myFriendRef = doc(db, 'users', currentUserId, 'friends', senderUid);
  batch.set(myFriendRef, { since: serverTimestamp() });

  const theirFriendRef = doc(db, 'users', senderUid, 'friends', currentUserId);
  batch.set(theirFriendRef, { since: serverTimestamp() });

  await batch.commit();
}

export async function declineFriendRequest(currentUserId, senderUid) {
  const requestRef = doc(db, 'users', currentUserId, 'friendRequests', senderUid);
  await deleteDoc(requestRef);
}

export async function removeFriend(currentUserId, friendUid) {
  const batch = writeBatch(db);
  batch.delete(doc(db, 'users', currentUserId, 'friends', friendUid));
  batch.delete(doc(db, 'users', friendUid, 'friends', currentUserId));
  await batch.commit();
}

export async function hasPendingOutgoingRequest(currentUserId, targetUid) {
  // Not generally readable (would require reading another user's inbox),
  // so we only check the one request we might have sent, by its known ID.
  const requestRef = doc(db, 'users', targetUid, 'friendRequests', currentUserId);
  const snap = await getDoc(requestRef);
  return snap.exists();
}
