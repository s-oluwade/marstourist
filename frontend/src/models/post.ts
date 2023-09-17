export interface ReceivedPost {
    _id: string;
    userId: string;
    owner: string;
    thumbnail: string;
    topic: string;
    content: string;
    likes: {userId: string; name: string}[];
    createdAt: string;
    updatedAt: string;
}
