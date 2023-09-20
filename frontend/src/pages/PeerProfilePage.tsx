import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AddFriend from '../components/AddFriend';
import Friend from '../components/Friend';
import { GlobalContext } from '../components/Providers/GlobalContextProvider';
import { Activity } from '../models/activity';
import { User } from '../models/user';
import { getWhen } from '../utils/helpers';
import { AuthContext } from '../components/Providers/AuthContextProvider';

const rootURL = import.meta.env.VITE_API_ROOT_URL;
const defaultPhotoURL = `${rootURL}/avatar_placeholder.png`;

const PeerProfilePage = () => {
    const { username } = useParams();
    const [peer, setPeer] = useState<User | null>(null);
    const [peerPosts, setPeerPosts] = useState<Activity[] | null>(null);
    const [loading, setLoading] = useState(true);
    const { activities, setActivities, allUsers } = useContext(GlobalContext);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (username) {
            axios
                .get<User>('/user/peer/' + username)
                .then((res) => {
                    setPeer(res.data);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [username, user]);

    useEffect(() => {
        if (peer && activities) {
            setPeerPosts(
                activities.filter(
                    (activity) => activity.userId === peer?._id && activity.activityType === 'post'
                )
            );
        }
    }, [peer, activities]);

    async function likePost(id: string) {
        if (!peerPosts) {
            return;
        }

        const { data } = await axios.put<Activity | null>('/activities/posts/like/' + id);

        if (data) {
            const postsUpdate = peerPosts.filter((each) => each._id !== data._id);
            const allPostsUpdate = activities.filter((each) => each._id !== data._id);
            postsUpdate.push(data);
            allPostsUpdate.push(data);
            postsUpdate.sort((a, b) =>
                new Date(a.createdAt).getTime() < new Date(b.createdAt).getTime()
                    ? 1
                    : new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime()
                    ? -1
                    : 0
            );
            allPostsUpdate.sort((a, b) =>
                new Date(a.createdAt).getTime() < new Date(b.createdAt).getTime()
                    ? 1
                    : new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime()
                    ? -1
                    : 0
            );
            setPeerPosts([...postsUpdate]);
            setActivities([...allPostsUpdate]);
        }
    }

    function isLikedPost(post: Activity) {
        if (peer && user) {
            return post.likes.map((like) => like.userId).includes(user._id);
        }
        return false;
    }

    if (!username) {
        return <div>Username parameter required</div>;
    }

    if (loading) {
        return <div>skeleton, loading...</div>;
    }

    if (!peer) {
        return <div>User not found</div>;
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
                                <Link to={peer.photo} className='avatar'>
                                    <div className='w-32 rounded-full ring ring-accent ring-offset-4 ring-offset-base-100'>
                                        <img src={peer.thumbnail} />
                                    </div>
                                </Link>
                                <div className='flex w-full flex-col gap-1 px-4 text-sm font-light'>
                                    <div>
                                        Name: <span className='font-medium'>{peer.fullname}</span>
                                    </div>
                                    <div>
                                        Username:{' '}
                                        <span className='font-medium'>{peer.username}</span>
                                    </div>
                                </div>
                                {peer.username !== user?.username && <AddFriend id={peer._id} />}
                            </div>
                            <ul className='w-full py-6 text-sm'>
                                <li className='w-full border-b px-4 py-2 dark:border-b-gray-700'>
                                    <h6 className='mb-1 bg-gray-300 text-sm font-medium dark:bg-gray-700'>
                                        Location
                                    </h6>
                                    <p className='capitalize'>{peer.location || '_'}</p>
                                </li>
                                <li className='w-full border-b px-4 py-2 dark:border-b-gray-700'>
                                    <h6 className='mb-1 bg-gray-300 text-sm font-medium dark:bg-gray-700'>
                                        Bio
                                    </h6>
                                    <p>{peer.bio || '_'}</p>
                                </li>
                            </ul>
                        </div>
                        <div className='m-4 rounded lg:hidden'>
                            <h3 className='rounded-t-md p-4 text-sm font-normal'>
                                Friends ({peer.friends?.length ?? 0})
                            </h3>
                            <div className='p-1'>
                                {peer.friends.map((friend) => (
                                    <Friend
                                        key={friend.userId}
                                        peer={
                                            allUsers.filter((each) => each._id === friend.userId)[0]
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full md:basis-2/3'>
                    <div className='flex'>
                        <div id='user_post' className='grow items-center p-4 shadow-sm'>
                            {peerPosts?.map((post, index) => (
                                <div
                                    key={index}
                                    className='my-4 rounded-lg border bg-base-100 px-5 py-3 shadow-md dark:border-neutral dark:bg-gray-700'
                                >
                                    <div className='flex w-full items-center justify-between pb-2'>
                                        <div className='flex items-center space-x-3'>
                                            <div className='avatar'>
                                                <div className='w-8 rounded-full'>
                                                    <img src={peer.thumbnail ?? defaultPhotoURL} />
                                                </div>
                                            </div>
                                            <div className='text-sm font-semibold capitalize text-neutral dark:text-neutral-content'>
                                                {peer.fullname}
                                            </div>
                                        </div>
                                        <div className='flex items-center space-x-3'>
                                            {!!post.topic && (
                                                <div className='badge badge-outline h-fit w-min gap-1 md:w-max'>
                                                    <svg
                                                        xmlns='http://www.w3.org/2000/svg'
                                                        fill='none'
                                                        viewBox='0 0 24 24'
                                                        strokeWidth={1.5}
                                                        stroke='currentColor'
                                                        className='h-3 w-3'
                                                    >
                                                        <path
                                                            strokeLinecap='round'
                                                            strokeLinejoin='round'
                                                            d='M15 10.5a3 3 0 11-6 0 3 3 0 016 0z'
                                                        />
                                                        <path
                                                            strokeLinecap='round'
                                                            strokeLinejoin='round'
                                                            d='M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z'
                                                        />
                                                    </svg>

                                                    {post.topic}
                                                </div>
                                            )}

                                            <div className='text-xs text-base-content/70 dark:text-neutral-content/70'>
                                                {getWhen(post)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className='mb-2 mt-4 flex justify-between gap-8'>
                                        <div className='pl-2 text-base text-base-content dark:text-neutral-content'>
                                            <p>{post.content}</p>
                                        </div>
                                        <div
                                            className={`${
                                                post.likes.length > 0 ? 'tooltip' : ''
                                            } tooltip-close tooltip-left md:tooltip-top`}
                                            data-tip={post.likes
                                                .map((like) => like.name)
                                                .join(', ')}
                                        >
                                            <div
                                                onClick={(e) => {
                                                    e.currentTarget.classList.toggle(
                                                        'text-neutral'
                                                    );
                                                    e.currentTarget.classList.toggle('text-accent');
                                                    likePost(post._id);
                                                }}
                                                className={`flex cursor-pointer select-none items-center gap-1 transition ${
                                                    isLikedPost(post)
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
                                                <span>{post.likes.length}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PeerProfilePage;
