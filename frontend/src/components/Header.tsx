import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./Providers/AuthContext";
import { GlobalContext } from "./Providers/GlobalContext";

const Header = () => {
    const { user, setUser, admin } = useContext(AuthContext);
    const { cart } = useContext(GlobalContext);
    const [logout, setLogout] = useState(false);

    useEffect(() => {
        if (logout) {
            setLogout(false);
            if (admin) {
                adminLogout();
            }
            else {
                userLogout();
            }
        }
        async function userLogout() {
            try {
                await axios.post('/user/logout');
                setUser(null);
            } catch (error) {
                console.log(error);
            }
        }
        async function adminLogout() {
            try {
                await axios.post('/admin/logout');
                setUser(null);
                window.location.reload();
            } catch (error) {
                console.log(error);
            }
        }
    }, [admin, logout, setUser])

    function isStorePage() {
        const storepath = '/store';
        const currentPath = window.location.pathname;

        return currentPath.slice(0, storepath.length) === storepath;
    }

    return (
        <div className="">
            <div className="navbar bg-base-100 border border-b-2 border-b-accent">
                <div className="flex-1">
                    <Link to="/" className="btn btn-ghost normal-case text-xl">
                        {/* <img src="https://fontmeme.com/permalink/230702/6197e7e7e930e3bcb60d8607d05d2b4f.png" width={150} alt="mass-effect-font" /> */}
                        <img src="https://fontmeme.com/permalink/230708/6b945069c771cf0931a7814ea2e154d5.png" width={300} alt="mass-effect-font" />
                    </Link>
                </div>
                {admin &&
                    <div className="justify-self-start flex-1">
                        <Link to='/dashboard'>
                            <button className="btn btn-accent btn-sm rounded-none">Dashboard</button>
                        </Link>
                    </div>
                }
                <div className="flex-none gap-4">
                    {user ?
                        <>
                            <ul className="menu menu-horizontal p-0 flex-nowrap gap-2">
                                <li><Link to="/feeds">Feeds</Link></li>
                                <li><Link to="/store">Store</Link></li>
                            </ul>
                            <div className="badge">
                                <span className="font-semibold font-chilanka">Credit: &nbsp;{user.credit ? user.credit.toFixed(3) : 0} mrs</span>
                            </div>
                            <Link id="cart-btn" to="/cart">
                                <label tabIndex={0} className="btn btn-ghost btn-circle">
                                    <div className="indicator">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                        <span className="badge badge-sm indicator-item">
                                            {cart && cart.products["total"].count}
                                        </span>
                                    </div>
                                </label>
                            </Link>
                            <div className="dropdown dropdown-end">
                                <div className="indicator">
                                    <span className="indicator-item badge badge-sm badge-secondary right-2 top-2"></span>
                                    <label tabIndex={0} className="btn btn-circle avatar">
                                        <div className="w-10 rounded-full ring ring-neutral ring-offset-base-100 ring-offset-2">
                                            <img src={user?.photo ? `http://localhost:4000/${user?.photo}` : "http://localhost:4000/uploads/73-730154_open-default-profile-picture-png.png"} />
                                        </div>
                                    </label>
                                </div>
                                <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 w-36 gap-1 rounded">
                                    <li>
                                        <Link to="/profile" className="flex justify-between">
                                            Profile
                                            <div className="badge badge-sm badge-outline">new</div>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </Link>
                                    </li>
                                    <li>
                                        <a onClick={() => { setLogout(true) }} className="flex justify-between">
                                            Logout
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                                            </svg>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </> :
                        <ul className="menu menu-horizontal p-0 flex-nowrap">
                            <li><Link to="/feeds">Feeds</Link></li>
                            <li><Link to="/store">Store</Link></li>
                            <li><Link to='/login'>Sign in</Link></li>
                        </ul>
                    }
                    {admin &&
                        <div className="dropdown dropdown-end">
                            Admin
                            <label tabIndex={0} className="btn btn-neutral btn-circle avatar">
                                <div className="w-10 rounded-full">
                                    <img src="http://localhost:4000/uploads/73-730154_open-default-profile-picture-png.png" />
                                </div>
                            </label>
                            <ul tabIndex={0} className="menu menu-xs dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-28 gap-1">
                                <li><Link to="/dashboard">Dashboard</Link></li>
                                <li><a onClick={() => { setLogout(true) }}>Logout</a></li>
                            </ul>
                        </div>
                    }
                </div>
            </div>
            {isStorePage() &&
                <>
                    <div className="flex justify-between items-center h-10 pl-4">
                        <div className="text-sm breadcrumbs">
                            <ul>
                                <li>
                                    <Link to="/">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                                        Home
                                    </Link>
                                </li>
                                <li><a>Documents</a></li>
                                <li>Add Document</li>
                            </ul>
                        </div>
                        <div className="join">
                            <div>
                                <div>
                                    <input className="input input-bordered input-sm join-item focus:outline-none" placeholder="Search..." />
                                </div>
                            </div>
                            <select name="search" defaultValue='all' className="select select-bordered select-sm join-item focus:outline-none">
                                <option>All</option>
                                <option disabled>Movies</option>
                                <option>Sci-fi</option>
                                <option>Drama</option>
                                <option>Action</option>
                                <option disabled>Clothing</option>
                                <option>Tops</option>
                                <option>Shorts</option>
                                <option>Shoes</option>
                            </select>
                            <div className="indicator">
                                <button className="btn btn-sm join-item">Search</button>
                            </div>
                        </div>
                    </div>
                </>
            }
        </div>
    );
}

export default Header;