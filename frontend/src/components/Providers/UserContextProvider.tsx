import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import { Cart } from '../../models/cart';
import { ReceivedPost } from '../../models/post';
import { AuthContext } from './AuthContextProvider';

const initialState = {
    userPosts: [],
    setUserPosts: () => {
        return [];
    },
    cart: {} as Cart,
    setCart: () => {
        return {} as Cart;
    },
    userAvatar: '',
    setUserAvatar: () => {
        return '';
    },
    userNotifications: [],
    setUserNotifications: () => {
        return [];
    },
};

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

const rootURL = import.meta.env.VITE_API_ROOT_URL;
const defaultPhotoURL = `${rootURL}/uploads/73-730154_open-default-profile-picture-png.png`;

export default function UserContextProvider({ children }: { children: React.ReactNode }) {
    const [userPosts, setUserPosts] = useState<ReceivedPost[]>([]);
    const [cart, setCart] = useState<Cart | null>(null);
    const [userAvatar, setUserAvatar] = useState<string>(defaultPhotoURL);
    const { user } = useContext(AuthContext);
    const [userNotifications, setUserNotifications] = useState<string[]>([]);

    useEffect(() => {
        if (user) {
            if (!cart) {
                axios.get<Cart>('/sales/cart').then((res) => {
                    setCart(res.data);
                });
            }

            // set user picture
            const photo = user.photo;
            if (photo) setUserAvatar(photo);
            else setUserAvatar(defaultPhotoURL);

            // get notifications
            axios.get('/notifications').then((response) => {
                if (response.data) setUserNotifications(response.data);
            });
        } else {
            setUserAvatar(defaultPhotoURL);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    return (
        <UserContext.Provider
            value={{
                userNotifications,
                setUserNotifications,
                userAvatar,
                setUserAvatar,
                userPosts,
                setUserPosts,
                cart,
                setCart,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}
