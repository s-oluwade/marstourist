import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../components/Providers/AuthContext';
import axios from 'axios';
import { User } from '../models/user';

const rootURL = import.meta.env.VITE_API_ROOT_URL;
const defaultPhotoURL = `${rootURL}/uploads/73-730154_open-default-profile-picture-png.png`;

const Dashboard = () => {

    const [selectedMemberElement, setSelectedMemberElement] = useState<HTMLLIElement | null>(null);
    const [selectedMember, setSelectedMember] = useState<User | null>(null);
    const [tabs, setTabs] = useState<{ users: boolean; actions: boolean; statics: boolean }>({ users: true, actions: false, statics: false });
    const [userInformation, setUserInformation] = useState<User[]>([]);
    const { admin } = useContext(AuthContext);

    // Fetch All Users
    useEffect(() => {
        async function fetchAllUsers() {
            const { data } = await axios.get('/user/allUsers');

            setUserInformation(data[0]);
        }
        fetchAllUsers();
    }, [])

    // Switch tabs
    useEffect(() => {

        if (tabs.users) {
            document.getElementById("users")?.classList.remove("hidden");
            document.getElementById("users-btn")?.classList.add("active");
            document.getElementById("actions")?.classList.add("hidden");
            document.getElementById("actions-btn")?.classList.remove("active");
            document.getElementById("statics")?.classList.add("hidden");
            document.getElementById("statics-btn")?.classList.remove("active");
        }
        else if (tabs.actions) {
            document.getElementById("actions")?.classList.remove("hidden");
            document.getElementById("actions-btn")?.classList.add("active");
            document.getElementById("users")?.classList.add("hidden");
            document.getElementById("users-btn")?.classList.remove("active");
            document.getElementById("statics")?.classList.add("hidden");
            document.getElementById("statics-btn")?.classList.remove("active");
        }
        else if (tabs.statics) {
            document.getElementById("statics")?.classList.remove("hidden");
            document.getElementById("statics-btn")?.classList.add("active");
            document.getElementById("users")?.classList.add("hidden");
            document.getElementById("users-btn")?.classList.remove("active");
            document.getElementById("actions")?.classList.add("hidden");
            document.getElementById("actions-btn")?.classList.remove("active");
        }
    }, [tabs.users, tabs.actions, tabs.statics])

    if (!admin) {
        return <div>401 Unauthorized</div>
    }

    function deleteUser() {
        // Delete the selected member with a dialog for confirmation
    }

    function switchUserFocus(e: React.MouseEvent<HTMLLIElement>) {
        if (selectedMemberElement) {
            selectedMemberElement.firstElementChild?.classList.remove("active");
        }
        e.currentTarget.firstElementChild?.classList.add("active");
        setSelectedMemberElement(e.currentTarget);
        const email = e.currentTarget.getAttribute("data-email");
        const thisUser = [...userInformation].filter(user => user.email === email)[0];
        setSelectedMember(thisUser);
    }

    function memberDetails(member: User) {
        return (
            <ul>
                <li className='mb-4'>
                    <small className='italic'>Username</small>
                    <p className='text-lg text-warning'>{member.username}</p>
                </li>
                <li className='mb-4'>
                    <small className='italic'>Email</small>
                    <p className='text-lg text-warning'>{member.email}</p>
                </li>
                <li className='mb-4'>
                    <small className='italic'>Credit</small>
                    <p className='text-lg text-warning'>{member.credit}</p>
                </li>
                <li className='mb-4'>
                    <small className='italic'>Bio</small>
                    <p className='text-lg text-warning'>{member.bio || "_"}</p>
                </li>
                <li className='mb-4'>
                    <small className='italic'>Location</small>
                    <p className='text-lg text-warning'>{member.location || "_"}</p>
                </li>
            </ul>
        )
    }
    function sideMenu(summary: JSX.Element | null, bgcolor: string) {
        return (
            <ul className={`menu bg-${bgcolor} w-56 p-0 [&_li>*]:rounded-none h-full`}>
                <li className="menu-title">Admin [{admin?.name}]</li>
                <li className="menu-title">Mars Tourists (users)</li>
                {summary}
                {userInformation.map(
                    (user, index) => (
                        <li key={index} data-email={user.email} onClick={switchUserFocus}>
                            <a>
                                <span><img className='rounded-full' src={user.photo || defaultPhotoURL} alt={user.username} width={30} /></span>
                                <span>{user.fullname}</span>
                            </a>
                        </li>
                    ))
                }
            </ul>
        )
    }
    function generalTab() {
        return (
            <li onClick={switchUserFocus}>
                <a>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                    </svg>
                    GENERAL
                </a>
            </li>
        )
    }
    function globalTab() {
        return (
            <li onClick={switchUserFocus}>
                <a>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                    </svg>
                    GLOBAL
                </a>
            </li>
        )
    }

    return (
        <>
            <div id="dash" className='mt-20 max-h-[600px] w-[900px] min-w-[750px] mx-auto'>
                <section className='h-full'>
                    <div id="users" className="grid grid-cols-4 h-full">
                        {sideMenu(null, 'secondary')}
                        <div className='col-start-2 col-span-3 p-2 pl-10 bg-base-100'>
                            {selectedMember ?
                                <div>
                                    <header className="flex justify-between items-center py-2">
                                        <h1 className='text-xl menu-title'>{selectedMember.fullname || ""}</h1>
                                        <div className='flex gap-2'>
                                            <button onClick={() => { alert("Hey WHAT YOU DOING?? you can't edit a User's info come on. Dont abuse your power!") }} className="btn btn-info btn-sm rounded-none">Edit</button>
                                            <button onClick={deleteUser} className="btn btn-outline btn-error btn-sm rounded-none">Delete</button>
                                        </div>
                                    </header>
                                    <div className="h-full pt-5 leading-6">
                                        {memberDetails(selectedMember)}
                                    </div>
                                </div> :
                                <div>Select a user to view their info</div>
                            }
                        </div>
                    </div>
                    <div id="actions" className="grid grid-cols-4 hidden h-full">
                        {sideMenu(generalTab(), 'accent')}
                        <div className='p-5 col-start-2 col-span-3 flex flex-col items-center bg-base-100'>
                            <header className='text-xl menu-title'>
                                Actions
                            </header>
                        </div>
                    </div>
                    <div id="statics" className="grid grid-cols-4 hidden h-full">
                        {sideMenu(globalTab(), 'neutral')}
                        {selectedMember ?
                            <div className='p-5 col-start-2 col-span-3 flex flex-col items-center gap-10 bg-base-100'>
                                <header className='text-2xl'>STATICS</header>
                                <div className="stats shadow stats-vertical bg-base-200">
                                    <div className="stat">
                                        <div className="stat-figure text-primary">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                                        </div>
                                        <div className="stat-title">Total Likes</div>
                                        <div className="stat-value text-primary">25.6K</div>
                                        <div className="stat-desc">21% more than last month</div>
                                    </div>
                                    <div className="stat">
                                        <div className="stat-figure text-secondary">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                        </div>
                                        <div className="stat-title">Page Views</div>
                                        <div className="stat-value text-secondary">2.6M</div>
                                        <div className="stat-desc">21% more than last month</div>
                                    </div>
                                    <div className="stat">
                                        <div className="stat-figure text-secondary">
                                            <div className="avatar online">
                                                <div className="w-16 rounded-full">
                                                    <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="stat-value">86%</div>
                                        <div className="stat-title">Tasks done</div>
                                        <div className="stat-desc text-secondary">31 tasks remaining</div>
                                    </div>
                                </div>
                            </div> :
                            <div className='p-5 col-start-2 col-span-3 flex flex-col items-center gap-10 bg-base-100'>
                                <header className='text-2xl text-center'>GLOBAL STATS</header>
                                <div className="stats stats-vertical lg:stats-horizontal shadow bg-base-200">
                                    <div className="stat">
                                        <div className="stat-title">Downloads</div>
                                        <div className="stat-value">31K</div>
                                        <div className="stat-desc">Jan 1st - Feb 1st</div>
                                    </div>
                                    <div className="stat">
                                        <div className="stat-title">New Users</div>
                                        <div className="stat-value">4,200</div>
                                        <div className="stat-desc">↗︎ 400 (22%)</div>
                                    </div>
                                    <div className="stat">
                                        <div className="stat-title">New Registers</div>
                                        <div className="stat-value">1,200</div>
                                        <div className="stat-desc">↘︎ 90 (14%)</div>
                                    </div>
                                </div>
                                <div className="stats bg-primary text-primary-content">
                                    <div className="stat">
                                        <div className="stat-title">Account balance</div>
                                        <div className="stat-value">$89,400</div>
                                        <div className="stat-actions">
                                            <button className="btn btn-sm btn-success">Add funds</button>
                                        </div>
                                    </div>
                                    <div className="stat">
                                        <div className="stat-title">Current balance</div>
                                        <div className="stat-value">$89,400</div>
                                        <div className="stat-actions">
                                            <button className="btn btn-sm">Withdrawal</button>
                                            <button className="btn btn-sm">deposit</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </section>
                <div className="btm-nav left-auto right-auto bottom-auto relative">
                    <button id='users-btn' onClick={() => { setTabs({ users: true, actions: false, statics: false }); }} className="bg-secondary text-secondary-content">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                        <span className="btm-nav-label">Users</span>
                    </button>
                    <button id='actions-btn' onClick={() => { setTabs({ users: false, actions: true, statics: false }); }} className="bg-accent text-accent-content">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span className="btm-nav-label">Actions</span>
                    </button>
                    <button id='statics-btn' onClick={() => { setTabs({ users: false, actions: false, statics: true }); }} className="bg-neutral text-neutral-content">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        <span className="btm-nav-label">Statics</span>
                    </button>
                </div>
            </div>
        </>
    );
}

export default Dashboard;