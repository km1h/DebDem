import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

import { Video, World, Room, Comment, Question, User } from './Structures';

export async function fetchVideosFromRoom(roomId: string): Promise<Video[]> {
  console.log(`Fetching videos from room ${roomId}`);
  const roomDoc = await firestore().collection("room").doc(roomId).get();
  let videoIds: string[] = roomDoc.get("videoIds");
  return await Promise.all(videoIds.map(async (videoId: string) => {
    return fetchVideo(videoId);
  }));
}

export async function fetchVideo(videoId: string): Promise<Video> {
  let videoDoc = await firestore().collection("video").doc(videoId).get();
  return videoDoc.data() as Video;
}

export async function fetchWorld(): Promise<World> {
  let worldDoc = await firestore().collection("world").doc("test").get();
  return worldDoc.data() as World;
}

export async function fetchRoom(roomId: string) {
  let roomDoc = await firestore().collection("room").doc(roomId).get();
  return roomDoc.data() as Room;
}

export async function fetchComment(commentId: string) {
  let commentDoc = await firestore().collection("comment").doc(commentId).get();
  return commentDoc.data() as Comment;
}

export async function fetchQuestion(questionId: string) {
  let questionDoc = await firestore().collection("question").doc(questionId).get();
  return questionDoc.data() as Question;
}

export async function fetchUser(userId: string) {
  let userDoc = await firestore().collection("user").doc(userId).get();
  return userDoc.data() as User;
}

export async function fetchVideoDownloadURLs(videos: Video[]): Promise<string[]> {
  let uris = videos.map((video: Video) => { return video.videoURI; });
  return Promise.all(uris.map(async (uri: string) => {
    return await storage().ref(uri).getDownloadURL();
  }));
}