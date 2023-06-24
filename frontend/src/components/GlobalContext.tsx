import { createContext, useState, useEffect } from 'react';

const initialState = {
    showDeleteModal: false,
    setShowDeleteModal: () => { return false },
    modalResponse: "",
    setModalResponse: () => { return "" },
    cartItems: [],
    setCartItems: () => { return [] },
    addedToCart: false,
    setAddedToCart: () => { return false },
    cartCounter: 0,
    setCartCounter: () => { return 0 },
}

interface IContext {
    showDeleteModal: boolean;
    setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
    modalResponse: string;
    setModalResponse: React.Dispatch<React.SetStateAction<string>>;
    cartItems: any[];
    setCartItems: React.Dispatch<React.SetStateAction<any[]>>;
    addedToCart: boolean;
    setAddedToCart: React.Dispatch<React.SetStateAction<boolean>>;
    cartCounter: number;
    setCartCounter: React.Dispatch<React.SetStateAction<number>>;
}

export const GlobalContext = createContext<IContext>(initialState);

const GlobalContextProvider = ({ children }: { children: React.ReactNode }) => {
    // eslint-disable-next-line prefer-const
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [modalResponse, setModalResponse] = useState<string>("");
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [addedToCart, setAddedToCart] = useState<boolean>(false);
    const [cartCounter, setCartCounter] = useState<number>(0);

    useEffect(() => {
        localStorage.removeItem('cart_newstate');
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

    }, [addedToCart])

    return (
        <GlobalContext.Provider
            value={
                {
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

export default GlobalContextProvider;