import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../components/Providers/AuthContext";
import { GlobalContext } from "../../../components/Providers/GlobalContext";
import axios from "axios";
import { User } from "../../../models/user";

export default function EditProfileSubPage() {
    const { user, setUser } = useContext(AuthContext);
    const { locations, setLocations } = useContext(GlobalContext);
    const [location, setLocation] = useState<string>("anon");
    const [bio, setBio] = useState<string>("");

    useEffect(() => {

        if (user) {
            setLocation(user.location);
            setBio(user.bio);
        }

        axios.get('/data/site-data')
        .then((response) => {
            setLocations(response.data.regions);
        });
    }, [user]);

    async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
        ev.preventDefault();

        const { data } = await axios.put<User>('/user/profile', { location, bio }, { headers: { "Content-Type": "application/json" } });

        if (JSON.stringify(data) !== JSON.stringify(user)) {
            showAlerts("change");
        }
        else {
            showAlerts("nochange");
        }

        setUser(data);
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
            {locations.length > 0 &&
                <form onSubmit={handleSubmit} className="flex flex-col gap-4" action="">
                    <div>
                        <label htmlFor="user_location_edit" className="block mb-2 text-sm font-medium text-base-content dark:text-neutral-content">Your location</label>
                        <select id="user_location_edit" onChange={(e) => setLocation(e.target.value)} value={location} className="bg-base-100 focus:outline-none focus:border-neutral dark:focus:border-accent dark:bg-neutral dark:text-neutral-content border text-base-content text-sm rounded-lg block w-full p-2.5">
                            <option key={0} value="anon">Anonymous</option>
                            {locations.map((loc, index) => (<option key={index + 1} value={loc}>{loc.replace(/(^\w|\s\w)/g, m => m.toUpperCase())}</option>))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="user_bio_edit" className="block mb-2 text-sm font-medium text-base-content dark:text-neutral-content">Your bio</label>
                        <textarea onChange={(e) => setBio(e.target.value)} id="user_bio_edit" rows={4} className="block p-2.5 w-full text-sm text-base-content bg-base-100 rounded-lg focus:outline-none focus:border-neutral dark:bg-gray-800 dark:text-neutral-content" placeholder="Write your thoughts here..." value={user?.bio} />
                    </div>
                    <button className="btn btn-neutral dark:btn-accent btn-sm btn-block">UPDATE</button>
                    <p role="alert" id="alert-nochange" className="hidden opacity-70 text-xs italic text-center">No changes made.</p>
                    <p role="alert" id="alert-change" className="hidden opacity-70 text-xs italic text-center">Updated!</p>
                </form>
            }
        </>
    )
}
