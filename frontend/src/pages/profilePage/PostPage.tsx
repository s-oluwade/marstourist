import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../components/Providers/AuthContextProvider';
import { GlobalContext } from '../../components/Providers/GlobalContextProvider';
import { UserContext } from '../../components/Providers/UserContextProvider';
import EmojiPicker from '../../components/EmojiPicker';
import { Activity } from '../../models/activity';

const locations = [
    'olympus mons',
    'jezero',
    'gale',
    'gusev',
    'meridiani',
    'capri chasma',
    'coloe',
    'shalbatana',
    'valles marineris',
    'cavi angusti',
    'medusae fossae',
    'nicholson',
    'zunil',
    'milankovic',
    'terra sirenum',
    'eberswalde',
];

const PostPage = () => {
    const { activities, setActivities } = useContext(GlobalContext);
    const { userPosts, setUserPosts, userAvatar } = useContext(UserContext);
    const { user } = useContext(AuthContext);
    const [content, setContent] = useState('');
    const [topic, setTopic] = useState(user?.location ?? 'mars');
    const [idOfPostToDelete, setIdOfPostToDelete] = useState('');

    useEffect(() => {
        axios
            .get<Activity[]>('/activities/posts/' + user?._id)
            .then((response) => {
                let data = response.data;
                if (data) {
                    data = data.filter((activity) => activity.activityType === 'post');
                    data.sort((a, b) =>
                        new Date(a.createdAt).getTime() < new Date(b.createdAt).getTime()
                            ? 1
                            : new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime()
                            ? -1
                            : 0
                    );
                    setUserPosts(data);
                } else {
                    setUserPosts([]);
                }
            })
            .catch((error) => {
                setUserPosts([]);
                console.log(error);
            });
    }, []);

    async function deletePost() {
        const { data } = await axios.delete<Activity>('/activities/posts/' + idOfPostToDelete);
        const updated = userPosts.filter((each) => each._id !== data._id);
        const updatedAll = activities.filter((each) => each._id !== data._id);
        setUserPosts(updated);
        setActivities(updatedAll);
    }

    async function submitPost(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        const { data } = await axios.post<Activity>(
            '/activities/posts',
            { content, topic },
            { headers: { 'Content-Type': 'application/json' } }
        );
        userPosts.unshift(data);
        activities.unshift(data);
        setContent('');
        setUserPosts([...userPosts]);
        setActivities([...activities]);
    }

    function getWhen(createdAt: string) {
        const then = new Date(createdAt);
        const now = new Date();
        let difference = Math.abs(now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24);

        if (Math.trunc(difference) < 1) {
            difference = difference * 24;
            if (Math.trunc(difference) < 1) {
                difference = difference * 60;
                if (Math.trunc(difference) < 1) {
                    difference = difference * 60;
                    return 'just now';
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

    function showDeleteModal() {
        const elem = document.getElementById('delete_modal');
        if (elem instanceof HTMLDialogElement) {
            elem.showModal();
        }
    }

    async function likePost(id: string) {
        const { data } = await axios.put<Activity | null>('/activities/posts/like/' + id);

        if (data) {
            const postsUpdate = userPosts.filter((each) => each._id !== data._id);
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
            setUserPosts([...postsUpdate]);
            setActivities([...allPostsUpdate]);
        }
    }

    function isLikedPost(post: Activity) {
        if (user) {
            return post.likes.map((like) => like.userId).includes(user._id);
        }
        return false;
    }

    function chooseEmoji(choice: any) {
        setContent(content + choice.native);
    }

    if (!user) {
        return '';
    }

    return (
        <div className='flex'>
            <div id='user_post' className='grow items-center p-6 shadow-sm'>
                <div id='user_poster' className='rounded-lg'>
                    <form>
                        <div className='w-full rounded-md border border-gray-200 bg-gray-50 shadow-lg dark:border-gray-600 dark:bg-gray-700'>
                            <div className='rounded-t-lg bg-white px-2 py-2 dark:bg-gray-800'>
                                <label htmlFor='comment' className='sr-only'>
                                    Your comment
                                </label>
                                <textarea
                                    id='comment'
                                    onChange={(e) => {
                                        setContent(e.target.value);
                                    }}
                                    value={content}
                                    rows={2}
                                    className='w-full border-0 bg-white p-2 text-sm text-gray-900 focus:outline-none focus:ring-0 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400'
                                    placeholder='Write a comment...'
                                />
                            </div>
                            <div className='flex items-center justify-between border-t px-3 py-1 bg-gray-300 dark:bg-gray-700 dark:border-gray-600'>
                                <div className='flex items-center space-x-4 pl-0 sm:pl-2'>
                                    <select
                                        id='user_location_edit'
                                        onChange={(e) => setTopic(e.target.value)}
                                        value={topic}
                                        className='block h-8 rounded-lg border border-gray-300 bg-neutral px-2 text-sm text-neutral-content'
                                    >
                                        <option key={0} value='mars'>
                                            Mars
                                        </option>
                                        {locations.map((loc, index) => (
                                            <option key={index + 1} value={loc}>
                                                {loc.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())}
                                            </option>
                                        ))}
                                    </select>
                                    {/* EMOJI PICKER GOES HERE */}
                                    <EmojiPicker onChange={chooseEmoji} />
                                </div>
                                <button
                                    onClick={submitPost}
                                    type='submit'
                                    className='btn-accent btn-sm btn normal-case'
                                >
                                    Post comment
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                <div id='user_posts' className=''>
                    {userPosts.map((post, index) => (
                        <div
                            key={index}
                            className='my-4 rounded-lg border bg-base-100 px-5 py-3 shadow-md dark:border-neutral dark:bg-gray-700'
                        >
                            <div className='flex w-full items-center justify-between pb-2'>
                                <div className='flex items-center space-x-3'>
                                    <div className='avatar'>
                                        <div className='w-8 rounded-full'>
                                            <img src={userAvatar} />
                                        </div>
                                    </div>
                                    <div className='text-sm font-semibold capitalize text-neutral dark:text-neutral-content'>
                                        {user?.fullname}
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
                                        {getWhen(post.createdAt)}
                                    </div>
                                    <a
                                        onClick={() => {
                                            showDeleteModal();
                                            setIdOfPostToDelete(post._id);
                                        }}
                                        className='cursor-pointer'
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
                                                d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'
                                            />
                                        </svg>
                                    </a>
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
                            </div>
                        </div>
                    ))}
                </div>
                <dialog id='delete_modal' className='modal modal-bottom sm:modal-middle'>
                    <form
                        method='dialog'
                        className='modal-box flex flex-col items-center gap-2 bg-base-300 py-8 md:ml-52'
                    >
                        <button
                            onClick={() => setIdOfPostToDelete('')}
                            className='btn-neutral btn-square btn-sm btn absolute right-2 top-2 text-2xl dark:text-neutral-content'
                        >
                            ✕
                        </button>
                        <h3 className='text-xl font-bold dark:text-neutral-content'>
                            Are you sure?
                        </h3>
                        <div className='modal-action justify-center'>
                            <button onClick={deletePost} className='btn-neutral btn-block btn'>
                                Yes
                            </button>
                            <button
                                onClick={() => setIdOfPostToDelete('')}
                                className='btn-outline btn-block btn'
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </dialog>
            </div>
        </div>
    );
};

export default PostPage;
