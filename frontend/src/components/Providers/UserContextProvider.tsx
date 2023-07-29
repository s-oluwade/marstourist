import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Cart } from '../../models/cart';
import { ReceivedPost } from '../../models/post';
import { AuthContext } from './AuthContext';
import { UserContext } from './UserContext';

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
            axios.get<ReceivedPost[]>("/posts/" + user._id)
                .then((response) => {
                    const data = response.data;

                    if (data) {
                        data.sort((a, b) =>
                            new Date(a.createdAt).getTime() < new Date(b.createdAt).getTime()
                                ? 1
                                : new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime()
                                    ? -1
                                    : 0
                        );
                        setUserPosts(data);
                    }
                    else {
                        setUserPosts([]);
                    }
                })
                .catch((error) => {
                    setUserPosts([]);
                    console.log(error);
                });
            
            if (!cart) {
                axios.get<Cart>('/sales/cart').then(res => {
                    setCart(res.data);
                })
            }
            
            // set user picture
            const photo = user.photo;
            if (photo) setUserAvatar(photo);
            else setUserAvatar(defaultPhotoURL);

            // get notifications
            axios.get("/notifications")
            .then((response) => {
                if (response.data) setUserNotifications(response.data);
            })
        }
        else {
            setUserAvatar(defaultPhotoURL);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    return (
        <UserContext.Provider
            value={
                {
                    userNotifications, setUserNotifications,
                    userAvatar, setUserAvatar,
                    userPosts, setUserPosts,
                    cart, setCart,
                }
            }>
            {children}
        </UserContext.Provider>
    );
}
