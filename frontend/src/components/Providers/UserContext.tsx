import { createContext } from 'react';
import { ReceivedPost } from '../../models/post';
import { Cart } from '../../models/cart';

const initialState = {
    userPosts: [],
    setUserPosts: () => { return [] },
    cart: {} as Cart,
    setCart: () => { return {} as Cart },
    userAvatar: "",
    setUserAvatar: () => { return "" },
    userNotifications: [],
    setUserNotifications: () => { return [] },
}

interface IContext {
    userPosts: ReceivedPost[];
    setUserPosts: React.Dispatch<React.SetStateAction<ReceivedPost[]>>;
    cart: Cart | null;
    setCart: React.Dispatch<React.SetStateAction<Cart | null>>;
    userAvatar: string;
    setUserAvatar: React.Dispatch<React.SetStateAction<string>>;
    userNotifications: string[];
    setUserNotifications: React.Dispatch<React.SetStateAction<string[]>>;
}

export const UserContext = createContext<IContext>(initialState);