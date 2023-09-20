import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Admin } from '../../models/admin';
import { User } from '../../models/user';

const initialState = {
    user: null,
    setUser: () => {
        return null;
    },
    loadingUser: false,
    setLoadingUser: () => {
        return null;
    },
    admin: null,
    setAdmin: () => {
        return null;
    },
    loadingAdmin: false,
    setLoadingAdmin: () => {
        return null;
    },
};

interface IContext {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    loadingUser: boolean;
    setLoadingUser: React.Dispatch<React.SetStateAction<boolean>>;
    admin: Admin | null;
    setAdmin: React.Dispatch<React.SetStateAction<Admin | null>>;
    loadingAdmin: boolean;
    setLoadingAdmin: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AuthContext = createContext<IContext>(initialState);

const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loadingUser, setLoadingUser] = useState<boolean>(true);
    const [admin, setAdmin] = useState<Admin | null>(null);
    const [loadingAdmin, setLoadingAdmin] = useState<boolean>(true);

    const navigate = useNavigate();
    const currentPath = window.location.pathname;

    useEffect(() => {
        // If no logged in state
        if (!user && !admin) {
            // USE ONLY USER AUTHENTICATION FOR NOW
            setLoadingAdmin(false);
            // else grab user if authenticated
            axios
                .get<User>('/user')
                .then((res) => {
                    setUser(res.data);
                })
                .finally(() => {
                    setLoadingUser(false);
                });
        } else {
            setLoadingUser(false);
            setLoadingAdmin(false);
        }
    }, [user, admin]);

    // if not signed in, redirect to home page
    // if (
    //     !currentPath.includes('login') &&
    //     !currentPath.includes('register') &&
    //     !currentPath.includes('activities')
    // ) {
    //     if (!loadingUser && !user && !loadingAdmin && !admin) {
    //         console.log('redirecting')
    //         navigate('/');
    //     }
    // }

    return (
        <AuthContext.Provider
            value={{
                admin,
                setAdmin,
                user,
                setUser,
                loadingUser,
                setLoadingUser,
                loadingAdmin,
                setLoadingAdmin,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;
