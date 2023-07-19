import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ConfirmationModal from "../components/ConfirmationModal";
import { AuthContext } from "../components/Providers/AuthContext";
import { GlobalContext } from "../components/Providers/GlobalContext";
import { UserContext } from "../components/Providers/UserContext";
import { Cart } from "../models/cart";
import { ProductWithId } from "../models/product";
import { User } from "../models/user";

const purchaseConfirmationTitle = "Purchase with credit";

interface CartItem {
    productId: string;
    title: string,
    imageUrl: string,
    brand: string,
    category: string,
    quantity: number;
}

const ShoppingCartPage = () => {
    const [products, setProducts] = useState<ProductWithId[]>([]);
    const { cart, setCart } = useContext(UserContext);
    const [totalCost, setTotalCost] = useState(0);
    const { notifications, modalResponse, setModalResponse, setShowConfirmationModal } = useContext(GlobalContext);
    const [numberOfItems, setNumberOfItems] = useState(0);
    const [purchaseAlerts, setPurchaseAlerts] = useState<JSX.Element[]>([]);
    const { user, setUser } = useContext(AuthContext);

    useEffect(() => {
        async function add() {
            const { data } = await axios.get<ProductWithId[]>("/products");
            setProducts(data);
        }
        if (products.length === 0) {
            add();
        }

        if (cart) {
            let cost = 0;
            for (const item of Object.keys(cart.products)) {
                if (item === "total") {
                    continue;
                }

                if (products.length > 0) {
                    cost += [...products].filter(prod => prod._id === item)[0].price * cart.products[item].count;
                }
            }
            setTotalCost(cost);
            setNumberOfItems(cart.products["total"].count);
        }

    }, [cart, products, products.length])

    useEffect(() => {

        if (modalResponse === purchaseConfirmationTitle && cart && numberOfItems > 0) {
            if (hasFunds(totalCost)) {

                const cartItems = [] as CartItem[];

                for (const item of Object.keys(cart.products)) {

                    if (item !== "total") {
                        const prod = products.filter(prod => prod._id === item)[0];
                        const cartItem = {
                            productId: item,
                            quantity: cart.products[item].count,
                            title: prod.title,
                            imageUrl: prod.images[0],
                            brand: prod.brand,
                            category: prod.category,
                        } as CartItem;
                        cartItems.push(cartItem);
                    }
                }
                axios.post<User>('/sales/purchase', [cartItems, totalCost / 1000], { headers: { "Content-Type": "application/json" } })
                    .then(response => {
                        setPurchaseAlerts([successToast(purchaseAlerts.length)]);
                        if (notifications && user) {
                            axios.post('/notifications/add/' + user._id, ["purchase"], { headers: { "Content-Type": "application/json" } })
                                .then(response => {
                                    console.log(response.data);
                                })
                            // setNotifications({ ...notifications });
                        }
                        setCart(null);
                        setUser(response.data);
                    });
            }
            else {
                setPurchaseAlerts([errorToast(purchaseAlerts.length)]);
            }
        }
        setModalResponse("");
        function hasFunds(amount: number) {
            if (user) {
                return user.credit > (amount / 1000);
            }
            return false;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modalResponse, purchaseAlerts, setModalResponse, totalCost, user])

    async function removeFromCart(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
        e.preventDefault();

        if (cart) {
            const { data } = await axios.put<Cart>('/sales/cart/remove', [id, cart.products[id].count]);
            setCart(data);
        }
    }

    async function reduceFromCart(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
        e.preventDefault();
        const { data } = await axios.put<Cart>('/sales/cart/remove', [id, 1]);
        setCart(data);
    }

    async function addToCart(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
        e.preventDefault();
        const { data } = await axios.put<Cart>('/sales/cart/add', { item: id });
        setCart(data);
    }

    function successToast(key: number) {
        return (
            <div key={key} id="purchase-alert-success" className="alert alert-success">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Purchased complete.</span>
                <button onClick={() => setPurchaseAlerts([])} className="btn btn-xs btn-circle btn-outline">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
        )
    }

    function errorToast(key: number) {
        return (

            <div key={key} id="purchase-alert-error" className="alert alert-error">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Insufficient funds.</span>
                <button onClick={() => setPurchaseAlerts([])} className="btn btn-xs btn-circle btn-outline">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
        )
    }

    return (
        <div className="container mx-auto">

            <div className="flex shadow-md my-10 min-w-max">
                <div className="w-3/4 bg-white px-10 py-10">
                    {products.length > 0 && cart && cart.products["total"].count > 0 &&
                        <>
                            <div className="flex justify-between border-b pb-8">
                                <h1 className="font-semibold text-2xl">Shopping Cart</h1>
                                <h2 className="font-semibold text-2xl">{cart.products["total"].count} Items</h2>
                            </div>
                            <div className="flex mt-10 mb-5">
                                <h3 className="font-semibold text-gray-600 text-xs uppercase w-2/5">Product Details</h3>
                                <h3 className="font-semibold text-gray-600 text-xs uppercase w-1/5 text-center">Quantity</h3>
                                <h3 className="font-semibold text-gray-600 text-xs uppercase w-1/5 text-center">Price</h3>
                                <h3 className="font-semibold text-gray-600 text-xs uppercase w-1/5 text-center">Total</h3>
                            </div>

                            {Object.keys(cart.products).map(function (productId, idx) {
                                if (productId === "total") {
                                    return
                                }
                                const item = products.filter((product) => product._id === productId)[0];

                                return (
                                    <div key={idx} className="flex items-center hover:bg-gray-100 -mx-8 px-6 py-5">
                                        <div className="flex w-2/5">
                                            <div className="w-20">
                                                <img className="h-24" src={item.images[0]} alt="" />
                                            </div>
                                            <div className="flex flex-col justify-between ml-4 flex-grow">
                                                <span className="font-bold text-sm">{item.title}</span>
                                                <span className="text-red-500 text-xs">{item.brand}</span>
                                                <a href="#" onClick={(e) => removeFromCart(e, productId)} className="font-medium hover:text-red-500 text-gray-500 text-sm">Remove</a>
                                            </div>
                                        </div>
                                        <div className="flex justify-center w-1/5">
                                            <a onClick={(e) => reduceFromCart(e, productId)} className="flex cursor-pointer">
                                                <svg className="fill-current text-gray-600 w-3" viewBox="0 0 448 512"><path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                                                </svg>
                                            </a>
                                            <input className="mx-2 border text-center w-8" type="text" readOnly value={cart.products[productId].count} />

                                            <a onClick={(e) => addToCart(e, productId)} className="flex cursor-pointer">
                                                <svg className="fill-current text-gray-600 w-3" viewBox="0 0 448 512">
                                                    <path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                                                </svg>
                                            </a>
                                        </div>
                                        <span className="text-center w-1/5 font-semibold text-sm">
                                            {item.price.toLocaleString("en-US", {
                                                style: "currency",
                                                currency: "USD",
                                            })}
                                        </span>
                                        <span className="text-center w-1/5 font-semibold text-sm">
                                            {(item.price * cart.products[productId].count).toLocaleString("en-US", {
                                                style: "currency",
                                                currency: "USD",
                                            })}
                                        </span>
                                    </div>
                                )
                            })}
                        </>
                    }

                    <Link to='/store' className="cursor-pointer inline-flex font-medium text-primary text-sm mt-10">
                        <svg className="fill-current mr-2 text-primary w-4" viewBox="0 0 448 512"><path d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z" /></svg>
                        Continue Shopping
                    </Link>

                </div>

                <div id="summary" className="w-1/4 px-8 py-10">
                    <h1 className="font-semibold text-2xl border-b pb-8">Order Summary</h1>
                    <div className="flex justify-between mt-10 mb-5">
                        <span className="font-semibold text-sm uppercase">Items {cart && cart.products["total"].count}</span>
                        <span className="font-semibold text-sm">{totalCost}$</span>
                    </div>
                    <div className="flex flex-col gap-2 mt-10">
                        <p>Pay with mars credit</p>
                        <p>1 mars credit = $1,000</p>
                        <button onClick={() => setShowConfirmationModal(true)} className="btn btn-block btn-secondary btn-sm">
                            Pay with {totalCost > 0 ? ((totalCost) / 1000).toFixed(3) : 0} Mars credit
                        </button>
                    </div>
                    <div className="toast toast-start">
                        {purchaseAlerts.map((purchaseAlert) => purchaseAlert)}
                    </div>
                    <ConfirmationModal message={`Buy ${numberOfItems} items with ${totalCost > 0 ? (totalCost / 1000).toFixed(3) : 0} mrs?`} title={purchaseConfirmationTitle} />
                </div>
            </div>
        </div>
    );
}

export default ShoppingCartPage;