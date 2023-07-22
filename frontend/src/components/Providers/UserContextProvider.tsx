import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Cart } from '../../models/cart';
import { ReceivedPost } from '../../models/post';
import { AuthContext } from './AuthContext';
import { GlobalContext } from './GlobalContext';
import { UserContext } from './UserContext';

const rootURL = import.meta.env.VITE_API_ROOT_URL;
const defaultPhotoURL = `${rootURL}/uploads/73-730154_open-default-profile-picture-png.png`;

export default function UserContextProvider({ children }: { children: React.ReactNode }) {
    const [userPosts, setUserPosts] = useState<ReceivedPost[]>([]);
    const [cart, setCart] = useState<Cart | null>(null);
    const [userAvatar, setUserAvatar] = useState<string>(defaultPhotoURL);
    const { user } = useContext(AuthContext);
    const { notifications } = useContext(GlobalContext);

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
            if (notifications) {
                
                if (!notifications[user._id]) {
                    // need to create notification array
                }
                else if (notifications[user._id].length > 0) {
                    // need to show notifications
                }
            }
            if (!cart) {
                getCart().then(res => {
                    setCart(res);
                })
            }
            
            // set user picture
            (function setUserPic () {
                const photo = user.photo;
                if (photo) {
                    if (photo.includes("https://")) {
                        setUserAvatar(photo);
                    }
                    else {
                        setUserAvatar(`${rootURL}/${photo}`);
                    }
                }
                else {
                    setUserAvatar(defaultPhotoURL);
                }
            }());
        }
        async function getCart() {
            const { data } = await axios.get<Cart>('/sales/cart');
            return data
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, notifications])

    return (
        <UserContext.Provider
            value={
                {
                    userAvatar, setUserAvatar,
                    userPosts, setUserPosts,
                    cart, setCart,
                }
            }>
            {children}
        </UserContext.Provider>
    );
}
