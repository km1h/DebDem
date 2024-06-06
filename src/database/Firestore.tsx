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
  // fetch videos from room, make this fetch the entire video obj, including uri, comments list, etc (instead of just uri)
  console.log(`Fetching videos from room ${roomId}`);
  const videoRoomDoc = await firestore().collection("videos").doc(roomId).get();
  return (videoRoomDoc.get("videoPaths") as FirebaseFirestoreTypes.DocumentFieldType[]);
}

// video has uri, comments list, poster, etc,
// do we need if we have fetchVieosFromRoom??
export async function fetchVideo(videoId: string) {
  return null;
}

// world has list of questions (with vote counts and users who've voted), list of users in world, list of room ids, list of uninitialized room ids, list of questions
// ideally the questions are objects with an id, content (the actual question), and an upvote count.
export async function fetchWorld() { // don't need worldID
  return null;
}

// room has title question, description, list of video ids, list of users ids in room, time initialized
export async function fetchRoom(roomId: string) {
  return null;
}
// return the comments associate with that video.
export async function fetchComments(videoId: string) {
  return null;
}

// question has title question, description, yes/no votes, and list of user ids who've voted
// prob don't need if fetchWorld will also get the questions
export async function fetchQuestion(questionId: string) {
  return null;
}

// user has first/last name, phone number
export async function fetchUser(userId: string) {
  return null;
}
