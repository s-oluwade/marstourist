import { createContext, useState } from 'react';
import { ProductWithId } from '../../models/product';
import { Activity } from '../../models/activity';

const initialState = {
    showConfirmationModal: false,
    setShowConfirmationModal: () => {
        return false;
    },
    modalResponse: '',
    setModalResponse: () => {
        return '';
    },
    showProductQuickview: false,
    setShowProductQuickview: () => {
        return false;
    },
    allPosts: [],
    setAllPosts: () => {
        return [];
    },
    activities: [],
    setActivities: () => {
        return [];
    },
    postNames: null,
    setPostNames: () => {
        return null;
    },
    postAvatars: null,
    setPostAvatars: () => {
        return null;
    },
    products: [],
    setProducts: () => {
        return [];
    },
};

interface IContext {
    showConfirmationModal: boolean;
    setShowConfirmationModal: React.Dispatch<React.SetStateAction<boolean>>;
    modalResponse: string;
    setModalResponse: React.Dispatch<React.SetStateAction<string>>;
    showProductQuickview: boolean;
    setShowProductQuickview: React.Dispatch<React.SetStateAction<boolean>>;
    activities: Activity[];
    setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
    postNames: { [key: string]: string } | null;
    setPostNames: React.Dispatch<React.SetStateAction<{ [key: string]: string } | null>>;
    postAvatars: { [key: string]: string } | null;
    setPostAvatars: React.Dispatch<React.SetStateAction<{ [key: string]: string } | null>>;
    products: ProductWithId[];
    setProducts: React.Dispatch<React.SetStateAction<ProductWithId[]>>;
}

export const GlobalContext = createContext<IContext>(initialState);

export default function GlobalContextProvider({ children }: { children: React.ReactNode }) {
    // eslint-disable-next-line prefer-const
    const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);
    const [modalResponse, setModalResponse] = useState<string>('');
    const [activities, setActivities] = useState<Activity[]>([]);
    const [postNames, setPostNames] = useState<{ [key: string]: string } | null>(null);
    const [postAvatars, setPostAvatars] = useState<{ [key: string]: string } | null>(null);
    const [products, setProducts] = useState<ProductWithId[]>([]);
    const [showProductQuickview, setShowProductQuickview] = useState<boolean>(false);

    return (
        <GlobalContext.Provider
            value={{
                activities,
                setActivities,
                products,
                setProducts,
                postNames,
                setPostNames,
                postAvatars,
                setPostAvatars,
                showProductQuickview,
                setShowProductQuickview,
                modalResponse,
                setModalResponse,
                showConfirmationModal,
                setShowConfirmationModal,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
}
