import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../../../components/Providers/AuthContext";
import { User } from "../../../models/user";

export default function GeneralSubPage() {
    const { user, setUser } = useContext(AuthContext);
    const [fullname, setFullname] = useState<string | undefined>(user?.fullname);
    const [username, setUsername] = useState<string | undefined>(user?.username);
    const [uploading, setUploading] = useState(false);
    const [files, setFiles] = useState<FileList | null>(null);

    async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
        ev.preventDefault();

        if (fullname?.trim() === user?.fullname && username === user?.username) {
            console.log("no change");
            showAlerts("nochange");
            return;
        }

        const { data } = await axios.put<User>('/user', { fullname, username }, { headers: { "Content-Type": "application/json" } });

        if (JSON.stringify(data) !== JSON.stringify(user)) {
            showAlerts("change");
        }
        else {
            showAlerts("nochange");
        }

        setUser(data);
    }
    function uploadPhoto() {
        if (files === null || files === undefined) {
            return;
        }
        setUploading(true);

        const data = new FormData();
        data.append('photos', files[0]);
        axios.put('/user/uploadPhoto', data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }).then(() => {
            window.location.reload();
        })
    }
    function showUploader(ev: React.MouseEvent<HTMLButtonElement>) {
        ev.currentTarget.classList.add('hidden');
        const elem = document.getElementById('uploader');
        elem?.classList.remove('hidden');
    }
    function hideUploader() {
        setFiles(null);
        const file_uploader = document.getElementById('fileUploader') as HTMLFormElement;
        file_uploader.reset()
        const elem = document.getElementById('uploader');
        const updAvatarBtn = document.getElementById('update-avatar-btn');
        elem?.classList.add('hidden');
        updAvatarBtn?.classList.remove('hidden');
    }

    function showAlerts(action: string) {
        const elem = document.getElementById('alert-' + action);
        elem?.classList.remove('hidden');
        setTimeout(function () {
            elem?.classList.add('hidden');
        }, 3000);
    }

    return (
        <>
            <div className="pb-4">
                <div id="uploader" className="hidden">
                    <div className="flex gap-8 items-end">
                        <form action="" id="fileUploader">
                            <label className="w-20 cursor-pointer text-center border rounded-2xl p-4 text-3xl flex justify-center">
                                <input type="file" className="hidden" onChange={(e) => {
                                    setFiles(e.target.files);
                                }} />
                                <span className="h-10">+</span>
                            </label>
                        </form>
                        {uploading ?
                            <div className="flex flex-col w-48 break-words">
                                {files &&
                                    <p className="text-xs">{files[0].name}</p>
                                }
                                <span className="loading loading-spinner loading-md self-center"></span>
                            </div>
                            :
                            <>
                                <div className="flex flex-col w-48 break-words">
                                    {files &&
                                        <p className="text-xs">{files[0].name}</p>
                                    }
                                    <button onClick={uploadPhoto} className="btn btn-accent btn-sm">
                                        Upload
                                    </button>
                                </div>
                                <button onClick={hideUploader} className="btn btn-square">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </>
                        }

                    </div>
                </div>
                <button onClick={showUploader} id="update-avatar-btn" className="btn btn-accent btn-sm">Update Avatar</button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-4" action="">
                <div>
                    <label htmlFor="fullname" className="block mb-2 text-sm font-medium base-content">Name</label>
                    <input onChange={(e => setFullname(e.target.value))} type="text" id="fullname" className="bg-base-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="John Doe" defaultValue={user?.fullname} required />
                </div>
                <div>
                    <label htmlFor="username" className="block mb-2 text-sm font-medium base-content">Username</label>
                    <input onChange={(e) => setUsername(e.target.value)} type="text" id="username" className="bg-base-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="johndoe" defaultValue={user?.username} required />
                </div>
                <div className="">
                    <button className="btn btn-neutral btn-sm btn-block">Save</button>
                </div>
                <p role="alert" id="alert-nochange" className="hidden opacity-70 text-xs italic text-center">No changes made.</p>
                <p role="alert" id="alert-change" className="hidden opacity-70 text-xs italic text-center">Updated!</p>
            </form>
        </>
    )
}