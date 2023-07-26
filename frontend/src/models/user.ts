export interface User {
    _id: string;
    fullname: string;
    username?: string;
    email: string;
    credit: number;
    photo: string;
    bio: string;
    location: string;
    friends: string[];
}