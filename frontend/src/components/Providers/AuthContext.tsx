import { createContext } from 'react';
import { User } from '../../models/user';
import { Admin } from '../../models/admin';

const initialState = {
    user: null,
    setUser: () => { return null },
    loadingUser: false,
    setLoadingUser: () => { return null },
    admin: null,
    setAdmin: () => { return null },
    loadingAdmin: false,
    setLoadingAdmin: () => { return null },
}

interface IContext {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    loadingUser: boolean;
    setLoadingUser: React.Dispatch<React.SetStateAction<boolean>>;
    admin: Admin | null;
    setAdmin: React.Dispatch<React.SetStateAction<Admin | null>>;
    loadingAdmin: boolean,
    setLoadingAdmin: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AuthContext = createContext<IContext>(initialState);