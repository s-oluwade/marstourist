import { createContext } from 'react';
import { ReceivedPost } from '../../models/post';

const initialState = {
    userPosts: [],
    setUserPosts: () => { return [] },
}

interface IContext {
    userPosts: ReceivedPost[];
    setUserPosts: React.Dispatch<React.SetStateAction<ReceivedPost[]>>;
}

export const UserContext = createContext<IContext>(initialState);