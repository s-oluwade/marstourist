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

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" action="">
            <div>
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); }}
                    placeholder="Password" />
            </div>
            <div>
                <label>New Password</label>
                <input type="password" value={newPassword} onChange={(e) => { setNewPassword(e.target.value); }}
                    placeholder="New Password" />
            </div>
            <div>
                <label>Confirm New Password</label>
                <input type="password" value={newPasswordConfirm} onChange={(e) => { setNewPasswordConfirm(e.target.value); }}
                    placeholder="Confirm New Password" />
            </div>
            <button className={`mt-4 bg-primary hover:bg-onPrimaryBg p-2 text-white rounded-xl`}>Submit</button>
            <Link className="underline text-onNeutralBg" to="/forgot-password">Forgot password?</Link>
            {/* <p role="alert" className="confirmation text-onNeutralBg  text-xs italic text-center">No changes made!</p> */}
            {/* <p role="alert" className="confirmation text-onNeutralBg text-xs italic text-center">Updated!</p> */}
        </form>
    )
}