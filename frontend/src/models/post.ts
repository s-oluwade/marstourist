export interface ReceivedPost {
    _id: string;
    owner: string;
    topic: string;
    content: string;
    likes: string[];
    createdAt: string;
    updatedAt: string;
}

export interface SentPost {
    owner: string;
    topic: string;
    content: string;
}