import { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../../components/Providers/AuthContext";
import AccountSubPage from "./settingsTabs/AccountTab";
import EditProfileSubPage from "./settingsTabs/EditProfileTab";
import GeneralSubPage from "./settingsTabs/GeneralTab";
import PasswordSubPage from "./settingsTabs/PasswordTab";
import { UserContext } from "../../components/Providers/UserContext";

export default function SettingsSubPage() {
    const { user } = useContext(AuthContext);
    const { userAvatar } = useContext(UserContext);
    const { subpage } = useParams();

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
        case "account":
            subtitle = "Account";
            break;
        default:
            break;
    }

    return (
        <div className="m-4 rounded-md py-8">
            <div className="flex items-center justify-center py-4">
                <div className="flex">
                    <Link to="#" className="">
                        <img className="w-32 h-32 border-2 rounded-full" alt={user?.fullname || ""} src={userAvatar} />
                    </Link>
                    <div className="ml-8 flex flex-col gap-4 w-72 h-32 items-center">
                        <h1 className="text-2xl flex gap-4 items-center justify-center w-full h-full">
                            <span>Settings</span> | <span className="underline">{subtitle}</span>
                        </h1>
                    </div>
                </div>
            </div>
            <hr />
            <div className="grid grid-cols-5 pt-10 px-15">
                <ul id="profile-submenu" className="col-start-2 px-4">
                    <li><Link className={subpage === "general" ? "font-medium" : ""} to="/profile/settings/general">General</Link></li>
                    <li><Link className={["edit-profile", undefined].includes(subpage) ? "font-medium" : ""} to="/profile/settings/edit-profile">Edit Profile</Link></li>
                    <li><Link className={subpage === "password" ? "font-medium" : ""} to="/profile/settings/password">Password</Link></li>
                    <li><Link className={subpage === "account" ? "font-medium" : ""} to="/profile/settings/account">Account</Link></li>
                </ul>
                <div className="col-span-2 col-start-3 px-10">
                    {subtitle == "General" && <GeneralSubPage />}
                    {subtitle == "Edit Profile" && <EditProfileSubPage />}
                    {subtitle == "Password" && <PasswordSubPage />}
                    {subtitle == "Account" && <AccountSubPage />}
                </div>
            </div>
        </div>
    );
}
