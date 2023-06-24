import { createContext, useEffect, useState } from 'react';
import * as Api from "../network/api";
import { UserObject } from '../models/userObject';

const initialState = {
    userObject: null,
    setUserObject: () => { return null },
    loadingUser: true,
}

interface IContext {
    userObject: UserObject | null;
    setUserObject: React.Dispatch<React.SetStateAction<UserObject | null>>;
    loadingUser: boolean;
}

export const AuthContext = createContext<IContext>(initialState);

const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
    // eslint-disable-next-line prefer-const
    let [userObject, setUserObject] = useState<UserObject | null>(null);
    const [loadingUser, setLoadingUser] = useState<boolean>(true);

    useEffect(() => {
        // If user not found, 
        if (!userObject) {
            Api.getUser().then(res => {
                setUserObject(res);
            }).catch(err => {
                alert(err.message)
                console.log(err);
            }).finally(() => {
                setLoadingUser(false);
            });
        }
        else {
            setLoadingUser(false);
        }
    }, [userObject]);

    return (
        <AuthContext.Provider value={{ userObject, setUserObject, loadingUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContextProvider;