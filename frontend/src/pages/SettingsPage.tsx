import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import EditProfileSubPage from "./EditProfileSubPage";
import GeneralSubPage from "./GeneralSubPage";
import PasswordSubPage from "./PasswordSubPage";
import SettingsSubPage from "./AccountSettingsSubPage";
import ThemeSubPage from "./ThemeSubPage";
import axios from "axios";

export default function SettingsPage() {
    const { userObject } = useContext(AuthContext);
    const { subpage } = useParams();
    const [races, setRaces] = useState<{ id: number; name: string }[]>([]);
    const [regions, setRegions] = useState<{ id: number; name: string }[]>([]);
    const [origins, setOrigins] = useState<{ id: number; name: string }[]>([]);
    const [loadingData, setLoadingData] = useState<boolean>(true);

    let subtitle = "Edit Profile";
    switch (subpage) {
        case "general":
            subtitle = "General";
            break;
        case "edit-profile":
            subtitle = "Edit Profile";
            break;
        case "password":
            subtitle = "Password";
            break;
        case "theme":
            subtitle = "Theme";
            break;
        case "account-settings":
            subtitle = "Account Settings";
            break;
        default:
            break;
    }

    useEffect(() => {
        async function loadData() {
            const { data } = await axios.get('/data/siteData');

            const g = (data.races as string[]).map((key, index) => {
                return { id: index + 1, name: key.toUpperCase() }
            });
            const r = (data.regions as string[]).map((key, index) => {
                return { id: index + 1, name: key.toUpperCase() }
            });
            const o = Object.keys(data.planetary_bodies).map((key, index) => {
                return { id: index + 1, name: key.toUpperCase() }
            });

            g.splice(0, 0, { id: 0, name: "unspecified" });
            r.splice(0, 0, { id: 0, name: "unspecified" });
            o.splice(0, 0, { id: 0, name: "unspecified" });

            setRaces(g);
            setRegions(r);
            setOrigins(o);
            setLoadingData(false);
        }
        loadData();
    }, []);

    return (
        <div id="account-page">
            <div className="content">
                <div className="flex items-center justify-center py-8">
                    <div className="flex">
                        <Link to="/profile" className="">
                            <img className="w-32 h-32 border-2 rounded-full" alt={userObject?.user.fullname || ""} src={userObject?.userData.photo ? `http://localhost:4000/${userObject?.userData?.photo}` : "http://localhost:4000/uploads/73-730154_open-default-profile-picture-png.png"} />
                        </Link>
                        <div className="ml-8 flex flex-col gap-4 w-72 h-32 items-center">
                            <h1 className="text-2xl flex gap-4 items-center justify-center w-full h-full">
                                <span>{userObject?.user.fullname}</span> | <span className="underline italic">{subtitle}</span>
                            </h1>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="grid grid-cols-5 pt-10 px-15">
                    <ul id="profile-submenu" className="col-start-2 px-4">
                        <li className="separator"></li>
                        <li><Link className={subpage === "general" ? "font-bold" : ""} to="general">General</Link></li>
                        <li><Link className={subpage === "edit-profile" ? "font-bold" : ""} to="edit-profile">Edit Profile</Link></li>
                        <li><Link className={subpage === "password" ? "font-bold" : ""} to="password">Password</Link></li>
                        <li><Link className={subpage === "theme" ? "font-bold" : ""} to="theme">Theme</Link></li>
                        <li><Link className={subpage === "settings" ? "font-bold" : ""} to="settings">Settings</Link></li>
                        <li className="separator"></li>
                    </ul>
                    <div className="col-span-2 col-start-3 px-10">
                        {!loadingData &&
                            <>
                                {subtitle == "General" && <GeneralSubPage />}
                                {subtitle == "Edit Profile" && <EditProfileSubPage races={races} regions={regions} origins={origins} />}
                                {subtitle == "Password" && <PasswordSubPage />}
                                {subtitle == "Theme" && <ThemeSubPage />}
                                {subtitle == "Settings" && <SettingsSubPage />}
                            </>
                        }

                    </div>
                </div>
            </div>
        </div>
    );
}
