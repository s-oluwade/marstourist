import { useContext, useEffect } from 'react';
import { GlobalContext } from '../components/Providers/GlobalContextProvider';
import axios from 'axios';
import { getWhen } from '../utils/helpers';
import { Activity } from '../models/activity';
import { AuthContext } from '../components/Providers/AuthContextProvider';
import { UserContext } from '../components/Providers/UserContextProvider';

const rootURL = import.meta.env.VITE_API_ROOT_URL;
const defaultPhotoURL = `${rootURL}/avatar_placeholder.png`;

const ActivitiesPage = () => {
    const { activities, setActivities } = useContext(GlobalContext);
    const { user } = useContext(AuthContext);
    const {userPosts, setUserPosts} = useContext(UserContext)

    useEffect(() => {
        axios
            .get<Activity[]>('/activities')
            .then((response) => {
                const data = response.data;
                data.sort((a, b) =>
                    new Date(a.createdAt).getTime() < new Date(b.createdAt).getTime()
                        ? 1
                        : new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime()
                        ? -1
                        : 0
                );
                setActivities(data);
            })
            .catch((error) => {
                setActivities([]);
                console.log(error);
            });
    }, [setActivities]);

    async function likePost(id: string) {
        const { data } = await axios.put<Activity | null>('/activities/posts/like/' + id);

        if (data) {
            const allPostsUpdate = activities.filter((each) => each._id !== data._id);
            allPostsUpdate.push(data);
            allPostsUpdate.sort((a, b) =>
                new Date(a.createdAt).getTime() < new Date(b.createdAt).getTime()
                    ? 1
                    : new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime()
                    ? -1
                    : 0
            );

            if (data.userId === user?._id) {
                const userPostsUpdate = userPosts.filter((each) => each._id !== data._id);
                userPostsUpdate.push(data);
                userPostsUpdate.sort((a, b) =>
                    new Date(a.createdAt).getTime() < new Date(b.createdAt).getTime()
                        ? 1
                        : new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime()
                        ? -1
                        : 0
                );
                setUserPosts([...userPostsUpdate]);
            }

            setActivities([...allPostsUpdate]);
        }
    }

    function isLikedPost(post: Activity) {
        if (user) {
            return post.likes.map((like) => like.userId).includes(user._id);
        }
        return false;
    }

    return (
        <div className='mx-16'>
            <div className='mt-6 flex flex-col'>
                <ol className={`relative`}>
                    {activities.map((activity, index) =>
                        activity.activityType === 'post' ? (
                            <li
                                className={`pb-10 ${
                                    index + 1 === activities.length
                                        ? ''
                                        : 'border-l border-gray-200 dark:border-gray-700'
                                }`}
                            >
                                <div className={`ml-6`}>
                                    <span
                                        className='absolute -left-3 z-10 flex h-6 w-6 items-center 
                                justify-center rounded-full bg-blue-100 ring-8 ring-white 
                                dark:bg-blue-900 dark:ring-gray-900'
                                    >
                                        <img
                                            className='rounded-full shadow-lg'
                                            src={activity.thumbnail ?? defaultPhotoURL}
                                            alt={activity.owner + ' image'}
                                        />
                                    </span>
                                    <div className='rounded-lg border border-gray-200 bg-gray-300 p-4 shadow-sm dark:border-gray-600 dark:bg-gray-700'>
                                        <div className='mb-3 items-center justify-between sm:flex'>
                                            <time className='mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0'>
                                                {getWhen(activity)}
                                            </time>
                                            <div className='text-sm font-light text-gray-500 dark:text-gray-300'>
                                                <span className='font-medium capitalize text-accent'>
                                                    {activity.owner}
                                                </span>{' '}
                                                commented about{' '}
                                                <a
                                                    href='#'
                                                    className='capitalize italic text-gray-900 hover:underline dark:text-accent'
                                                >
                                                    {activity.topic}
                                                </a>
                                                {' from '}
                                                {activity.currentLocation.toLowerCase() ===
                                                'mars' ? (
                                                    'somewhere on the Red Planet'
                                                ) : (
                                                    <span className='capitalize text-info'>
                                                        {activity.currentLocation}
                                                        <svg
                                                            xmlns='http://www.w3.org/2000/svg'
                                                            height='1em'
                                                            className='mx-2 inline-block'
                                                            viewBox='0 0 384 512'
                                                        >
                                                            <path d='M32 32C32 14.3 46.3 0 64 0H320c17.7 0 32 14.3 32 32s-14.3 32-32 32H290.5l11.4 148.2c36.7 19.9 65.7 53.2 79.5 94.7l1 3c3.3 9.8 1.6 20.5-4.4 28.8s-15.7 13.3-26 13.3H32c-10.3 0-19.9-4.9-26-13.3s-7.7-19.1-4.4-28.8l1-3c13.8-41.5 42.8-74.8 79.5-94.7L93.5 64H64C46.3 64 32 49.7 32 32zM160 384h64v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V384z' />
                                                        </svg>
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className='flex rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs font-normal italic text-gray-500 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-300'>
                                            <div className='grow'>{activity.content}</div>
                                            {user && (
                                                <div
                                                    className={`${
                                                        activity.likes.length > 0 ? 'tooltip' : ''
                                                    } tooltip-close tooltip-left md:tooltip-top`}
                                                    data-tip={activity.likes.map((like) => like.name).join(', ')}
                                                >
                                                    <div
                                                        onClick={(e) => {
                                                            e.currentTarget.classList.toggle('text-neutral');
                                                            e.currentTarget.classList.toggle('text-accent');
                                                            likePost(activity._id);
                                                        }}
                                                        className={`flex cursor-pointer select-none items-center gap-1 transition ${
                                                            isLikedPost(activity)
                                                                ? 'text-accent'
                                                                : 'text-neutral dark:text-neutral-content/70'
                                                        }`}
                                                    >
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
                                                                d='M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z'
                                                            />
                                                        </svg>
                                                        <span>{activity.likes.length}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                            </li>
                        ) : activity.activityType === 'newUser' ? (
                            <li
                                className={`pb-10 ${
                                    index + 1 === activities.length
                                        ? ''
                                        : 'border-l border-gray-200 dark:border-gray-700'
                                }`}
                            >
                                <div className='ml-6'>
                                    <span className='absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 ring-8 ring-white dark:bg-blue-900 dark:ring-gray-900'>
                                        <img
                                            className='rounded-full shadow-lg'
                                            src={activity.thumbnail ?? defaultPhotoURL}
                                            alt={activity.owner + ' image'}
                                        />
                                    </span>
                                    <div className='items-center justify-between rounded-lg border border-gray-200 bg-base-300 p-4 shadow-sm dark:border-gray-600 dark:bg-gray-700 sm:flex'>
                                        <time className='mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0'>
                                            {getWhen(activity)}
                                        </time>
                                        <div className='text-sm font-light text-gray-500 dark:text-gray-300'>
                                            <span className='font-medium capitalize text-accent'>
                                                {activity.owner}
                                            </span>{' '}
                                            just landed on
                                            <span className='capitalize text-gray-900 dark:text-info'>
                                                {activity.currentLocation}
                                                <svg
                                                    xmlns='http://www.w3.org/2000/svg'
                                                    height='1em'
                                                    className='mx-2 inline-block'
                                                    viewBox='0 0 384 512'
                                                >
                                                    <path d='M32 32C32 14.3 46.3 0 64 0H320c17.7 0 32 14.3 32 32s-14.3 32-32 32H290.5l11.4 148.2c36.7 19.9 65.7 53.2 79.5 94.7l1 3c3.3 9.8 1.6 20.5-4.4 28.8s-15.7 13.3-26 13.3H32c-10.3 0-19.9-4.9-26-13.3s-7.7-19.1-4.4-28.8l1-3c13.8-41.5 42.8-74.8 79.5-94.7L93.5 64H64C46.3 64 32 49.7 32 32zM160 384h64v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V384z' />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ) : (
                            activity.activityType === 'newLocation' && (
                                <li
                                    className={`pb-10 ${
                                        index + 1 === activities.length
                                            ? ''
                                            : 'border-l border-gray-200 dark:border-gray-700'
                                    }`}
                                >
                                    <div className='ml-6'>
                                        <span className='absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 ring-8 ring-white dark:bg-blue-900 dark:ring-gray-900'>
                                            <img
                                                className='rounded-full shadow-lg'
                                                src={activity.thumbnail ?? defaultPhotoURL}
                                                alt={activity.owner + ' image'}
                                            />
                                        </span>
                                        <div className='items-center justify-between rounded-lg border border-gray-200 bg-base-300 p-4 shadow-sm dark:border-gray-600 dark:bg-gray-700 sm:flex'>
                                            <time className='mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0'>
                                                {getWhen(activity)}
                                            </time>
                                            <div className='text-sm font-light text-gray-500 dark:text-gray-300'>
                                                <span className='font-medium capitalize text-accent'>
                                                    {activity.owner}
                                                </span>{' '}
                                                just moved to{' '}
                                                <span className='text-info capitalize'>
                                                    {activity.currentLocation}
                                                    <svg
                                                        xmlns='http://www.w3.org/2000/svg'
                                                        height='1em'
                                                        className='mx-2 inline-block'
                                                        viewBox='0 0 384 512'
                                                    >
                                                        <path d='M32 32C32 14.3 46.3 0 64 0H320c17.7 0 32 14.3 32 32s-14.3 32-32 32H290.5l11.4 148.2c36.7 19.9 65.7 53.2 79.5 94.7l1 3c3.3 9.8 1.6 20.5-4.4 28.8s-15.7 13.3-26 13.3H32c-10.3 0-19.9-4.9-26-13.3s-7.7-19.1-4.4-28.8l1-3c13.8-41.5 42.8-74.8 79.5-94.7L93.5 64H64C46.3 64 32 49.7 32 32zM160 384h64v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V384z' />
                                                    </svg>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            )
                        )
                    )}
                </ol>
            </div>
        </div>
    );
};

export default ActivitiesPage;
