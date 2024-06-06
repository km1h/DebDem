export interface Video {
    videoId: string;
    videoURI: string;
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
    content: string;
    userId: string;
    timePosted: string;
}

export interface Question {
    questionId: string;
    title: string;
    description: string;
    yesVotes: number;
    noVotes: number;
    userIds: string[];
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
