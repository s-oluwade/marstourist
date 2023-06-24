import { useContext, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from "react-router";
import WebFont from 'webfontloader';
import { AuthContext } from './components/AuthContext';
import Header from './components/Header';

const Layout = () => {

    const { userObject, loadingUser } = useContext(AuthContext);
    const path = useLocation().pathname;
    const DEFAULT_THEME = 'light';

    useEffect(() => {
        WebFont.load({
            google: {
                families: ['Chilanka', 'Open Sans', 'Open Sans Condensed', 'Roboto',
                    'Roboto Slab', 'Montserrat', 'Raleway', 'Rubik']
            }
        });

        const theme = localStorage.getItem('themeStorage');
        if (theme) {
            document.documentElement.setAttribute('data-theme', theme);
        }
        else {
            document.documentElement.setAttribute('data-theme', DEFAULT_THEME);
        }

        localStorage.setItem('defaultThemeStorage', DEFAULT_THEME);
    }, []);

    // if user is not signed in, only allow visit to login and register
    if (!loadingUser && !userObject && path !== '/login' && path !== '/signup' && path !== '/') {
        return <Navigate to={'/login'} />
    }

    return (
        <>
            {!loadingUser &&
                <>
                    {/* theme-red provides variables for theme-dark 
                    which provides variable for bg-primaryBg */}
                    {/* mode-${mode} theme-${color} bg-neutralBg text-onNeutralBg */}
                    <div className={`flex flex-col min-h-screen`}>
                        <Header />
                        <div id="wrap" className="text-sm flex justify-center grow">
                            <Outlet />
                        </div>
                    </div>
                </>
            }
        </>
    );
}

export default Layout;