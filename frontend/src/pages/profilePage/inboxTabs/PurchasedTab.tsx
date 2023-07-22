import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../components/Providers/AuthContext";
import { UserContext } from "../../../components/Providers/UserContext";

const PurchasedTab = () => {

    const [purchased, setPurchased] = useState<Purchased[] | null>(null);
    const { setUserNotifications } = useContext(UserContext)
    const { user } = useContext(AuthContext)

    useEffect(() => {

        (async function getPurchase() {
            const { data } = await axios.get<Purchased[]>("/sales/purchase");
            setPurchased(data);
        })();

        async function removeNotification(id: string) {
            axios.put('/notifications/remove/' + id, ["purchase"], { headers: { "Content-Type": "application/json" } })
                .then(response => {
                    if (response.data) setUserNotifications(response.data);
                })
        }
        if (user) {
            removeNotification(user._id);
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setUserNotifications, user])

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[720px] overflow-auto">
            {purchased &&
                purchased.map((purchase, index) => {
                    return <div key={index}>
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