import { useContext } from "react";
import { AuthContext } from "../../components/Providers/AuthContext";
import { Link } from "react-router-dom";
import SettingsSubPage from "./SettingsSubPage";
import UserHomeSubPage from "./UserHomeSubPage";
import PurchasedSubPage from "./PurchasedSubPage";

const homepaths = ['/profile/home', '/profile/home/', '/profile', '/profile/'];
const purchasedpaths = ['/profile/purchased', '/profile/purchased/'];
const settingspaths = [
    '/profile/settings',
    '/profile/settings/',
    '/profile/settings/general',
    '/profile/settings/general/',
    '/profile/settings/edit-profile',
    '/profile/settings/edit-profile/',
    '/profile/settings/password',
    '/profile/settings/password/',
    '/profile/settings/account',
    '/profile/settings/account/'];

const ProfilePage = () => {
    const { user } = useContext(AuthContext);
    const currentPath = window.location.pathname;

    return (
        <div className="flex w-full justify-center pt-2">
            <div className="grid grid-cols-7 w-full max-w-screen-xl">
                <div className="col-span-2">
                    <div id="side-nav" className="bg-base-100 m-4 rounded-md shadow-md min-h-[800px] border-2 border-accent">
                        <div id="user_detail" className="flex flex-col items-center justify-evenly pt-6">
                            <div id="user_brief" className="flex flex-col w-full justify-center gap-2 items-center">
                                <div className="avatar">
                                    <div className="w-32 mask mask-hexagon">
                                        <img src={user?.photo ? `http://localhost:4000/${user?.photo}` : "http://localhost:4000/uploads/73-730154_open-default-profile-picture-png.png"} />
                                    </div>
                                </div>
                                <div className="flex flex-col text-sm gap-1 items-center font-light">
                                    <div>{user?.fullname}</div>
                                    {user?.username && <div className="">{user?.username}</div>}
                                    <div className="">{user?.email}</div>
                                </div>
                            </div>

                            <ul className="py-6 text-sm w-full">
                                <li className="w-full px-4 py-2 border-b">
                                    <h6 className="text-sm font-medium mb-1">Location</h6>
                                    <p className="capitalize">{user?.location || "_"}</p>
                                </li>
                                <li className="w-full px-4 py-2 border-b">
                                    <h6 className="text-sm font-medium mb-1">Bio</h6>
                                    <p>{user?.bio || "_"}</p>
                                </li>
                            </ul>
                        </div>
                        <div id="user_menu" className="flex flex-col gap-2 pt-4">
                            <h3 className="text-xs pl-6">MENU</h3>
                            <ul className="menu rounded">
                                <li>
                                    <Link className={homepaths.includes(currentPath) ? "active" : ""} to={'/profile/home'}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                        </svg>
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link className={purchasedpaths.includes(currentPath) ? "active" : ""} to={'/profile/purchased'}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Purchased
                                    </Link>
                                </li>
                                <li>
                                    <Link className={settingspaths.includes(currentPath) ? "active hover:bg-neutral" : ""} to={'/profile/settings'}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Settings
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
                <div className="col-start-3 col-span-5 m-4">
                    {homepaths.includes(currentPath) && <UserHomeSubPage />}
                    {settingspaths.includes(currentPath) && <SettingsSubPage />}
                    {purchasedpaths.includes(currentPath) && <PurchasedSubPage />}
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;