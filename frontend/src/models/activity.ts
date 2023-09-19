export interface Activity {
    _id: string;
    userId: string;
    owner: string;
    thumbnail: string;
    topic: string;
    content: string;
    activityType: string,  // post, newUser, newLocation
    currentLocation: string,
    likes: {userId: string; name: string}[];
    createdAt: string;
    updatedAt: string;
}
