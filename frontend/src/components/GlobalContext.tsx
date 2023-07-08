import { createContext } from 'react';
import { Cart } from '../models/cart';

const initialState = {
    showDeleteModal: false,
    setShowDeleteModal: () => { return false },
    modalResponse: "",
    setModalResponse: () => { return "" },
    cart: {} as Cart,
    setCart: () => { return {} as Cart },
    cartItems: [],
    setCartItems: () => { return [] },
    addedToCart: false,
    setAddedToCart: () => { return false },
    cartCounter: 0,
    setCartCounter: () => { return 0 },
    showProductQuickview: false,
    setShowProductQuickview: () => { return false },
    locations: [],
    setLocations: () => { return [] },
}

interface IContext {
    showDeleteModal: boolean;
    setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
    modalResponse: string;
    setModalResponse: React.Dispatch<React.SetStateAction<string>>;
    cart: Cart | null;
    setCart: React.Dispatch<React.SetStateAction<Cart | null>>;
    cartItems: any[];
    setCartItems: React.Dispatch<React.SetStateAction<any[]>>;
    addedToCart: boolean;
    setAddedToCart: React.Dispatch<React.SetStateAction<boolean>>;
    cartCounter: number;
    setCartCounter: React.Dispatch<React.SetStateAction<number>>;
    showProductQuickview: boolean;
    setShowProductQuickview: React.Dispatch<React.SetStateAction<boolean>>;
    locations: string[];
    setLocations: React.Dispatch<React.SetStateAction<string[]>>;
}

export const GlobalContext = createContext<IContext>(initialState);