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
    const [postNames, setPostNames] = useState<{ _id: string; name: string; owner: string; }[]>([]);
    const [postAvatars, setPostAvatars] = useState<{ _id: string; picture: string; owner: string; }[]>([]);
    const [products, setProducts] = useState<ProductWithId[]>([]);
    const [showProductQuickview, setShowProductQuickview] = useState<boolean>(false);
    const [notifications, setNotifications] = useState<{ [key: string]: string[] } | null>(null);

    useEffect(() => {
        async function loadGlobalData() {
            const { data } = await axios.get('/data/site-data');
            setLocations(data.regions);
            axios.get("/posts/profile-names")
                .then((response) => {
                    const names = response.data;
                    setPostNames(names);
                })
                .catch((error) => {
                    console.log(error);
                });

            axios.get("/posts/profile-pictures")
                .then((response) => {
                    const pictures = response.data;
                    setPostAvatars(pictures);
                })
                .catch((error) => {
                    console.log(error);
                });
            axios.get<ReceivedPost[]>("/posts")
                .then((response) => {
                    const data = response.data;
                    data.sort((a, b) =>
                        new Date(a.createdAt).getTime() < new Date(b.createdAt).getTime()
                            ? 1
                            : new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime()
                                ? -1
                                : 0
                    );
                    setAllPosts(data);
                })
                .catch((error) => {
                    console.log(error);
                });
            axios.get("/products")
                .then((response) => {
                    const products = response.data;
                    setProducts(products);
                })
                .catch((error) => {
                    console.log(error);
                });
            axios.get("/notifications")
                .then((response) => {
                    setNotifications(response.data);
                })
        }
        loadGlobalData();
    }, [])

    return (
        <GlobalContext.Provider
            value={
                {
                    notifications, setNotifications,
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
