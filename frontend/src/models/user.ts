export interface User {
    _id: string;
    fullname: string;
    username: string;
    userType: string;
    email: string;
    credit: number;
    photo: string;
    thumbnail: string;
    bio: string;
    location: string;
    friends: { userId: string; name: string }[];
}
