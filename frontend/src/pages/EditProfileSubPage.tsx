import { useContext, useState } from "react";
import MyCombobox from "../components/MyCombobox";
import { AuthContext } from "../components/AuthContext";
import * as Api from "../network/api";
import { ProfileCredentials } from "../network/api";
import { UserObject } from "../models/userObject";

interface EditProfileSubPageProps {
    races: { id: number; name: string }[];
    regions: { id: number; name: string }[];
    origins: { id: number; name: string }[];
}

export default function EditProfileSubPage({ races, regions, origins }: EditProfileSubPageProps) {
    const { userObject, setUserObject } = useContext(AuthContext);
    const [base, setBase] = useState<string>(userObject?.userData.base || "");
    const [bio, setBio] = useState<string>(userObject?.userData.bio || "");
    const [origin, setOrigin] = useState<string>(userObject?.userData.origin || "");
    const [race, setRace] = useState<string>(userObject?.userData.race || "");

    const racesCopy = [...races].map(race => race.name);
    const regionsCopy = [...regions].map(region => region.name);
    const originsCopy = [...origins].map(origin => origin.name);

    async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
        ev.preventDefault();

        const newUserData = await Api.updateProfile({ base: base, bio: bio, origin: origin, race: race } as ProfileCredentials);

        const newUserObject = {
            user: userObject?.user,
            userData: { ...userObject?.userData, ...newUserData }
        } as UserObject;

        if (JSON.stringify(newUserObject) !== JSON.stringify(userObject)) {
            showAlerts("change");
        }
        else {
            showAlerts("nochange");
        }

        setUserObject(newUserObject);
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
            <div>
                <label>Race</label>
                <p className="text-gray-500 text-sm">What kind of creature are you?</p>
                <MyCombobox list={races} choice={race ? racesCopy.indexOf(race) : 0} className="uppercase" onChange={setRace} />
            </div>
            <div>
                <label>Origin</label>
                <p className="text-gray-500 text-sm">Which planet or moon do you hail from?</p>
                <MyCombobox list={origins} choice={origin ? originsCopy.indexOf(origin) : 0} className="uppercase" onChange={setOrigin} />
            </div>
            <div>
                <label>Base</label>
                <p className="text-gray-500 text-sm">The region on our beautiful mars you landed on.</p>
                <MyCombobox list={regions} choice={base ? regionsCopy.indexOf(base) : 0} className="uppercase" onChange={setBase} />
            </div>
            <div>
                <label>
                    <h2>Bio</h2>
                    <p className="text-gray-500 text-sm">Describe yourself.</p>
                </label>
                <textarea className="textarea text-neutral" value={bio} onChange={(e) => { setBio(e.target.value); }}
                    placeholder="your bio ..." />
            </div>
            {/* <MyDisclosure /> */}
            <button className={`mt-4 bg-primary hover:bg-onPrimaryBg p-2 text-white rounded-xl`}>Save</button>
            <p role="alert" id="alert-nochange" className="hidden text-onNeutralBg opacity-70 text-xs italic text-center">No changes made.</p>
            <p role="alert" id="alert-change" className="hidden text-onNeutralBg opacity-70 text-xs italic text-center">Updated!</p>

        </form>
    )
}
