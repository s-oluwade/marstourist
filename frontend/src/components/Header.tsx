import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './Providers/AuthContextProvider';
import { UserContext } from './Providers/UserContextProvider';

const Header = () => {
    const browserIsDarkMode =
        window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    const { user, admin } = useContext(AuthContext);
    const { cart, userAvatar, userNotifications } = useContext(UserContext);
    const [logout, setLogout] = useState(false);
    const [darkMode, setDarkMode] = useState(browserIsDarkMode);
    const [userPreferedMode, setUserPreferedMode] = useState<string | null>(null);

    const [visitorInfo, setVisitorInfo] = useState<any>(null);

    useEffect(() => {
        if (logout) {
            setLogout(false);
            if (admin) {
                adminLogout();
            } else {
                userLogout();
            }
        }
        async function userLogout() {
            try {
                await axios.post('/user/logout');
                window.location.reload();
                // setUser(null);
            } catch (error) {
                console.log(error);
            }
        }
        async function adminLogout() {
            try {
                await axios.post('/admin/logout');
                window.location.reload();
                // setAdmin(null);
            } catch (error) {
                console.log(error);
            }
        }

        // fetch("https://ipapi.co/json/")
        //     .then(response => response.json())
        //     .then((responseJson => {
        //         if (JSON.stringify(responseJson) !== JSON.stringify(visitorInfo)){
        //             setVisitorInfo(responseJson);
        //         }
        //     }));

        // will use local storage to remember user's preference in future
        if (userPreferedMode) {
            // remove mode class
            document.documentElement.classList.remove('light');
            document.documentElement.classList.remove('dark');

            document.documentElement.classList.add(userPreferedMode);
        } else {
            if (browserIsDarkMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.add('light');
            }
        }
    }, [admin, logout, userPreferedMode]);

    useEffect(() => {
        if (visitorInfo) {
            axios
                .post(
                    '/visitor',
                    { visitor: visitorInfo },
                    { headers: { 'Content-Type': 'application/json' } }
                )
                .then(() => {
                    setVisitorInfo(null);
                });
        }
    }, [visitorInfo]);

    return (
        <>
            <div className={`navbar relative z-10 w-full border border-b-2 border-b-accent bg-base-100 ${admin? '':'dark:bg-gray-900 dark:text-base-100'}`}>
                <div className='flex-none md:hidden'>
                    <div className='indicator'>
                        {cart && cart.products['total'] && cart.products['total'].count > 0 && (
                            <span className='badge badge-secondary badge-xs indicator-item right-2 top-2'></span>
                        )}
                        <label htmlFor='my-drawer-3' className='btn-ghost btn-square btn-sm btn'>
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                                className='inline-block h-6 w-6 stroke-current'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='M4 6h16M4 12h16M4 18h16'
                                ></path>
                            </svg>
                        </label>
                    </div>
                </div>
                <div className='flex-1'>
                    <Link to='/' className='btn-ghost btn text-xl normal-case'>
                        <img
                            className='w-[64vw] max-w-[20rem]'
                            src='https://fontmeme.com/permalink/230708/6b945069c771cf0931a7814ea2e154d5.png'
                            alt='mass-effect-font'
                        />
                    </Link>
                </div>
                {admin && (
                    <div className='flex-1 justify-self-start'>
                        <Link to='/dashboard'>
                            <button className='btn-accent btn-sm btn rounded-none'>
                                Dashboard
                            </button>
                        </Link>
                    </div>
                )}
                <label className='swap swap-rotate mx-4'>
                    {/* this hidden checkbox controls the state */}
                    <input
                        type='checkbox'
                        checked={darkMode}
                        onChange={() => {
                            const mode = !darkMode; // toggle dark mode
                            if (mode) {
                                setUserPreferedMode('dark');
                            } else {
                                setUserPreferedMode('light');
                            }
                            setDarkMode(mode);
                        }}
                    />

                    {/* sun icon */}
                    <svg
                        className='swap-on h-6 w-6 fill-current'
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                    >
                        <path d='M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z' />
                    </svg>

                    {/* moon icon */}
                    <svg
                        className='swap-off h-6 w-6 fill-current'
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                    >
                        <path d='M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z' />
                    </svg>
                </label>
                <div className='hidden flex-none gap-4 md:flex'>
                    {user && (
                        <>
                            <ul className='flex flex-nowrap gap-6 px-4 text-sm'>
                                <li>
                                    <Link className='uppercase' to='/forum'>
                                        Forum
                                    </Link>
                                </li>
                                <li>
                                    <Link className='uppercase' to='/store'>
                                        Shop
                                    </Link>
                                </li>
                            </ul>
                            <Link id='cart-btn' to='/cart'>
                                <label tabIndex={0} className='btn-ghost btn-circle btn'>
                                    <div className='indicator'>
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            className='h-5 w-5'
                                            fill='none'
                                            viewBox='0 0 24 24'
                                            stroke='currentColor'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth='2'
                                                d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
                                            />
                                        </svg>
                                        <span className='badge badge-sm indicator-item font-medium'>
                                            {cart &&
                                                cart.products['total'] &&
                                                cart.products['total'].count}
                                        </span>
                                    </div>
                                </label>
                            </Link>
                            <div className='dropdown-end dropdown'>
                                <div className='indicator'>
                                    {userNotifications.length > 0 && (
                                        <span className='badge badge-secondary badge-sm indicator-item right-2 top-2'></span>
                                    )}
                                    <label tabIndex={0} className='btn-circle avatar btn'>
                                        <div className='w-10 rounded-full ring ring-neutral ring-offset-2 ring-offset-base-100'>
                                            <img src={userAvatar} />
                                        </div>
                                    </label>
                                </div>
                                <ul
                                    tabIndex={0}
                                    className='dropdown-content menu menu-sm z-[1] mt-3 w-36 gap-1 rounded bg-base-100 p-2 text-neutral shadow'
                                >
                                    <li>
                                        <Link to='/profile' className='flex justify-between'>
                                            Profile
                                            {/* <div className="badge badge-sm badge-outline">new</div> */}
                                            <svg
                                                xmlns='http://www.w3.org/2000/svg'
                                                fill='none'
                                                viewBox='0 0 24 24'
                                                strokeWidth={1.5}
                                                stroke='currentColor'
                                                className='h-5 w-5'
                                            >
                                                <path
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    d='M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z'
                                                />
                                            </svg>
                                        </Link>
                                    </li>
                                    <li>
                                        <a
                                            onClick={() => {
                                                setLogout(true);
                                            }}
                                            className='flex justify-between'
                                        >
                                            Logout
                                            <svg
                                                xmlns='http://www.w3.org/2000/svg'
                                                fill='none'
                                                viewBox='0 0 24 24'
                                                strokeWidth={1.5}
                                                stroke='currentColor'
                                                className='h-5 w-5'
                                            >
                                                <path
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    d='M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75'
                                                />
                                            </svg>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </>
                    )}
                    {admin && (
                        <div className='flex items-center'>
                            <ul className='flex flex-nowrap gap-6 px-4 text-sm'>
                                <li>
                                    <Link className='uppercase' to='/forum'>
                                        Forum
                                    </Link>
                                </li>
                                <li>
                                    <Link className='uppercase' to='/store'>
                                        Shop
                                    </Link>
                                </li>
                            </ul>
                            <div className='dropdown-end dropdown'>
                                Admin
                                <label tabIndex={0} className='btn-neutral btn-circle avatar btn'>
                                    <div className='w-10 rounded-full'>
                                        <img src={userAvatar} />
                                    </div>
                                </label>
                                <ul
                                    tabIndex={0}
                                    className='dropdown-content menu rounded-box menu-xs z-[1] mt-3 w-28 gap-1 bg-base-100 p-2 shadow'
                                >
                                    <li>
                                        <Link to='/dashboard'>Dashboard</Link>
                                    </li>
                                    <li>
                                        <a
                                            onClick={() => {
                                                setLogout(true);
                                            }}
                                        >
                                            Logout
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            </div>
                    )}
                    {!user && !admin && (
                        <ul className='flex flex-nowrap gap-6 px-4 text-sm'>
                            <li>
                                <Link to='/forum'>Forum</Link>
                            </li>
                            <li>
                                <Link to='/login'>Sign in</Link>
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
};

export default Header;
