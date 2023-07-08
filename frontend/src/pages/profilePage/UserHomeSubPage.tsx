import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../components/AuthContext";
import { ReceivedPost, SentPost } from "../../models/post";
import { GlobalContext } from "../../components/GlobalContext";

const UserHomeSubPage = () => {
    const [content, setContent] = useState<string>("");
    const [topic, setTopic] = useState<string>("mars");
    const { user } = useContext(AuthContext);
    const [posts, setPosts] = useState<ReceivedPost[]>([]);

    const { locations } = useContext(GlobalContext);

    useEffect(() => {
        if (user) {
            axios.get<ReceivedPost[]>("/posts/" + user._id)
                .then((response) => {
                    const data = response.data;
                    data.sort((a, b) =>
                        (new Date(a.createdAt).getTime() < new Date(b.createdAt).getTime() ? 1 : 
                        new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime() ? -1 : 0)
                    );
                    setPosts(data);
                }).catch((error) => {
                    console.log(error);
                });
        }

        console.log("hello");

    }, [user])

    async function submitPost(e: any) {
        e.preventDefault();
        console.log("submitting: ", content);
        const { data } = await axios.post<ReceivedPost>("/posts", { content, topic }, { headers: { "Content-Type": "application/json" } });
        posts.unshift(data);
        setContent("");
        setPosts([...posts]);
    }

    function getWhen(createdAt: any) {
        const then = new Date(createdAt);
        const now = new Date();
        let difference = Math.trunc(Math.abs(now.getTime() - then.getTime()) / (1000 * 60 * 60));

        if (difference < 1) {
            difference = Math.trunc(Math.abs(now.getTime() - then.getTime()) / (1000 * 60));
            if (difference < 1) {
                difference = Math.trunc(Math.abs(now.getTime() - then.getTime()) / 1000);

                if (difference < 10) {
                    return "just now";
                }

                return difference + " seconds ago";
            }
            else if (difference === 1) {
                return difference + " minute ago";
            }

            return difference + " minutes ago";
        }
        else if (difference === 1) {
            return difference + " hour ago";
        }

        return difference + " hours ago";
    }

    return (
        <div className="h-full">
            <div id="user_post" className="flex flex-col gap-6">
                <div id="user_poster" className="flex items-center justify-center">
                    <form className="w-9/12">
                        <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                            <div className="px-2 py-2 bg-white rounded-t-lg dark:bg-gray-800">
                                <label htmlFor="comment" className="sr-only">Your comment</label>
                                <textarea id="comment" onChange={(e) => { setContent(e.target.value) }} value={content} rows={4} className="w-full p-2 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400" placeholder="Write a comment..."/>
                            </div>
                            <div className="flex items-center justify-between px-3 py-2 border-t dark:border-gray-600">
                                <button onClick={submitPost} type="submit" className="btn btn-info btn-sm normal-case">
                                    Post comment
                                </button>
                                <div className="flex pl-0 space-x-1 sm:pl-2">
                                    <select id="user_location_edit" onChange={(e) => setTopic(e.target.value)} value={topic} className="bg-neutral border border-gray-300 text-neutral-content text-sm rounded-lg block w-full px-2">
                                        <option key={0} value="mars">Mars</option>
                                        {locations.map((loc, index) => (<option key={index + 1} value={loc}>{loc.replace(/(^\w|\s\w)/g, m => m.toUpperCase())}</option>))}
                                    </select>
                                    <button type="button" className="p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                        <svg aria-hidden="true" className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd"></path></svg>
                                        <span className="sr-only">Add emoji</span>
                                    </button>
                                    <button type="button" className="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd"></path></svg>
                                        <span className="sr-only">Attach file</span>
                                    </button>
                                    <button type="button" className="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
                                        <span className="sr-only">Set location</span>
                                    </button>
                                    <button type="button" className="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"></path></svg>
                                        <span className="sr-only">Upload image</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div id="user_posts" className="flex flex-col items-center justify-center gap-4">

                    {posts.map((post, index) =>
                        <div key={index} className="rounded-xl border p-5 shadow-md w-9/12 bg-base-100">
                            <div className="flex w-full items-center justify-between border-b pb-3">
                                <div className="flex items-center space-x-3">
                                    <div className="h-8 w-8 rounded-full bg-slate-400 bg-[url('https://i.pravatar.cc/32')]"></div>
                                    <div className="text-lg font-bold text-neutral">Joe Smith</div>
                                </div>
                                <div className="flex items-center space-x-8">
                                    {!!post.topic &&
                                        <button className="rounded-2xl border bg-neutral-100 px-3 py-1 text-xs font-semibold">{post.topic}</button>
                                    }

                                    <div className="text-xs text-neutral-500">{getWhen(post.createdAt)}</div>
                                </div>
                            </div>

                            <div className="mt-4 mb-6">
                                <div className="text-md text-neutral-600">{post.content}</div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between text-slate-500">
                                    <div className="flex space-x-4 md:space-x-8">
                                        <div className="flex cursor-pointer items-center transition hover:text-slate-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="mr-1.5 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                            </svg>
                                            <span>125</span>
                                        </div>
                                        <div className="flex cursor-pointer items-center transition hover:text-slate-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="mr-1.5 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                            </svg>
                                            <span>{post.likes.length}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

            </div>
        </div>

    );
}

export default UserHomeSubPage;