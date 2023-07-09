import { createContext } from 'react';
import { Cart } from '../../models/cart';
import { ReceivedPost } from '../../models/post';

const initialState = {
    showDeleteModal: false,
    setShowDeleteModal: () => { return false },
    modalResponse: "",
    setModalResponse: () => { return "" },
    cart: {} as Cart,
    setCart: () => { return {} as Cart },
    showProductQuickview: false,
    setShowProductQuickview: () => { return false },
    locations: [],
    setLocations: () => { return [] },
    allPosts: [],
    setAllPosts: () => { return [] },
    postNames: [],
    setPostNames: () => { return [] },
    postAvatars: [],
    setPostAvatars: () => { return [] },
}

interface IContext {
    showDeleteModal: boolean;
    setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
    modalResponse: string;
    setModalResponse: React.Dispatch<React.SetStateAction<string>>;
    cart: Cart | null;
    setCart: React.Dispatch<React.SetStateAction<Cart | null>>;
    showProductQuickview: boolean;
    setShowProductQuickview: React.Dispatch<React.SetStateAction<boolean>>;
    locations: string[];
    setLocations: React.Dispatch<React.SetStateAction<string[]>>;
    allPosts: ReceivedPost[];
    setAllPosts: React.Dispatch<React.SetStateAction<ReceivedPost[]>>;
    postNames: { _id: string; name: string; owner: string; }[];
    setPostNames: React.Dispatch<React.SetStateAction<{ _id: string; name: string; owner: string; }[]>>;
    postAvatars: { _id: string; picture: string; owner: string; }[];
    setPostAvatars: React.Dispatch<React.SetStateAction<{ _id: string; picture: string; owner: string; }[]>>;
}

export const GlobalContext = createContext<IContext>(initialState);