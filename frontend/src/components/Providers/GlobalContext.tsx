import { createContext } from 'react';
import { ReceivedPost } from '../../models/post';
import { ProductWithId } from '../../models/product';

const initialState = {
    showConfirmationModal: false,
    setShowConfirmationModal: () => { return false },
    modalResponse: "",
    setModalResponse: () => { return "" },
    showProductQuickview: false,
    setShowProductQuickview: () => { return false },
    locations: [],
    setLocations: () => { return [] },
    allPosts: [],
    setAllPosts: () => { return [] },
    postNames: null,
    setPostNames: () => { return null },
    postAvatars: null,
    setPostAvatars: () => { return null },
    products: [],
    setProducts: () => { return [] },
}

interface IContext {
    showConfirmationModal: boolean;
    setShowConfirmationModal: React.Dispatch<React.SetStateAction<boolean>>;
    modalResponse: string;
    setModalResponse: React.Dispatch<React.SetStateAction<string>>;
    showProductQuickview: boolean;
    setShowProductQuickview: React.Dispatch<React.SetStateAction<boolean>>;
    locations: string[];
    setLocations: React.Dispatch<React.SetStateAction<string[]>>;
    allPosts: ReceivedPost[];
    setAllPosts: React.Dispatch<React.SetStateAction<ReceivedPost[]>>;
    postNames: {[key: string]:string} | null;
    setPostNames: React.Dispatch<React.SetStateAction<{[key: string]:string} | null>>;
    postAvatars: {[key: string]:string} | null;
    setPostAvatars: React.Dispatch<React.SetStateAction<{[key: string]:string} | null>>;
    products: ProductWithId[];
    setProducts: React.Dispatch<React.SetStateAction<ProductWithId[]>>;
}

export const GlobalContext = createContext<IContext>(initialState);