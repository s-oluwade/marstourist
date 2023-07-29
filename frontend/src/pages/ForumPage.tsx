import { useContext } from "react";
import { AuthContext } from "../components/Providers/AuthContext";
import { GlobalContext } from "../components/Providers/GlobalContext";
import axios from "axios";
import { ReceivedPost } from "../models/post";
import { UserContext } from "../components/Providers/UserContext";
import { User } from "../models/user";

const ForumPage = () => {

    const { postNames, postAvatars, allPosts, setAllPosts } = useContext(GlobalContext);
    const { userPosts, setUserPosts } = useContext(UserContext);
    const { user, setUser } = useContext(AuthContext)

    function getWhen(userPost: ReceivedPost) {
        const then = new Date(userPost.createdAt);
        const now = new Date();
        let difference = Math.abs(now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24);

        if (userPost.owner === '648197120e2f8305cf79cff0' && userPost.content === 'wassup') {
            console.log(then);
            console.log(now);
        }
        
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

    function getName(id: string) {
        if (postNames) {
            return postNames[id];
        }

        return "";
    }

    function getPicture(id: string) {
        if (postAvatars) {
            return postAvatars[id];
        }

        return "";
    }

    async function likePost(id: string) {
        const { data } = await axios.put<ReceivedPost | null>("/posts/like/" + id);

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

            if (data.owner === user?._id) {
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
            return post.likes.includes(user._id);
        }
        return false;
    }

    function updateFriendship(friend: string) {

        axios.put<User>("/user/update-friendship", { friendId: friend }, { headers: { "Content-Type": "application/json" } })
            .then((res) => {
                if (res.data) {
                    setUser(res.data);
                }
            })
            .catch((err) => {
                console.error(err);
            })
    }

    return (
        <div className="flex flex-col grow">
            <div className="mx-auto">
                <div id="posts" className="p-6 inline-flex flex-col items-center min-h-full">
                    <h1 className="text-2xl mb-4 uppercase">
                        mars forum
                    </h1>
                    {allPosts.map((post, index) => (
                        <div key={index} className="rounded-lg border p-3 shadow-md w-[32rem] bg-base-200 mb-4 border-neutral">
                            <div className="flex w-full items-center justify-between border-b border-accent pb-2">
                                <div className="flex items-center space-x-3">
                                    <div className="avatar">
                                        <div className="w-8 rounded-full">
                                            <img src={getPicture(post.owner)} />
                                        </div>
                                    </div>
                                    {/* https://i.pravatar.cc/32 */}
                                    <div className="text-md font-normal text-base-content">{getName(post.owner)}</div>
                                </div>
                                <div className="flex space-x-2 items-center">
                                    {!!post.topic && (
                                        <div className="badge badge-outline">{post.topic}</div>
                                    )}
                                    <div className="text-xs text-base-content">{getWhen(post)}</div>
                                    {user && user?._id !== post.owner &&
                                        <div className="tooltip tooltip-close tooltip-right" data-tip={user?.friends.includes(post.owner) ? "Remove Friend" : "Add Friend"}>
                                            <label className=" rounded-full swap bg-base-300 p-1">
                                                {/* this hidden checkbox controls the state */}
                                                <input type="checkbox"
                                                    checked={user?.friends.includes(post.owner)}
                                                    onChange={(e) => {
                                                        e.currentTarget.checked = !e.currentTarget.checked;
                                                        updateFriendship(post.owner)
                                                    }} />
                                                <svg className="swap-on w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                </svg>
                                                {/* add user icon */}
                                                <svg className="swap-off w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                                                </svg>
                                            </label>
                                        </div>
                                    }
                                </div>
                            </div>

                            <div className="mt-4 mb-2 flex justify-between gap-8">
                                <div className="text-sm text-base-content">
                                    <p>{post.content}</p>
                                </div>
                                {user && postNames &&
                                    <div

                                        className={`${post.likes.length > 0 ? "tooltip" : ""} tooltip-close tooltip-right`}
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
                                            className={`flex cursor-pointer gap-1 items-center transition select-none ${isLikedPost(post) ? "text-accent" : "text-neutral"}`}>
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

            </div>
            <footer className="w-full bg-transparent my-4">
                <div className="w-full pl-12 p-4 md:flex md:items-center md:justify-end md:gap-6">
                    <span className="text-xs text-neutral/90 sm:text-center">
                        © 2023 Samuel Oluwade
                    </span>
                    <ul className="flex flex-wrap items-center mt-3 text-xs font-medium text-neutral/50 sm:mt-0">
                        <li>
                            <a target="_blank" href="https://github.com/s-oluwade" className="mr-4 hover:underline md:mr-6 flex items-center">
                                Github
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                </svg>
                            </a>
                        </li>
                        <li>
                            <a target="_blank" href="https://www.cookiepolicygenerator.com/live.php?token=13A7pWhd9KInJXDPINssDYTkGQ2Q5ghI" className="mr-4 hover:underline md:mr-6 flex items-center">
                                Cookie Policy
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                </svg>

                            </a>
                        </li>
                    </ul>
                </div>
            </footer>
        </div>
    );
}

export default ForumPage;