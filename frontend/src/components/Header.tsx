import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { GlobalContext } from "./GlobalContext";
import { redirect } from "react-router-dom";

const Header = () => {
    const { userObject, loadingUser, setUserObject } = useContext(AuthContext);
    const { cartCounter } = useContext(GlobalContext);

    async function logout() {
        try {
            await axios.post('/users/logout')
            setUserObject(null)

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div className="navbar bg-base-100 border border-b-2 border-b-accent px-10">
                <div className="flex-1">
                    <a href="/" className="btn btn-ghost normal-case text-xl">
                        <img src="https://fontmeme.com/permalink/230607/b1e99c7dfba271de9a320c36e0342cae.png" width={150} alt="mass-effect-font" />
                        {/* <span className="font-chilanka uppercase font-bold text-lg">Mars Effect</span> */}
                    </a>
                </div>
                <div className="flex-none">
                    <ul className="menu menu-horizontal px-1">
                        <li><a href="guns-store">Buy Weapons</a></li>
                        {!loadingUser && !userObject &&
                            <>
                                <li><a href="/login">Log in</a></li>
                                <li><a href="/signup">Sign up</a></li>
                            </>
                        }
                    </ul>
                    <div className="form-control">
                        <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
                    </div>
                    {!loadingUser && userObject?.user &&
                        <>
                            <a id="cart-btn" href="/checkout">
                                <label tabIndex={0} className="btn btn-ghost btn-circle">
                                    <div className="indicator">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                        <span className="badge badge-sm indicator-item">{cartCounter}</span>
                                    </div>
                                </label>
                            </a>
                            <div className="dropdown dropdown-end">
                                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                                    <div className="w-10 rounded-full">
                                        <img src={userObject?.userData.photo ? `http://localhost:4000/${userObject?.userData?.photo}` : "http://localhost:4000/uploads/73-730154_open-default-profile-picture-png.png"} />
                                    </div>
                                </label>
                                <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                                    <li>
                                        <a className="justify-between" href="/profile">
                                            Profile
                                            <span className="badge">New</span>
                                        </a>
                                    </li>
                                    <li><a href="/account">Settings</a></li>
                                    <li><a onClick={logout}>Logout</a></li>
                                </ul>
                            </div>
                        </>
                    }
                </div>
            </div>
        </>
    );
}

export default Header;