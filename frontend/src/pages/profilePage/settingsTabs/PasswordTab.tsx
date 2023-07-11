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

    function showAlerts(action: string) {
        const elem = document.getElementById('alert-' + action);
        elem?.classList.remove('hidden');
        setTimeout(function () {
            elem?.classList.add('hidden');
        }, 3000);
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" action="">
            {/* <div>
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); }}
                    placeholder="Password" />
            </div> */}
            <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium base-content">Password</label>
                <input type="password" id="password" className="bg-base-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Password" required />
            </div>
            {/* <div>
                <label>New Password</label>
                <input type="password" value={newPassword} onChange={(e) => { setNewPassword(e.target.value); }}
                    placeholder="New Password" />
            </div> */}
            <div>
                <label htmlFor="new_password" className="block mb-2 text-sm font-medium base-content">New Password</label>
                <input type="password" id="new_password" className="bg-base-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="New Password" required />
            </div>
            {/* <div>
                <label>Confirm New Password</label>
                <input type="password" value={newPasswordConfirm} onChange={(e) => { setNewPasswordConfirm(e.target.value); }}
                    placeholder="Confirm New Password" />
            </div> */}
            <div>
                <label htmlFor="confirm_password" className="block mb-2 text-sm font-medium base-content">New Password (Re-enter)</label>
                <input type="password" id="confirm_password" className="bg-base-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Confirm Password" required />
            </div>
            <button className="btn btn-neutral btn-sm btn-block">Submit</button>
            <Link className="underline" to="/settings/forgot-password">Forgot password?</Link>
            {/* <p role="alert" className="confirmation text-xs italic text-center">No changes made.</p> */}
            {/* <p role="alert" className="confirmation text-xs italic text-center">Updated!</p> */}
        </form>
    )
}