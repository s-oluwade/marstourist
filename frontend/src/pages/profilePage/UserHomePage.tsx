import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../../components/Providers/AuthContext";
import { GlobalContext } from "../../components/Providers/GlobalContext";
import { UserContext } from "../../components/Providers/UserContext";
import { ReceivedPost } from "../../models/post";
import Friend from "../../components/Friend";

const UserHomeSubPage = () => {
    const [content, setContent] = useState("");
    const [topic, setTopic] = useState("mars");
    const [idOfPostToDelete, setIdOfPostToDelete] = useState("");
    const { locations, allPosts, setAllPosts, postNames } = useContext(GlobalContext);
    const { userPosts, setUserPosts, userAvatar } = useContext(UserContext);
    const { user } = useContext(AuthContext);

    async function deletePost() {
        const { data } = await axios.delete<ReceivedPost>("/posts/" + idOfPostToDelete);
        const updated = userPosts.filter((each) => each._id !== data._id);
        const updatedAll = allPosts.filter((each) => each._id !== data._id);
        setUserPosts(updated);
        setAllPosts(updatedAll);
    }

    async function submitPost(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        const { data } = await axios.post<ReceivedPost>(
            "/posts",
            { content, topic },
            { headers: { "Content-Type": "application/json" } }
        );
        userPosts.unshift(data);
        allPosts.unshift(data);
        setContent("");
        setUserPosts([...userPosts]);
        setAllPosts([...allPosts]);
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

                    if (Math.trunc(difference) < 10) {
                        return "Just now";
                    }

                    return Math.trunc(difference) + " seconds ago";
                } else if (Math.trunc(difference) === 1) {
                    return Math.trunc(difference) + " minute ago";
                }

                return Math.trunc(difference) + " minutes ago";
            }
            else if (Math.trunc(difference) === 1) {
                return Math.trunc(difference) + " hour ago";
            }

            return Math.trunc(difference) + " hours ago";
        }
        else if (Math.trunc(difference) === 1) {
            return Math.trunc(difference) + " day ago";
        }

        return Math.trunc(difference) + " days ago";
    }

    function showDeleteModal() {
        const elem = document.getElementById("delete_modal");
        if (elem instanceof HTMLDialogElement) {
            elem.showModal();
        }
    }

    async function likePost(id: string) {
        const { data } = await axios.put<ReceivedPost | null>("/posts/like/" + id);

        if (data) {
            const postsUpdate = userPosts.filter((each) => each._id !== data._id);
            const allPostsUpdate = allPosts.filter((each) => each._id !== data._id);
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
            setAllPosts([...allPostsUpdate]);
        }
    }

    function isLikedPost(post: ReceivedPost) {
        if (user) {
            return post.likes.includes(user._id);
        }
        return false;
    }

    if (!user) {
        return "";
    }

    return (
        <>
            <div className="flex">
                <div id="user_post" className="m-4 md:max-h-[48.75rem] md:overflow-y-auto md:overflow-x-hidden p-6 grow items-center bg-base-200 dark:bg-gray-800 shadow-sm">

                    <div id="user_poster" className="rounded-lg">
                        <form>
                            <div className="shadow-lg w-full border border-gray-200 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                                <div className="px-2 py-2 bg-white rounded-t-lg dark:bg-gray-800">
                                    <label htmlFor="comment" className="sr-only">
                                        Your comment
                                    </label>
                                    <textarea
                                        id="comment"
                                        onChange={(e) => {
                                            setContent(e.target.value);
                                        }}
                                        value={content}
                                        rows={2}
                                        className="w-full p-2 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400"
                                        placeholder="Write a comment..."
                                    />
                                </div>
                                <div className="flex items-center justify-between px-3 py-1 border-t dark:border-gray-600">
                                    <div className="flex items-center pl-0 space-x-4 sm:pl-2">
                                        <select
                                            id="user_location_edit"
                                            onChange={(e) => setTopic(e.target.value)}
                                            value={topic}
                                            className="bg-neutral border border-gray-300 text-neutral-content text-sm rounded-lg block px-2 h-8">
                                            <option key={0} value="mars">
                                                Mars
                                            </option>
                                            {locations.map((loc, index) => (
                                                <option key={index + 1} value={loc}>
                                                    {loc.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            className="text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd"></path>
                                            </svg>
                                            <span className="sr-only">Add emoji</span>
                                        </button>
                                    </div>
                                    <button onClick={submitPost} type="submit" className="btn btn-accent btn-sm normal-case">
                                        Post comment
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div id="user_posts" className="">
                        {userPosts.map((post, index) => (
                            <div key={index} className="rounded-lg border p-3 shadow-md bg-base-100 dark:bg-gray-700 dark:border-neutral my-4">
                                <div className="flex w-full items-center justify-between border-b border-b-accent pb-2">
                                    <div className="flex items-center space-x-3">
                                        <div className="avatar">
                                            <div className="w-8 rounded-full">
                                                <img src={userAvatar} />
                                            </div>
                                        </div>
                                        <div className="text-md font-normal text-neutral dark:text-neutral-content capitalize">{user?.fullname}</div>
                                    </div>
                                    <div className="flex space-x-2 items-center">
                                        {!!post.topic && (
                                            <div className="badge badge-outline h-fit w-min md:w-max">{post.topic}</div>
                                        )}

                                        <div className="text-xs text-base-content/70 dark:text-neutral-content/70">{getWhen(post.createdAt)}</div>
                                        <a onClick={() => { showDeleteModal(); setIdOfPostToDelete(post._id) }} className="cursor-pointer">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>

                                <div className="mt-4 mb-2 flex justify-between gap-8">
                                    <div className="text-sm text-base-content dark:text-neutral-content">
                                        <p>{post.content}</p>
                                    </div>
                                    {postNames &&
                                        <div
                                            className={`${post.likes.length > 0 ? "tooltip" : ""} z-[100000] tooltip-close tooltip-left`}
                                            data-tip={post.likes.map(like => postNames[like]).join(", ")}
                                        >
                                            <div onClick={(e) => {
                                                if (e.currentTarget.classList.contains("text-neutral")) {
                                                    e.currentTarget.classList.remove("text-neutral");
                                                    e.currentTarget.classList.add("text-accent");
                                                }
                                                else {
                                                    e.currentTarget.classList.add("text-neutral");
                                                    e.currentTarget.classList.remove("text-accent");
                                                }
                                                likePost(post._id);
                                            }}
                                                className={`flex cursor-pointer gap-1 items-center transition select-none ${isLikedPost(post) ? "text-accent" : "text-neutral dark:text-neutral-content/70"}`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                                                </svg>
                                                <span>{post.likes.length}</span>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                    <dialog id="delete_modal" className="modal modal-bottom sm:modal-middle">
                        <form method="dialog" className="modal-box py-8 gap-2 flex flex-col items-center">
                            <button onClick={() => setIdOfPostToDelete("")} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                            <h3 className="font-bold text-lg">Are you sure?</h3>
                            <div className="modal-action gap-6">
                                <button onClick={deletePost} className="btn btn-wide">Yes</button>
                                <button onClick={() => setIdOfPostToDelete("")} className="btn">Cancel</button>
                            </div>
                        </form>
                    </dialog>
                </div>

                <div className="hidden lg:block m-4 max-h-[51.875rem] overflow-y-auto overflow-x-hidden rounded-md bg-neutral/50 dark:bg-gray-800 shadow-md min-w-[12.5rem] w-64">
                    <h3 className="rounded-t-md bg-base-100 dark:bg-gray-900 p-4 font-normal text-md">Friends ({user.friends ? user.friends.length : 0})</h3>
                    <div className="p-1">
                        {user.friends.map((friend) => (
                            <Friend key={friend} id={friend} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserHomeSubPage;
