import { useContext, useEffect } from 'react';
import { Outlet, useNavigate } from "react-router";
import WebFont from 'webfontloader';
import { AuthContext } from './components/Providers/AuthContext';
import Header from './components/Header';

const Layout = () => {

    const { user, loadingUser, admin, loadingAdmin } = useContext(AuthContext);
    const currentPath = window.location.pathname;
    const DEFAULT_THEME = 'light';
    const navigate = useNavigate();
    
    useEffect(() => {
        WebFont.load({
            google: {
                families: ['Chilanka', 'Open Sans', 'Open Sans Condensed', 'Roboto',
                    'Roboto Slab', 'Montserrat', 'Raleway', 'Rubik:300,400,500,700']
            }
        })

        if (admin) {
            localStorage.setItem('themeStorage', 'luxury');
        }
        else {
            localStorage.setItem('themeStorage', 'light');
        }

        const theme = localStorage.getItem('themeStorage');
        if (theme) {
            document.documentElement.setAttribute('data-theme', theme);
        }
        else {
            document.documentElement.setAttribute('data-theme', DEFAULT_THEME);
        }

        const userSignedOut = !loadingUser && !user;
        const adminSignedOut = !loadingAdmin && !admin;
        const signOutAddresses = ['/', '/login', '/register', '/login/user', '/login/admin', '/register/user', '/register/admin', '/feeds'];

        // if not signed in, redirect to login page
        if (userSignedOut && adminSignedOut && !signOutAddresses.includes(currentPath)) {
            navigate("/login");
        }

    }, [admin, currentPath, loadingAdmin, loadingUser, navigate, user]);

    return (
        <>
            {!loadingUser &&
                <>
                    <div className={`flex flex-col min-h-screen`}>
                        <Header />
                        <div className="bg-base-300 flex grow font-rubik font-light">
                            <Outlet />
                        </div>
                    </div>
                </>
            }
        </>
    );
}

export default Layout;