import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

import { TEST_WORLD_ID, VIDEO_COLLECTION, QUESTION_COLLECTION, WORLD_COLLECTION, ROOM_COLLECTION, COMMENT_COLLECTION, USER_COLLECTION } from './Constants';
import { Video, World, Room, Comment, Question, User } from './Structures';

export async function fetchVideosFromRoom(roomId: string): Promise<Video[]> {
  console.log(`Fetching videos from room ${roomId}`);
  const roomDoc = await firestore().collection(ROOM_COLLECTION).doc(roomId).get();
  let videoIds: string[] = roomDoc.get("videoIds");
  return await Promise.all(videoIds.map(async (videoId: string) => {
    return fetchVideo(videoId);
  }));
}

export async function fetchCommentsFromVideo(videoId: string): Promise<Comment[]> {
  console.log(`Fetching comments from video ${videoId}`);
  const videoDoc = await firestore().collection(VIDEO_COLLECTION).doc(videoId).get();
  let commentIds: string[] = videoDoc.get("commentIds");
  return await Promise.all(commentIds.map(async (commentId: string) => {
    return fetchComment(commentId);
  }));
}

export async function fetchAllRooms(): Promise<Room[]> {
  let world = await fetchWorld();
  let roomIds: string[] = world.roomIds;
  return await Promise.all(roomIds.map(async (roomId: string) => {
    return fetchRoom(roomId);
  }));
}

export async function fetchAllQuestions(): Promise<Question[]> {
  console.log(`Fetching all questions`);
  let world = await fetchWorld();
  console.log(`World: ${world}`);
  let questionIds: string[] = world.questionIds;
  console.log(`Question IDs: ${questionIds}`);
  return await Promise.all(questionIds.map(async (questionId: string) => {
    return fetchQuestion(questionId);
  }));
}

export async function fetchVideo(videoId: string): Promise<Video> {
  let videoDoc = await firestore().collection(VIDEO_COLLECTION).doc(videoId).get();
  return videoDoc.data() as Video;
}

export async function fetchWorld(): Promise<World> {
  let worldDoc = await firestore().collection(WORLD_COLLECTION).doc(TEST_WORLD_ID).get();
  return worldDoc.data() as World;
}

export async function fetchRoom(roomId: string) {
  let roomDoc = await firestore().collection(ROOM_COLLECTION).doc(roomId).get();
  return roomDoc.data() as Room;
}

export async function fetchComment(commentId: string) {
  let commentDoc = await firestore().collection(COMMENT_COLLECTION).doc(commentId).get();
  return commentDoc.data() as Comment;
}

export async function fetchQuestion(questionId: string) {
  let questionDoc = await firestore().collection(QUESTION_COLLECTION).doc(questionId).get();
  return questionDoc.data() as Question;
}

export async function fetchUser(userId: string) {
  let userDoc = await firestore().collection(USER_COLLECTION).doc(userId).get();
  return userDoc.data() as User;
}

export async function fetchVideoDownloadURLs(videos: Video[]): Promise<string[]> {
  let uris = videos.map((video: Video) => { return video.videoURI; });
  return Promise.all(uris.map(async (uri: string | undefined) => {
    return storage().ref(uri).getDownloadURL();
  }));
}