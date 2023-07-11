import { useState } from "react";
import PurchasedTab from "./inboxTabs/PurchasedTab";
import UpdatesTab from "./inboxTabs/UpdatesTab";
import MessagesTab from "./inboxTabs/MessagesTab";

const InboxSubPage = () => {

    const [tab, setTab] = useState("purchased");

    return (
        <div>
            <div className="flex justify-center">
                <ul className="menu bg-base-200 lg:menu-horizontal rounded-box mb-6">
                    <li>
                        <a onClick={() => setTab("purchased")}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                            Purchased Items
                            <span className="badge badge-xs badge-info"></span>
                        </a>
                    </li>
                    <li>
                        <a onClick={() => setTab("messages")}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                            </svg>
                            Messages
                            <span className="badge badge-sm">0</span>
                        </a>
                    </li>
                    <li>
                        <a onClick={() => setTab("updates")}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Updates
                            {/* <span className="badge badge-sm badge-warning">NEW</span> */}
                        </a>
                    </li>
                </ul>
            </div>
            {tab === "purchased" &&
                <PurchasedTab />
            }
            {tab === "messages" &&
                <MessagesTab />
            }
            {tab === "updates" &&
                <UpdatesTab />
            }
        </div>
    );
}

export default InboxSubPage;