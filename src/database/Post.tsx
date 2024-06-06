import storage from '@react-native-firebase/storage';
import firestore, { arrayUnion } from '@react-native-firebase/firestore';
import { FFmpegKit, ReturnCode } from 'ffmpeg-kit-react-native';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

import { VIDEO_STORAGE_DIRECTORY, VIDEO_COLLECTION, COMMENT_COLLECTION, ROOM_COLLECTION, QUESTION_COLLECTION, USER_COLLECTION } from './Constants';
import { fetchRoom, fetchVideo } from './Fetch';
import { Video, User, Room, World, Comment, Question } from './Structures';

export function getRandomId() {
  return Math.random().toString(36).substring(7);
}

export async function constructAndStoreVideo(localURI: string): Promise<Video | null> {
  console.log(`Compressing video ${localURI}...`);

  const videoId = getRandomId();
  const videoURI = `${VIDEO_STORAGE_DIRECTORY}/${videoId}`;

  let session = await FFmpegKit.execute(`-y -i ${localURI} -r 30 -c:v libx264 -vf scale=256:384 -aspect 2:3 -t 60s ${localURI}`);
  let returnCode = await session.getReturnCode();
  let compressSuccessful = ReturnCode.isSuccess(returnCode);
  
  if (!compressSuccessful) {
    console.log(`Failed to compress video ${localURI}`);
    return null;
  }

  console.log(`Compressed video ${localURI}`);
  console.log("Uploading compressed video to backend...");
  return storage().ref(videoURI).putFile(localURI).then(() => {
    console.log(`Video uploaded successfully`);
    return {
      videoId: videoId,
      videoURI: videoURI,
      commentIds: []
    };
  }).catch((error) => {
    console.log(`Video upload failed: ${error}`);
    return null;
  });
}

export async function postVideo(video: Video) {
  console.log(`Posting video ${video.videoId}`);
  let videoRef = firestore().collection(VIDEO_COLLECTION).doc(video.videoId);
  await videoRef.set(video);
}

export async function postRoom(room: Room) {
  console.log(`Posting room ${room.roomId}`);
  let roomRef = firestore().collection(ROOM_COLLECTION).doc(room.roomId);
  await roomRef.set(room);
}

export async function postUser(user: User) {
  console.log(`Posting user ${user.userId}`);
  let userRef = firestore().collection(USER_COLLECTION).doc(user.userId);
  await userRef.set(user);
}

export async function postComment(comment: Comment) {
  console.log(`Posting comment ${comment.commentId}`);
  let commentRef = firestore().collection(COMMENT_COLLECTION).doc(comment.commentId);
  await commentRef.set(comment);
}

export async function postQuestion(question: Question) {
  console.log(`Posting question ${question.questionId}`);
  let questionRef = firestore().collection(QUESTION_COLLECTION).doc(question.questionId);
  await questionRef.set(question);
}

export function addVideoToRoom(roomId: string, videoId: string) {
  console.log(`Adding video ${videoId} to room ${roomId}`);

  // fetch videos from room
  let roomRef = firestore().collection("rooms").doc(roomId);
  roomRef.update({"videoIds": arrayUnion([videoId])});
}

export async function voteQuestion(questionId: string, userId: string, yes: boolean) {
  console.log(`Voting ${yes ? "yes" : "no"} question ${questionId}`);
  firestore().runTransaction(async (transaction) => {
    let questionRef = firestore().collection(QUESTION_COLLECTION).doc(questionId);
    let questionDoc = await transaction.get(questionRef);
    let userIds: string[] = questionDoc.get("userIds");
    if (userIds.includes(userId)) {
      console.log(`User ${userId} has already voted on question ${questionId}`);
    } else {
      let yesVotes: number = questionDoc.get("yesVotes");
      let noVotes: number = questionDoc.get("noVotes");
      if (yes) {
        transaction.update(questionRef, {"yesVotes": yesVotes + 1});
      } else {
        transaction.update(questionRef, {"noVotes": noVotes + 1});
      }
      transaction.update(questionRef, {"userIds": arrayUnion([userId])});
    }
  });
}
