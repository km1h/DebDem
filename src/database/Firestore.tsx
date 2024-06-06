import firestore from '@react-native-firebase/firestore';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export function addVideoToRoom(roomId: string, cloudStorageVideoURI: string) {
  // add video to room
  console.log(`Adding video ${cloudStorageVideoURI} to room ${roomId}`);

  // fetch videos from room
  let videoRoomRef = firestore().collection("videos").doc(roomId);
  videoRoomRef.get().then((doc) => {
    let videoPaths: FirebaseFirestoreTypes.DocumentFieldType[] = doc.get("videoPaths");
    videoPaths.push(cloudStorageVideoURI);
    videoRoomRef.update({
      videoPaths: videoPaths
    });
  });
}

// TODO: for comments: comment, room id, video id, user id, timestamp

export async function fetchVideosFromRoom(roomId: string) {
  // fetch videos from room
  console.log(`Fetching videos from room ${roomId}`);
  const videoRoomDoc = await firestore().collection("videos").doc(roomId).get();
  return (videoRoomDoc.get("videoPaths") as FirebaseFirestoreTypes.DocumentFieldType[]);
}