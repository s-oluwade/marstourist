export interface ReceivedPost {
    _id: string;
    owner: string;
    topic: string;
    content: string;
    likes: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface SentPost {
    owner: string;
    topic: string;
    content: string;
}