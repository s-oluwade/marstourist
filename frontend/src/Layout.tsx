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
        const signOutAddresses = ['/', '/login', '/login', '/register', '/register/', 
        '/login/user', '/login/user/', '/login/admin', '/login/admin/', 
        '/register/user', '/register/user/', 
        '/register/admin', '/register/admin/', 
        '/forum', '/forum/'];

        // if not signed in, redirect to home page
        if (userSignedOut && adminSignedOut && !signOutAddresses.includes(currentPath)) {
            navigate("/");
        }

    }, [admin, currentPath, loadingAdmin, loadingUser, navigate, user]);

    return (
        <>
            {!loadingUser &&
                <>
                    <div className="drawer">
                        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
                        <div className="drawer-content flex flex-col min-h-screen">
                            
                        <Header />
                            <div className="bg-base-300 flex grow font-rubik font-light">
                                <Outlet />
                            </div>
                        </div>
                        <div className="drawer-side">
                            <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
                            <ul className="menu p-4 w-80 h-full bg-base-200">
                                {/* Sidebar content here */}
                                <li><a>Sidebar Item 1</a></li>
                                <li><a>Sidebar Item 2</a></li>
                            </ul>
                        </div>
                    </div>
                </>
            }
        </>
    );
}

export default Layout;