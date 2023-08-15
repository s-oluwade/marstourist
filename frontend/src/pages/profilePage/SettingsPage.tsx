import { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../../components/Providers/AuthContextProvider";
import AccountSubPage from "./settingsTabs/AccountTab";
import EditProfileSubPage from "./settingsTabs/EditProfileTab";
import GeneralSubPage from "./settingsTabs/GeneralTab";
import PasswordSubPage from "./settingsTabs/PasswordTab";
import { UserContext } from "../../components/Providers/UserContextProvider";

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
        <div className="mt-8 py-8">
            <div className="flex items-center justify-center py-4">
                <div className="flex">
                    <Link to="#" className="">
                        <img className="w-32 border-2 rounded-full" alt={user?.fullname || ""} src={userAvatar} />
                    </Link>
                    <div className="ml-8 flex flex-col gap-4 w-72 h-32 items-center">
                        <h1 className="text-2xl flex gap-4 items-center justify-center w-full h-full">
                            <span>Settings</span> | <span className="underline">{subtitle}</span>
                        </h1>
                    </div>
                </div>
            </div>
            <hr className="h-px my-8 bg-neutral/50 border-0 dark:bg-gray-700"/>
            <div className="flex flex-col gap-10 md:flex-row justify-center">
                <ul id="profile-submenu" className="px-4 md:w-40 flex gap-4 md:block">
                    <li><Link className={subpage === "general" ? "font-medium text-accent" : ""} to="/profile/settings/general">General</Link></li>
                    <li><Link className={["edit-profile", undefined].includes(subpage) ? "font-medium dark:text-accent" : ""} to="/profile/settings/edit-profile">Edit Profile</Link></li>
                    <li><Link className={subpage === "password" ? "font-medium text-accent" : ""} to="/profile/settings/password">Password</Link></li>
                    <li><Link className={subpage === "account" ? "font-medium text-accent" : ""} to="/profile/settings/account">Account</Link></li>
                </ul>
                <div className="px-10 w-80">
                    {subtitle == "General" && <GeneralSubPage />}
                    {subtitle == "Edit Profile" && <EditProfileSubPage />}
                    {subtitle == "Password" && <PasswordSubPage />}
                    {subtitle == "Account" && <AccountSubPage />}
                </div>
            </div>
        </div>
    );
}
