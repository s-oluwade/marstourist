import { useContext } from 'react';
import { Link } from 'react-router-dom';
import Friend from '../../components/Friend';
import { AuthContext } from '../../components/Providers/AuthContext';
import { UserContext } from '../../components/Providers/UserContext';
import InboxSubPage from './InboxPage';
import SettingsSubPage from './SettingsPage';
import UserHomeSubPage from './UserHomePage';

const homepaths = ['/profile/home', '/profile/home/', '/profile', '/profile/'];
const inboxpaths = ['/profile/inbox', '/profile/inbox/'];
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
    '/profile/settings/account/',
];

const ProfilePage = () => {
    const { user } = useContext(AuthContext);
    const { userAvatar, userNotifications } = useContext(UserContext);
    const currentPath = window.location.pathname;

    if (!user) {
        return '';
    }

    return (
        <div className='mx-auto mt-4 md:w-[50rem] lg:w-[70rem]'>
            <div className='flex w-full max-w-screen-xl overflow-x-hidden'>
                <div className='hidden md:block md:basis-1/4'>
                    <div
                        id='side-nav'
                        className='m-4 min-h-[48.75rem] min-w-[12rem] rounded-md border-2 border-accent bg-base-100 shadow-md dark:bg-gray-800'
                    >
                        <div
                            id='user_detail'
                            className='flex flex-col items-center justify-evenly pt-6'
                        >
                            <div
                                id='user_brief'
                                className='flex w-full flex-col items-center justify-center gap-2'
                            >
                                <div className='avatar'>
                                    <div className='mask mask-hexagon w-32'>
                                        <img src={userAvatar} />
                                    </div>
                                </div>
                                <div className='flex flex-col items-center gap-1 text-sm font-light'>
                                    <div>{user?.fullname}</div>
                                    {user?.username && <div className=''>{user?.username}</div>}
                                    <div className=''>{user?.email}</div>
                                </div>
                            </div>
                            <ul className='w-full py-6 text-sm'>
                                <li className='w-full border-b px-4 py-2 dark:border-b-gray-700'>
                                    <h6 className='mb-1 text-sm font-medium'>Location</h6>
                                    <p className='capitalize'>{user?.location || '_'}</p>
                                </li>
                                <li className='w-full border-b px-4 py-2 dark:border-b-gray-700'>
                                    <h6 className='mb-1 text-sm font-medium'>Bio</h6>
                                    <p>{user?.bio || '_'}</p>
                                </li>
                                <li className='w-full px-4 pt-6 dark:border-b-gray-700'>
                                    <p className=''>
                                        Credits: {user.credit ? user.credit.toFixed(3) : 0} MARS
                                    </p>
                                </li>
                            </ul>
                        </div>
                        <div id='user_menu' className='flex flex-col gap-2 pt-4'>
                            <h3 className='pl-6 text-xs'>MENU</h3>
                            <ul className='menu rounded'>
                                <li className='group dark:hover:bg-neutral'>
                                    <Link
                                        className={homepaths.includes(currentPath) ? 'active' : ''}
                                        to={'/profile/home'}
                                    >
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            fill='none'
                                            viewBox='0 0 24 24'
                                            strokeWidth={1.5}
                                            stroke='currentColor'
                                            className='h-5 w-5 group-hover:dark:text-neutral-content'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                d='M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25'
                                            />
                                        </svg>
                                        <span className='group-hover:dark:text-neutral-content'>
                                            Home
                                        </span>
                                    </Link>
                                </li>
                                <li className='group dark:hover:bg-neutral'>
                                    <Link
                                        className={inboxpaths.includes(currentPath) ? 'active' : ''}
                                        to={'/profile/inbox'}
                                    >
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            fill='none'
                                            viewBox='0 0 24 24'
                                            strokeWidth={1.5}
                                            stroke='currentColor'
                                            className='h-5 w-5 group-hover:dark:text-neutral-content'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                d='M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z'
                                            />
                                        </svg>
                                        <div className='indicator'>
                                            {(userNotifications.includes('purchase') ||
                                                userNotifications.includes('message') ||
                                                userNotifications.includes('update')) && (
                                                <span className='badge badge-outline indicator-item -right-10 top-2'>
                                                    new
                                                </span>
                                            )}
                                            <span className='group-hover:dark:text-neutral-content'>
                                                Inbox
                                            </span>
                                        </div>
                                    </Link>
                                </li>
                                <li className='group dark:hover:bg-neutral'>
                                    <Link
                                        className={
                                            settingspaths.includes(currentPath)
                                                ? 'active hover:bg-neutral'
                                                : ''
                                        }
                                        to={'/profile/settings'}
                                    >
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            fill='none'
                                            viewBox='0 0 24 24'
                                            strokeWidth={1.5}
                                            stroke='currentColor'
                                            className='h-5 w-5 group-hover:dark:text-neutral-content'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                d='M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z'
                                            />
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                                            />
                                        </svg>
                                        <span className='group-hover:dark:text-neutral-content'>
                                            Settings
                                        </span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className='m-4 rounded bg-base-300 lg:hidden'>
                            <h3 className='rounded-t-md p-4 text-sm font-normal'>
                                Friends ({user.friends ? user.friends.length : 0})
                            </h3>
                            <div className='p-1'>
                                {user.friends?.map((friend) => <Friend key={friend} id={friend} />)}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full md:basis-3/4'>
                    {homepaths.includes(currentPath) && <UserHomeSubPage />}
                    {settingspaths.includes(currentPath) && <SettingsSubPage />}
                    {inboxpaths.includes(currentPath) && <InboxSubPage />}
                </div>
            </div>
            <footer className='mb-4 mt-6 w-full bg-transparent'>
                <div className='w-full gap-6 pl-6 md:flex md:items-center md:justify-end'>
                    <span className='text-xs text-neutral/80 dark:text-neutral-content/90 sm:text-center'>
                        © 2023 Samuel Oluwade
                    </span>
                    <ul className='mt-3 flex flex-wrap items-center text-xs font-medium text-neutral/50 dark:text-neutral-content/90 sm:mt-0'>
                        <li>
                            <a
                                href='https://github.com/s-oluwade'
                                className='mr-4 hover:underline md:mr-6 '
                            >
                                Github
                            </a>
                        </li>
                    </ul>
                </div>
            </footer>
        </div>
    );
};

export default ProfilePage;
