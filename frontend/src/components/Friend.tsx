import { useContext } from "react";
import { GlobalContext } from "./Providers/GlobalContext";

interface FriendsProps {
    id: string;
}

const Friend = ({ id }: FriendsProps) => {

    const { postAvatars, postNames } = useContext(GlobalContext);

    // use id to find user avatar

    return (

        <div key={id} data-id={id} className="flex justify-between bg-base-100 m-1 rounded-md px-4 py-2">
            <div className="flex items-center gap-2">
                <div className="avatar">
                    <div className="w-8 rounded-full">
                        {postAvatars && postAvatars[id] ?
                            <img src={postAvatars[id]} />
                            :
                            <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png?20170328184010" />
                        }
                    </div>
                </div>
                <div className="text-sm">
                    {postNames && postNames[id]}
                </div>
            </div>
            <div className="flex items-center">
                <label className="rounded-full swap bg-accent p-1">
                    {/* this hidden checkbox controls the state */}
                    <input type="checkbox" />
                    {/* remove user icon */}
                    <svg className="swap-on w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                    </svg>
                    {/* add user icon */}
                    <svg className="swap-off w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                    </svg>
                </label>
            </div>
        </div>
    );
}

export default Friend;