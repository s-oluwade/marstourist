import { useContext, useEffect } from 'react';
import { AuthContext } from '../components/Providers/AuthContextProvider';
import { GlobalContext } from '../components/Providers/GlobalContextProvider';
import axios from 'axios';
import { ReceivedPost } from '../models/post';
import { UserContext } from '../components/Providers/UserContextProvider';
import { User } from '../models/user';

const ForumPage = () => {
    const { allPosts, setAllPosts } = useContext(GlobalContext);
    const { userPosts, setUserPosts } = useContext(UserContext);
    const { user, setUser } = useContext(AuthContext);

    useEffect(() => {
        axios
            .get<ReceivedPost[]>('/posts')
            .then((response) => {
                const data = response.data;
                data.sort((a, b) =>
                    new Date(a.createdAt).getTime() < new Date(b.createdAt).getTime()
                        ? 1
                        : new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime()
                        ? -1
                        : 0
                );
                setAllPosts(data);
            })
            .catch((error) => {
                setAllPosts([]);
                console.log(error);
            });
    }, [setAllPosts]);

    function getWhen(userPost: ReceivedPost) {
        const then = new Date(userPost.createdAt);
        const now = new Date();
        let difference = Math.abs(now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24);

        if (Math.trunc(difference) < 1) {
            difference = difference * 24;
            if (Math.trunc(difference) < 1) {
                difference = difference * 60;

                if (Math.trunc(difference) < 1) {
                    difference = difference * 60;

                    if (Math.trunc(difference) < 10) {
                        return 'Just now';
                    }

                    return Math.trunc(difference) + ' seconds ago';
                } else if (Math.trunc(difference) === 1) {
                    return Math.trunc(difference) + ' minute ago';
                }

                return Math.trunc(difference) + ' minutes ago';
            } else if (Math.trunc(difference) === 1) {
                return Math.trunc(difference) + ' hour ago';
            }

            return Math.trunc(difference) + ' hours ago';
        } else if (Math.trunc(difference) === 1) {
            return Math.trunc(difference) + ' day ago';
        }

        return Math.trunc(difference) + ' days ago';
    }

    async function likePost(id: string) {
        const { data } = await axios.put<ReceivedPost | null>('/posts/like/' + id);

        if (data) {
            const allPostsUpdate = allPosts.filter((each) => each._id !== data._id);
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

            setAllPosts([...allPostsUpdate]);
        }
    }

    function isLikedPost(post: ReceivedPost) {
        if (user) {
            return post.likes.map((like) => like.userId).includes(user._id);
        }
        return false;
    }

    function updateFriendship(friend: string) {
        axios
            .put<User>(
                '/user/update-friendship',
                { friendId: friend },
                { headers: { 'Content-Type': 'application/json' } }
            )
            .then((res) => {
                if (res.data) {
                    setUser(res.data);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }

    return (
        <div className='mt-2 flex grow flex-col'>
            <div className='mx-auto'>
                <div
                    id='posts'
                    className='flex min-h-full grow flex-col items-center rounded bg-base-200 p-6 shadow-sm'
                >
                    <h1 className='mb-4 text-lg uppercase'>ALL POSTS</h1>
                    {allPosts.map((post, index) => (
                        <div
                            key={index}
                            className='my-4 mb-4 w-full min-w-[350px] rounded-lg border bg-base-100 px-5 py-3 shadow-md dark:border-neutral dark:bg-gray-800'
                        >
                            <div className='flex w-full items-center justify-between pb-2'>
                                <div className='flex items-center space-x-3'>
                                    <div className='avatar'>
                                        <div className='w-8 rounded-full'>
                                            <img src={post.thumbnail} />
                                        </div>
                                    </div>
                                    <div className='text-sm font-light capitalize text-neutral dark:text-neutral-content'>
                                        {post.owner}
                                    </div>
                                </div>
                                <div className='flex items-center space-x-3'>
                                    {!!post.topic && (
                                        <div className='badge badge-outline h-fit w-min gap-1 md:w-max'>
                                            {post.topic}
                                        </div>
                                    )}
                                    <div className='text-xs text-base-content/70 dark:text-neutral-content/70'>
                                        {getWhen(post)}
                                    </div>
                                    {user && user?._id !== post.userId && (
                                        <div
                                            title={
                                                user?.friends.includes(post.userId)
                                                    ? 'Remove Friend'
                                                    : 'Add Friend'
                                            }
                                        >
                                            <label className=' swap rounded-full bg-base-300 p-1 dark:bg-neutral'>
                                                {/* this hidden checkbox controls the state */}
                                                <input
                                                    type='checkbox'
                                                    checked={user?.friends.includes(post.userId)}
                                                    onChange={(e) => {
                                                        e.currentTarget.checked =
                                                            !e.currentTarget.checked;
                                                        updateFriendship(post.userId);
                                                    }}
                                                />
                                                <svg
                                                    className='swap-on h-5 w-5'
                                                    xmlns='http://www.w3.org/2000/svg'
                                                    fill='none'
                                                    viewBox='0 0 24 24'
                                                    strokeWidth={1.5}
                                                    stroke='currentColor'
                                                >
                                                    <path
                                                        strokeLinecap='round'
                                                        strokeLinejoin='round'
                                                        d='M4.5 12.75l6 6 9-13.5'
                                                    />
                                                </svg>
                                                {/* add user icon */}
                                                <svg
                                                    className='swap-off h-5 w-5'
                                                    xmlns='http://www.w3.org/2000/svg'
                                                    fill='none'
                                                    viewBox='0 0 24 24'
                                                    strokeWidth={1.5}
                                                    stroke='currentColor'
                                                >
                                                    <path
                                                        strokeLinecap='round'
                                                        strokeLinejoin='round'
                                                        d='M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z'
                                                    />
                                                </svg>
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className='mb-2 mt-4 flex justify-between gap-8'>
                                <div className='pl-2 text-base text-base-content dark:text-neutral-content'>
                                    <p>{post.content}</p>
                                </div>
                                {user && (
                                    <div
                                        className={`${
                                            post.likes.length > 0 ? 'tooltip' : ''
                                        } tooltip-close tooltip-left md:tooltip-top`}
                                        data-tip={post.likes.map((like) => like.name).join(', ')}
                                    >
                                        <div
                                            onClick={(e) => {
                                                e.currentTarget.classList.toggle('text-neutral');
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
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ForumPage;
