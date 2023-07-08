import { useEffect, useState } from 'react';
import { GlobalContext } from './GlobalContext';
import { Cart } from '../models/cart';
import axios from 'axios';

export default function GlobalContextProvider ({ children }: { children: React.ReactNode }) {
    // eslint-disable-next-line prefer-const
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [modalResponse, setModalResponse] = useState<string>("");
    const [cart, setCart] = useState<Cart | null>(null);
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [addedToCart, setAddedToCart] = useState<boolean>(false);
    const [cartCounter, setCartCounter] = useState<number>(0);
    const [showProductQuickview, setShowProductQuickview] = useState<boolean>(false);
    const [locations, setLocations] = useState<string[]>([]);

    useEffect(() => {
        const cartStorage = localStorage.getItem('cart');
        const cartCounterStorage = localStorage.getItem('cart_counter');
        if (cartStorage) {
            setCartItems(JSON.parse(cartStorage));
        }
        else {
            setCartItems([]);
        }
        if (cartCounterStorage) {
            setCartCounter(JSON.parse(cartCounterStorage));
        }

        async function loadData() {
            const { data } = await axios.get('/data/site-data');

            setLocations(data.regions);
        }
        loadData();

    }, [addedToCart])

    return (
        <GlobalContext.Provider
            value={
                {
                    locations, setLocations,
                    cart, setCart,
                    showProductQuickview, setShowProductQuickview,
                    cartCounter, setCartCounter,
                    addedToCart, setAddedToCart,
                    cartItems, setCartItems,
                    modalResponse, setModalResponse,
                    showDeleteModal, setShowDeleteModal
                }
            }>
            {children}
        </GlobalContext.Provider>
    );
}
