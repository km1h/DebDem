import { FFmpegKit, ReturnCode } from 'ffmpeg-kit-react-native';
import storage from '@react-native-firebase/storage';

import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export function uploadVideo(roomId: string, videoURI: string) {
  // upload video to backend
  console.log(`Uploading video ${videoURI} to room ${roomId}`);

  // Execute FFmpeg command
  console.log(`Compressing video ${videoURI}`);

  const cloudStorageVideoURI = `Videos/${roomId}/${videoURI}`;

  FFmpegKit.execute(`-y -i ${videoURI} -r 30 -c:v libx264 -vf scale=256:384 -aspect 2:3 -t 60s ${videoURI}`).then(async (session) => {
      const returnCode = await session.getReturnCode();
      if (ReturnCode.isSuccess(returnCode)) {
        console.log(`Compression completed successfully`);
        console.log("Uploading compressed video to backend");
        storage().ref(cloudStorageVideoURI).putFile(videoURI).then(() => {
          console.log(`Video uploaded successfully`);
        });
      } else if (ReturnCode.isCancel(returnCode)) {
          console.log(`Compression was cancelled`);
      } else {
          console.log(`Compression failed. Please check the logs for the details.`);
      }
  });
}

export function fetchVideoDownloadURLs(paths: FirebaseFirestoreTypes.DocumentFieldType[]) {
  let promises = paths.map(async (path: FirebaseFirestoreTypes.DocumentFieldType | undefined) => {
    const url = await storage().ref(path?.toString()).getDownloadURL();
    return url;
  });
  return Promise.all(promises);
}