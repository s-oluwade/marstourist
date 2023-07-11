import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { GlobalContext } from "../../../components/Providers/GlobalContext";
import { AuthContext } from "../../../components/Providers/AuthContext";

const PurchasedTab = () => {

    const [purchased, setPurchased] = useState<Purchased[] | null>(null);
    const { notifications, setNotifications } = useContext(GlobalContext)
    const { user } = useContext(AuthContext)

    useEffect(() => {

        async function getPurchase() {
            const { data } = await axios.get<Purchased[]>("/sales/purchase");
            setPurchased(data);
        }

        if (user && notifications && notifications[user._id]) {
            const filtered = notifications[user._id].filter(p => p !== "purchase");
            notifications[user._id] = filtered;
            setNotifications({ ...notifications });
        }

        getPurchase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setNotifications, user])

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[720px] overflow-auto">
            {purchased &&
                purchased.map(purchase => {
                    return <div>
                        <img className="h-auto max-w-full rounded-lg" src={purchase.imageUrl} alt="" />
                        <div>
                            {purchase.title}
                        </div>
                        <div>
                            {purchase.quantity}
                        </div>
                        <div>
                            tags
                        </div>
                    </div>
                })}

        </div>
    );
}

export default PurchasedTab;