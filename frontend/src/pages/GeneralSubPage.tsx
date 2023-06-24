import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../components/AuthContext";
import { UserData } from "../models/userData";
import { UserObject } from "../models/userObject";


export default function GeneralSubPage() {
    const [home, setHome] = useState<string>();
    const [username, setUsername] = useState<string>();
    const { userObject, setUserObject } = useContext(AuthContext);
    const [files, setFiles] = useState<FileList | null>(null);

    async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
        ev.preventDefault();

        await axios.post('', {

        });
    }
    function uploadPhoto() {
        if (files === null || files === undefined) {
            return;
        }
        const data: any = new FormData();
        data.append('photos', files[0]);
        axios.post<UserData>('/data/uploadPhoto', data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }).then(response => {
            const userData = response.data;
            const newUserObject = {
                ...userObject, userData: userData
            } as UserObject;
            setUserObject(newUserObject);
            hideUploader();
        })
    }
    function showUploader(ev: React.MouseEvent<HTMLButtonElement>) {
        ev.currentTarget.classList.add('hidden');
        const elem = document.getElementById('uploader');
        elem?.classList.remove('hidden');
    }
    function hideUploader() {
        const elem = document.getElementById('uploader');
        const updAvatarBtn = document.getElementById('update-avatar-btn');
        elem?.classList.add('hidden');
        updAvatarBtn?.classList.remove('hidden');
    }

    return (
        <>
            <div className="pb-4">
                <div id="uploader" className="hidden flex gap-8 items-end">
                    <label className="w-20 cursor-pointer text-center border rounded-2xl p-4 text-2xl">
                        <input type="file" className="hidden" onChange={(e) => {
                            setFiles(e.target.files)
                        }} />
                        <span>+</span>
                    </label>
                    <div className="flex flex-col w-48">
                        {files &&
                            <p className="text-xs">{files[0].name}</p>
                        }
                        <button onClick={uploadPhoto} className="py-1 bg-primaryBg border-none rounded-md">
                            Upload
                        </button>
                    </div>
                </div>
                <button id="update-avatar-btn" onClick={showUploader} className="px-4 py-2 bg-primaryBg rounded-md border-none border-primaryBg mr-4">
                    Update Avatar
                </button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-4" action="">
                <div>
                    <label>Name</label>
                    <input className="my-2" type="text" value={home} onChange={(e) => { setHome(e.target.value); }}
                        placeholder="Name" />
                </div>
                <div>
                    <label>Username</label>
                    <input className="my-2" type="text" value={home} onChange={(e) => { setUsername(e.target.value); }}
                        placeholder="Username" />
                </div>
                <div className="">
                    <button className={`bg-primary hover:bg-onPrimaryBg p-2 mt-4 text-white rounded-xl inline-flex self-auto`}>Save</button>
                </div>
                {/* <p role="alert" className="confirmation text-onNeutralBg  text-xs italic text-center">No changes made!</p> */}
                {/* <p role="alert" className="confirmation text-onNeutralBg text-xs italic text-center">Updated!</p> */}
            </form>
        </>
    )
}