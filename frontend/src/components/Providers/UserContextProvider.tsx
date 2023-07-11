import { useEffect, useState, useContext } from 'react';
import { UserContext } from './UserContext';
import axios from 'axios';
import { ReceivedPost } from '../../models/post';
import { AuthContext } from './AuthContext';
import { GlobalContext } from './GlobalContext';

export default function UserContextProvider({ children }: { children: React.ReactNode }) {
    const [userPosts, setUserPosts] = useState<ReceivedPost[]>([]);
    const { user } = useContext(AuthContext);
    const { notifications, setNotifications } = useContext(GlobalContext)

    useEffect(() => {
        if (user) {
            axios.get<ReceivedPost[]>("/posts/" + user._id)
                .then((response) => {
                    const data = response.data;
                    data.sort((a, b) =>
                        new Date(a.createdAt).getTime() < new Date(b.createdAt).getTime()
                            ? 1
                            : new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime()
                                ? -1
                                : 0
                    );
                    setUserPosts(data);
                })
                .catch((error) => {
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
        }
    }, [user])

    return (
        <UserContext.Provider
            value={
                {
                    userPosts, setUserPosts,
                }
            }>
            {children}
        </UserContext.Provider>
    );
}
