import { useContext } from "react";
import { AuthContext } from "../components/Providers/AuthContext";
import { GlobalContext } from "../components/Providers/GlobalContext";
import axios from "axios";
import { ReceivedPost } from "../models/post";
import { UserContext } from "../components/Providers/UserContext";

const FeedsPage = () => {

    const { postNames, postAvatars, allPosts, setAllPosts } = useContext(GlobalContext);
    const { userPosts, setUserPosts } = useContext(UserContext);
    const { user } = useContext(AuthContext)

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

    function getName(id: string) {
        if (postNames.length > 0) {
            const name = postNames.filter((each) => each.owner === id)[0].name;
            return name;
        }
        return "";
    }

    function getPicture(id: string) {
        if (postAvatars.length > 0) {
            const picture = postAvatars.filter((each) => each.owner === id)[0].picture;
            if (picture) {
                if (picture.includes("https://")) {
                    return picture;
                }
                return `http://localhost:4000/${picture}`;
            }
            return "";
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

    return (
        <div className="flex w-full justify-center">
            <div id="posts" className="p-6 inline-flex flex-col items-center min-h-full">

                {allPosts.map((post, index) => (
                    <div key={index} className="rounded-lg border p-3 shadow-md w-[32rem] bg-base-100 mb-4">
                        <div className="flex w-full items-center justify-between border-b pb-2">
                            <div className="flex items-center space-x-3">
                                <div className="avatar">
                                    <div className="w-8 rounded-full">
                                        <img src={getPicture(post.owner)} />
                                    </div>
                                </div>
                                {/* https://i.pravatar.cc/32 */}
                                <div className="text-md font-normal text-neutral">{getName(post.owner)}</div>
                            </div>
                            <div className="flex space-x-2 items-center">
                                {!!post.topic && (
                                    <div className="badge badge-outline">{post.topic}</div>
                                )}
                                <div className="text-xs text-neutral-500">{getWhen(post.createdAt)}</div>
                            </div>
                        </div>

                        <div className="mt-4 mb-2 flex justify-between gap-8">
                            <div className="text-sm text-neutral-600">
                                <p>{post.content}</p>
                            </div>
                            {user &&
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
                                }} className={`flex items-end ${isLikedPost(post) ? "text-accent" : "text-neutral"}`}>
                                    <div className="flex cursor-pointer gap-1 items-center transition select-none">
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
    );
}

export default FeedsPage;