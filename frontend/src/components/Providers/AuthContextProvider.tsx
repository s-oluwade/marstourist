import axios from 'axios';
import { useEffect, useState } from 'react';
import { Admin } from '../../models/admin';
import { User } from '../../models/user';
import { AuthContext } from './AuthContext';

const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loadingUser, setLoadingUser] = useState<boolean>(true);
    const [admin, setAdmin] = useState<Admin | null>(null);
    const [loadingAdmin, setLoadingAdmin] = useState<boolean>(true);

    useEffect(() => {
        // If no logged in state
        if (!user && !admin) {

            // grab admin if authenticated
            axios.get<Admin>("/admin", {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                },
            }).then(res => {
                logoutUser();
                setAdmin(res.data);
                // unauthenticate/logout user
            }).catch(() => {
                setLoadingAdmin(false);
                // else grab user if authenticated
                axios.get<User>("/user").then(res => {
                    setUser(res.data);
                }).finally(() => {
                    setLoadingUser(false);
                })
            })
        }
        else {
            setLoadingUser(false);
            setLoadingAdmin(false);
        }

    }, [user, admin]);

    async function logoutUser() {
        try {
            await axios.post('/user/logout');
            window.location.reload();
            // setUser(null);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <AuthContext.Provider
            value={
                { admin, setAdmin, user, setUser, loadingUser, setLoadingUser, loadingAdmin, setLoadingAdmin }
            }>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContextProvider;