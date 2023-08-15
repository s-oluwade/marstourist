import axios from 'axios';
import { useContext, useState } from 'react';
import { AuthContext } from '../../../components/Providers/AuthContextProvider';
import { User } from '../../../models/user';

export default function GeneralSubPage() {
    const { user, setUser } = useContext(AuthContext);
    const [fullname, setFullname] = useState<string | undefined>(user?.fullname);
    const [username, setUsername] = useState<string | undefined>(user?.username);
    const [uploading, setUploading] = useState(false);
    const [files, setFiles] = useState<FileList | null>(null);

    async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
        ev.preventDefault();

        if (fullname?.trim() === user?.fullname && username === user?.username) {
            console.log('no change');
            showAlerts('nochange');
            return;
        }

        const { data } = await axios.put<User>(
            '/user',
            { fullname, username },
            { headers: { 'Content-Type': 'application/json' } }
        );

        if (JSON.stringify(data) !== JSON.stringify(user)) {
            showAlerts('change');
        } else {
            showAlerts('nochange');
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
        axios
            .put('/user/uploadPhoto', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            .then(() => {
                window.location.reload();
            });
    }
    function showUploader(ev: React.MouseEvent<HTMLButtonElement>) {
        ev.currentTarget.classList.add('hidden');
        const elem = document.getElementById('uploader');
        elem?.classList.remove('hidden');
    }
    function hideUploader() {
        setFiles(null);
        const file_uploader = document.getElementById('fileUploader') as HTMLFormElement;
        file_uploader.reset();
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
            <div className='pb-4'>
                <div id='uploader' className='hidden'>
                    <div className='flex items-end gap-8'>
                        <form action='' id='fileUploader'>
                            <label className='flex w-20 cursor-pointer justify-center rounded-2xl border p-4 text-center text-3xl'>
                                <input
                                    type='file'
                                    className='hidden'
                                    onChange={(e) => {
                                        setFiles(e.target.files);
                                    }}
                                />
                                <span className='h-10'>+</span>
                            </label>
                        </form>
                        {uploading ? (
                            <div className='flex w-48 flex-col break-words'>
                                {files && <p className='text-xs'>{files[0].name}</p>}
                                <span className='loading loading-spinner loading-md self-center'></span>
                            </div>
                        ) : (
                            <>
                                <div className='flex w-48 flex-col break-words'>
                                    {files && <p className='text-xs'>{files[0].name}</p>}
                                    <button onClick={uploadPhoto} className='btn-accent btn-sm btn'>
                                        Upload
                                    </button>
                                </div>
                                <button onClick={hideUploader} className='btn-square btn'>
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        className='h-6 w-6'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        stroke='currentColor'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth='2'
                                            d='M6 18L18 6M6 6l12 12'
                                        />
                                    </svg>
                                </button>
                            </>
                        )}
                    </div>
                </div>
                <button
                    onClick={showUploader}
                    id='update-avatar-btn'
                    className='btn-accent btn-sm btn'
                >
                    Update Avatar
                </button>
            </div>
            <form onSubmit={handleSubmit} className='mt-4 flex flex-col gap-6' action=''>
                <div>
                    <label
                        htmlFor='fullname'
                        className='base-content mb-2 block text-sm font-medium'
                    >
                        Name
                    </label>
                    <input
                        onChange={(e) => setFullname(e.target.value)}
                        type='text'
                        id='fullname'
                        className='block w-full rounded-lg border bg-base-100 p-2.5 text-sm text-gray-900 focus:border-neutral focus:ring-neutral dark:bg-neutral dark:text-neutral-content dark:focus:border-accent'
                        placeholder='John Doe'
                        defaultValue={user?.fullname}
                        required
                    />
                </div>
                <div>
                    <label
                        htmlFor='username'
                        className='base-content mb-2 block text-sm font-medium'
                    >
                        Username
                    </label>
                    <input
                        onChange={(e) => setUsername(e.target.value)}
                        type='text'
                        id='username'
                        className='block w-full rounded-lg border bg-base-100 p-2.5 text-sm text-gray-900 focus:border-neutral focus:ring-neutral dark:bg-neutral dark:text-neutral-content dark:focus:border-accent'
                        placeholder='johndoe'
                        defaultValue={user?.username}
                        required
                    />
                </div>
                <div className=''>
                    <button className='btn-neutral btn-block btn-sm btn dark:btn-accent'>
                        Save
                    </button>
                </div>
                <p
                    role='alert'
                    id='alert-nochange'
                    className='hidden text-center text-xs italic opacity-70'
                >
                    No changes made.
                </p>
                <p
                    role='alert'
                    id='alert-change'
                    className='hidden text-center text-xs italic opacity-70'
                >
                    Updated!
                </p>
            </form>
        </>
    );
}
