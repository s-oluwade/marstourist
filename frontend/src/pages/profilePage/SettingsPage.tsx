import { Link, useParams } from 'react-router-dom';
import AccountSubPage from './settingsTabs/AccountTab';
import EditProfileSubPage from './settingsTabs/EditProfileTab';
import GeneralSubPage from './settingsTabs/GeneralTab';
import PasswordSubPage from './settingsTabs/PasswordTab';

export default function SettingsSubPage() {
    const { subpage } = useParams();

    let subtitle = 'Edit Profile';
    switch (subpage) {
        case 'general':
            subtitle = 'General';
            break;
        case 'edit-profile':
            subtitle = 'Edit Profile';
            break;
        case 'password':
            subtitle = 'Password';
            break;
        case 'account':
            subtitle = 'Account';
            break;
        default:
            break;
    }

    return (
        <div className='py-8'>
            <div className='flex items-center justify-center pt-8'>
                <h1 className='flex h-full w-full items-center justify-center gap-4 text-2xl py-4'>
                    <span>Settings</span>|<span className='underline'>{subtitle}</span>
                </h1>
            </div>
            <hr className='my-8 h-px border-0 bg-neutral/50 dark:bg-gray-700' />
            <div className='flex flex-col items-center justify-center gap-10'>
                <div id='profile-submenu' className='tabs font-bold'>
                    <Link
                        className={`tab-bordered tab ${
                            subpage === 'general' ? 'tab-active' : ''
                        }`}
                        to='/profile/settings/general'
                    >
                        General
                    </Link>
                    <Link
                        className={`tab-bordered tab ${
                            ['edit-profile', undefined].includes(subpage) ? 'tab-active' : ''
                        }`}
                        to='/profile/settings/edit-profile'
                    >
                        Edit Profile
                    </Link>
                    <Link
                        className={`tab-bordered tab ${
                            subpage === 'password' ? 'tab-active' : ''
                        }`}
                        to='/profile/settings/password'
                    >
                        Password
                    </Link>
                    <Link
                        className={`tab-bordered tab ${
                            subpage === 'account' ? 'tab-active' : ''
                        }`}
                        to='/profile/settings/account'
                    >
                        Account
                    </Link>
                </div>
                <div className='w-80 px-10'>
                    {subtitle == 'General' && <GeneralSubPage />}
                    {subtitle == 'Edit Profile' && <EditProfileSubPage />}
                    {subtitle == 'Password' && <PasswordSubPage />}
                    {subtitle == 'Account' && <AccountSubPage />}
                </div>
            </div>
        </div>
    );
}
