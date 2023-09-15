import axios from 'axios';
import { useEffect, useState } from 'react';
import { Admin } from '../../models/admin';
import { User } from '../../models/user';
import { createContext } from 'react';

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
