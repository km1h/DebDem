export interface Video {
    videoId: string;
    videoURI: string | undefined;
    commentIds: string[];
}

export interface Room {
    roomId: string;
    title: string;
    description: string;
    videoIds: string[];
    userIds: string[];
    timeInitialized: number;
}

export interface Comment {
    commentId: string;
    content: string | undefined;
    userId: string;
    timePosted: number;
}

export interface Question {
    questionId: string;
    title: string;
    description: string;
    yesVotes: number;
    noVotes: number;
    yesUserIds: string[];
    noUserIds: string[];
}

export interface User {
    userId: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

export interface World {
    worldId: string;
    questionIds: string[];
    userIds: string[];
    roomIds: string[];
}

export type MediaType = 'video';
export type VideoQuality = 'medium';

export interface CameraOptions {
  mediaType: MediaType;
  videoQuality: VideoQuality;
}
