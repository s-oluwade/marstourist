import axios from 'axios';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function GeneralSubPage() {
    const [password, setPassword] = useState<string>();
    const [newPassword, setNewPassword] = useState<string>();
    const [newPasswordConfirm, setNewPasswordConfirm] = useState<string>();

    async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
        ev.preventDefault();
        await axios.post('', {});
    }

    // function showAlerts(action: string) {
    //     const elem = document.getElementById('alert-' + action);
    //     elem?.classList.remove('hidden');
    //     setTimeout(function () {
    //         elem?.classList.add('hidden');
    //     }, 3000);
    // }

    return (
        <form onSubmit={handleSubmit} className='flex flex-col gap-4' action=''>
            <div className='text-error text-sm'>Currently unfunctional</div>
            <div>
                <label htmlFor='password' className='mb-2 block text-sm font-medium'>
                    Password
                </label>
                <input
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                    type='password'
                    id='password'
                    className='block w-full rounded-lg border bg-base-100 p-2.5 text-sm text-gray-900 focus:border-neutral focus:ring-neutral dark:bg-neutral dark:text-neutral-content dark:focus:border-accent'
                    placeholder='Password'
                    required
                />
            </div>
            <div>
                <label htmlFor='new_password' className='mb-2 block text-sm font-medium'>
                    New Password
                </label>
                <input
                    value={newPassword}
                    onChange={(e) => {
                        setNewPassword(e.target.value);
                    }}
                    type='password'
                    id='new_password'
                    className='block w-full rounded-lg border bg-base-100 p-2.5 text-sm text-gray-900 focus:border-neutral focus:ring-neutral dark:bg-neutral dark:text-neutral-content dark:focus:border-accent'
                    placeholder='New Password'
                    required
                />
            </div>
            <div>
                <label htmlFor='confirm_password' className='mb-2 block text-sm font-medium'>
                    New Password (Re-enter)
                </label>
                <input
                    value={newPasswordConfirm}
                    onChange={(e) => {
                        setNewPasswordConfirm(e.target.value);
                    }}
                    type='password'
                    id='confirm_password'
                    className='block w-full rounded-lg border bg-base-100 p-2.5 text-sm text-gray-900 focus:border-neutral focus:ring-neutral dark:bg-neutral dark:text-neutral-content dark:focus:border-accent'
                    placeholder='Confirm Password'
                    required
                />
            </div>
            <button className='btn-neutral btn-block btn-sm btn dark:btn-accent'>Submit</button>
            <div
                className='tooltip-close tooltip-info tooltip tooltip-bottom'
                data-tip='not yet implemented'
            >
                <Link className='text-sm underline' to='#'>
                    Forgot password?
                </Link>
            </div>

            {/* <p role="alert" className="confirmation text-xs italic text-center">No changes made.</p> */}
            {/* <p role="alert" className="confirmation text-xs italic text-center">Updated!</p> */}
        </form>
    );
}
