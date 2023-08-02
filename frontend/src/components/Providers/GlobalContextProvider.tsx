import axios from 'axios';
import { useEffect, useState } from 'react';
import { ReceivedPost } from '../../models/post';
import { ProductWithId } from '../../models/product';
import { GlobalContext } from './GlobalContext';

export default function GlobalContextProvider({ children }: { children: React.ReactNode }) {
    // eslint-disable-next-line prefer-const
    const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);
    const [modalResponse, setModalResponse] = useState<string>("");
    const [locations, setLocations] = useState<string[]>([]);
    const [allPosts, setAllPosts] = useState<ReceivedPost[]>([]);
    const [postNames, setPostNames] = useState<{[key: string]:string} | null>(null);
    const [postAvatars, setPostAvatars] = useState<{[key: string]:string} | null>(null);
    const [products, setProducts] = useState<ProductWithId[]>([]);
    const [showProductQuickview, setShowProductQuickview] = useState<boolean>(false);

    return (
        <GlobalContext.Provider
            value={
                {
                    products, setProducts,
                    postNames, setPostNames,
                    postAvatars, setPostAvatars,
                    allPosts, setAllPosts,
                    locations, setLocations,
                    showProductQuickview, setShowProductQuickview,
                    modalResponse, setModalResponse,
                    showConfirmationModal, setShowConfirmationModal,
                }
            }>
            {children}
        </GlobalContext.Provider>
    );
}
