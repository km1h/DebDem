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


export async function fetchVideosFromRoom(roomId: string) {
  // fetch videos from room
  console.log(`Fetching videos from room ${roomId}`);
  const videoRoomDoc = await firestore().collection("videos").doc(roomId).get();
  return (videoRoomDoc.get("videoPaths") as FirebaseFirestoreTypes.DocumentFieldType[]);
}

// video has uri, comments list, poster, etc,
export async function fetchVideo(videoId: string) {
  return null;
}

// world has list of questions (with vote counts and users who've voted), list of users in world, list of room ids, list of uninitialized room ids, list of questions
export async function fetchWorld(worldId: string) {
  return null;
}

// rooom has title question, description, list of video ids, list of users ids in room, time initialized
export async function fetchRoom(roomId: string) {
  return null;
}

// question has title question, description, yes/no votes, and list of user ids who've voted
export async function fetchQuestion(questionId: string) {
  return null;
}

// user has first/last name, phone number
export async function fetchUser(userId: string) {
  return null;
}
