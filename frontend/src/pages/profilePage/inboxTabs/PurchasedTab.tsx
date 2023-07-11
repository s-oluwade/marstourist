import axios from "axios";
import { useEffect, useState, useContext } from "react";

const PurchasedTab = () => {

    const [purchased, setPurchased] = useState<Purchased[] | null>(null);

    useEffect(() => {

        async function getPurchase() {
            const { data } = await axios.get<Purchased[]>("/sales/purchase");
            setPurchased(data);
        }

        getPurchase();
    }, [])

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