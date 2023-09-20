import { useContext } from 'react';
import { Link } from 'react-router-dom';
import Friend from '../../components/Friend';
import { AuthContext } from '../../components/Providers/AuthContextProvider';
import PurchaseSubPage from './PurchaseSubPage';
import SettingsSubPage from './SettingsSubPage';
import PostSubPage from './PostSubPage';
import FriendsSubPage from './FriendsSubPage';
import { UserContext } from '../../components/Providers/UserContextProvider';
import { GlobalContext } from '../../components/Providers/GlobalContextProvider';

const ProfilePage = () => {
    const { user } = useContext(AuthContext);
    const { userAvatar } = useContext(UserContext);
    const { allUsers } = useContext(GlobalContext);
    const currentPath = window.location.pathname;

    if (!user) {
        return '';
    }

    return (
        <div className='mx-auto w-full max-w-5xl'>
            <div className='mb-6 flex w-full max-w-screen-xl justify-center'>
                <div className='hidden md:block md:basis-1/3'>
                    <div
                        id='side-nav'
                        className='z-20 m-4 min-h-[50rem] min-w-[14rem] rounded-md bg-base-300 shadow-md dark:bg-gray-800'
                    >
                        <div
                            id='user_detail'
                            className='flex flex-col items-center justify-evenly pt-6'
                        >
                            <div
                                id='user_brief'
                                className='flex w-full flex-col items-center justify-center gap-6'
                            >
                                <Link to={user.photo} className='avatar'>
                                    <div className='w-32 rounded-full ring ring-accent ring-offset-4 ring-offset-base-100'>
                                        <img src={userAvatar} />
                                    </div>
                                </Link>
                                <div className='flex w-full flex-col gap-1 px-4 text-sm font-light'>
                                    <div>
                                        Name: <span className='font-medium'>{user?.fullname}</span>
                                    </div>
                                    <div>
                                        Username:{' '}
                                        <span className='font-medium'>{user?.username}</span>
                                    </div>
                                    <div>
                                        Email: <span className='font-medium'>{user?.email}</span>
                                    </div>
                                </div>
                            </div>
                            <ul className='w-full py-6 text-sm'>
                                <li className='w-full border-b px-4 py-2 dark:border-b-gray-700'>
                                    <h6 className='mb-1 bg-gray-300 text-sm font-medium dark:bg-gray-700'>
                                        Location
                                    </h6>
                                    <p className='capitalize'>{user?.location || '_'}</p>
                                </li>
                                <li className='w-full border-b px-4 py-2 dark:border-b-gray-700'>
                                    <h6 className='mb-1 bg-gray-300 text-sm font-medium dark:bg-gray-700'>
                                        Bio
                                    </h6>
                                    <p>{user?.bio || '_'}</p>
                                </li>
                                <li className='w-full px-4 pt-6 dark:border-b-gray-700'>
                                    <p>
                                        Credits:{' '}
                                        {user.credit ? (user.credit / 100).toFixed(2) : 0.0}
                                    </p>
                                </li>
                            </ul>
                        </div>
                        <div id='user_menu' className='flex flex-col gap-2 pt-4'>
                            <h3 className='pl-6 text-xs'>MENU</h3>
                            <ul className='menu gap-1 rounded'>
                                <li>
                                    <Link
                                        className={
                                            !currentPath.includes('friends') &&
                                            !currentPath.includes('purchase') &&
                                            !currentPath.includes('settings')
                                                ? 'active'
                                                : ''
                                        }
                                        to={'/profile/' + user.username}
                                    >
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            fill='none'
                                            viewBox='0 0 24 24'
                                            strokeWidth={1.5}
                                            stroke='currentColor'
                                            className='h-4 w-4'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                d='M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25'
                                            />
                                        </svg>
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className={
                                            currentPath.includes('friends')
                                                ? 'active hover:bg-neutral'
                                                : ''
                                        }
                                        to={`/profile/${user.username}/friends`}
                                    >
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            fill='none'
                                            viewBox='0 0 24 24'
                                            strokeWidth={1.5}
                                            stroke='currentColor'
                                            className='h-4 w-4'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                d='M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z'
                                            />
                                        </svg>
                                        Friends
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className={currentPath.includes('purchase') ? 'active' : ''}
                                        to={`/profile/${user.username}/purchase`}
                                    >
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            fill='none'
                                            viewBox='0 0 24 24'
                                            strokeWidth={1.5}
                                            stroke='currentColor'
                                            className='h-4 w-4 group-hover:dark:text-neutral-content'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                d='M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z'
                                            />
                                        </svg>
                                        Purchased Items
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className={
                                            currentPath.includes('settings')
                                                ? 'active hover:bg-neutral'
                                                : ''
                                        }
                                        to={`/profile/${user.username}/settings`}
                                    >
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            fill='none'
                                            viewBox='0 0 24 24'
                                            strokeWidth={1.5}
                                            stroke='currentColor'
                                            className='h-4 w-4'
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
                                        Settings
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className='m-4 rounded lg:hidden'>
                            <h3 className='rounded-t-md p-4 text-sm font-normal'>
                                Friends ({user.friends?.length ?? 0})
                            </h3>
                            <div className='p-1'>
                                {user.friends?.map((friend) => (
                                    <Friend
                                        key={friend.userId}
                                        peer={allUsers.filter((each) => each._id === friend.userId)[0]}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full md:basis-2/3'>
                    {currentPath.includes('settings') ? (
                        <SettingsSubPage />
                    ) : currentPath.includes('purchase') ? (
                        <PurchaseSubPage />
                    ) : currentPath.includes('friends') ? (
                        <FriendsSubPage />
                    ) : (
                        <PostSubPage />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
