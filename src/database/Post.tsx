import storage from '@react-native-firebase/storage';
import { FFmpegKit, ReturnCode } from 'ffmpeg-kit-react-native';
import firestore, { updateDoc, arrayUnion } from '@react-native-firebase/firestore';

import { VIDEO_STORAGE_DIRECTORY, VIDEO_COLLECTION, COMMENT_COLLECTION, ROOM_COLLECTION, QUESTION_COLLECTION, USER_COLLECTION, WORLD_COLLECTION, TEST_WORLD_ID } from './Constants';
import { fetchRoom, fetchVideo } from './Fetch';
import { Video, User, Room, World, Comment, Question } from './Structures';

export function getRandomId() {
  return Math.random().toString(36).substring(7);
}

export async function constructAndStoreVideo(localURI: string): Promise<Video | null> {
  console.log(`Compressing video ${localURI}...`);

  const videoId = getRandomId();
  const lastPeriodIndex = localURI.lastIndexOf(".");
  const localURICompressed = localURI.substring(0, lastPeriodIndex) + "_compressed.mp4";
  const videoURI = `${VIDEO_STORAGE_DIRECTORY}/${videoId}`;

  let session = await FFmpegKit.execute(`-y -i ${localURI} -r 30 -c:v libx264 -vf scale=256:384 -aspect 2:3 -t 60s ${localURICompressed}`);
  let returnCode = await session.getReturnCode();
  let compressSuccessful = ReturnCode.isSuccess(returnCode);
  
  if (!compressSuccessful) {
    console.log(`Failed to compress video ${localURI}`);
    return null;
  }

  console.log(`Compressed video ${localURI}`);
  console.log("Uploading compressed video to backend...");
  return storage().ref(videoURI).putFile(localURICompressed).then(() => {
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

export async function postComment(comment: Comment, videoId: string) {
  console.log(`Posting comment ${comment.commentId}`);
  let commentRef = firestore().collection(COMMENT_COLLECTION).doc(comment.commentId);
  await commentRef.set(comment);
  console.log(`Adding comment ${comment.commentId} to video ${videoId}`);
  let videoRef = firestore().collection(VIDEO_COLLECTION).doc(videoId);
  await videoRef.update({commentIds: arrayUnion(comment.commentId)});
}

export async function postQuestion(question: Question) {
  console.log(`Posting question ${question.questionId}`);
  let questionRef = firestore().collection(QUESTION_COLLECTION).doc(question.questionId);
  await questionRef.set(question);
  console.log(`Adding question ${question.questionId} to world`);
  let worldRef = firestore().collection(WORLD_COLLECTION).doc(TEST_WORLD_ID);
  await worldRef.update({questionIds: arrayUnion(question.questionId)});
}

export async function addVideoToRoom(roomId: string, videoId: string, userId: string) {
  console.log(`Adding video ${videoId} to room ${roomId}`);

  // fetch videos from room
  let roomRef = firestore().collection(ROOM_COLLECTION).doc(roomId);
  await roomRef.update({videoIds: arrayUnion(videoId)});
  await roomRef.update({userIds: arrayUnion(userId)});
}

export async function voteQuestion(questionId: string, userId: string, yes: boolean) {
  console.log(`Voting ${yes ? "yes" : "no"} question ${questionId}`);
  firestore().runTransaction(async (transaction) => {
    let questionRef = firestore().collection(QUESTION_COLLECTION).doc(questionId);
    let questionDoc = await transaction.get(questionRef);
    console.log(`Question ${questionId} has ${questionDoc.get("yesVotes")} yes votes and ${questionDoc.get("noVotes")} no votes`);
    let yesUserIds: string[] = questionDoc.get("yesUserIds");
    let noUserIds: string[] = questionDoc.get("noUserIds");
    console.log(`User ${userId} has voted on question ${questionId}: ${yesUserIds.includes(userId) || noUserIds.includes(userId)}`);
    if (yesUserIds.includes(userId) || noUserIds.includes(userId)) {
      console.log(`User ${userId} has already voted on question ${questionId}`);
    } else {
      let yesVotes: number = questionDoc.get("yesVotes");
      let noVotes: number = questionDoc.get("noVotes");
      if (yes) {
        console.log(`Incrementing yes votes for question ${questionId}`);
        transaction.update(questionRef, {"yesVotes": yesVotes + 1});
        transaction.update(questionRef, {yesUserIds: arrayUnion(userId)});
      } else {
        console.log(`Incrementing no votes for question ${questionId}`);
        transaction.update(questionRef, {"noVotes": noVotes + 1});
        transaction.update(questionRef, {noUserIds: arrayUnion(userId)});
      }
    }
  });
}
