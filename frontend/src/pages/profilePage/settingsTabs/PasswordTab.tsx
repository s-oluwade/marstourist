import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function GeneralSubPage() {
    const [password, setPassword] = useState<string>();
    const [newPassword, setNewPassword] = useState<string>();
    const [newPasswordConfirm, setNewPasswordConfirm] = useState<string>();

    async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
        ev.preventDefault();

        await axios.post('', {

        });
    }

    // function showAlerts(action: string) {
    //     const elem = document.getElementById('alert-' + action);
    //     elem?.classList.remove('hidden');
    //     setTimeout(function () {
    //         elem?.classList.add('hidden');
    //     }, 3000);
    // }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" action="">
            <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium base-content">Password</label>
                <input
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); }}
                    type="password"
                    id="password"
                    className="bg-base-100 border focus:border-neutral dark:focus:border-accent dark:bg-neutral dark:text-neutral-content text-gray-900 text-sm rounded-lg focus:ring-neutral block w-full p-2.5"
                    placeholder="Password" required />
            </div>
            <div>
                <label htmlFor="new_password" className="block mb-2 text-sm font-medium">New Password</label>
                <input
                    value={newPassword}
                    onChange={(e) => { setNewPassword(e.target.value); }}
                    type="password"
                    id="new_password"
                    className="bg-base-100 border focus:border-neutral dark:focus:border-accent dark:bg-neutral dark:text-neutral-content text-gray-900 text-sm rounded-lg focus:ring-neutral block w-full p-2.5"
                    placeholder="New Password" required />
            </div>
            <div>
                <label htmlFor="confirm_password"
                    className="block mb-2 text-sm font-medium">New Password (Re-enter)</label>
                <input
                    value={newPasswordConfirm}
                    onChange={(e) => { setNewPasswordConfirm(e.target.value) }}
                    type="password"
                    id="confirm_password"
                    className="bg-base-100 border focus:border-neutral dark:focus:border-accent dark:bg-neutral dark:text-neutral-content text-gray-900 text-sm rounded-lg focus:ring-neutral block w-full p-2.5"
                    placeholder="Confirm Password" required />
            </div>
            <button className="btn btn-neutral btn-sm btn-block dark:btn-accent">Submit</button>
            <div className="tooltip tooltip-close tooltip-bottom tooltip-info" data-tip="not yet implemented">
                <Link className="underline text-sm" to="#">Forgot password?</Link>
            </div>

            {/* <p role="alert" className="confirmation text-xs italic text-center">No changes made.</p> */}
            {/* <p role="alert" className="confirmation text-xs italic text-center">Updated!</p> */}
        </form>
    )
}