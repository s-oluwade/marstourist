import axios from "axios";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import ShoppingCart from "../components/ShoppingCart";
import { GlobalContext } from "../components/GlobalContext";

const GunStorePage = () => {
    const [gunList, setGunList] = useState<any[]>();
    const [view, setView] = useState<string>("list");
    const [seed, setSeed] = useState(1);

    const { cartItems, setCartItems, setAddedToCart, cartCounter, setCartCounter } = useContext(GlobalContext);

    useEffect(() => {
        const loadGuns = async () => {
            const { data } = await axios.get('/data/guns');

            const products: {
                id: string;
                name: string;
                image: string;
                weaponType: string;
                manufacturer: string;
                elements: string[];
                price: string;
                qty: number;
            }[] = [];

            for (const item of data) {
                products.push({
                    id: item._id,
                    name: item.name,
                    image: item.image,
                    weaponType: item.weaponType,
                    manufacturer: item.manufacturer,
                    elements: item.elements,
                    price: "$50",
                    qty: 1,
                });
            }

            setGunList(Object.entries(products));
        }
        loadGuns();
    }, [])

    function changeView(view: ChangeEvent<HTMLSelectElement>) {
        setView(view.target.value);
    }

    function addToCart(e: any, gun: any) {
        localStorage.setItem('cart_counter', JSON.stringify(cartCounter + 1));

        for (const item of cartItems) {
            if (gun[1].name === item[1].name) {
                item[1].qty += 1;
                localStorage.setItem('cart', JSON.stringify([...cartItems]));
                setAddedToCart(true);
                return;
            }
        }

        localStorage.setItem('cart', JSON.stringify([...cartItems, gun]));
        setAddedToCart(true);
    }

    function clearCart() {
        localStorage.removeItem('cart');
        localStorage.removeItem('cart_counter');
        setCartItems([]);
        setCartCounter(0);
        reset();
    }

    function reset() {
        setSeed(Math.random());
    }

    function sortTable(column: string) {
        if (gunList) {
            if (column === "NAME") {
                if (gunList[0][1].name > gunList[1][1].name) {
                    const newCart = [...gunList].sort((a, b) => (a[1].name > b[1].name) ? 1 : (b[1].name > a[1].name) ? -1 : 0);
                    setGunList(newCart);
                }
                else {
                    const newCart = [...gunList].sort((a, b) => (a[1].name < b[1].name) ? 1 : (b[1].name < a[1].name) ? -1 : 0);
                    setGunList(newCart);
                }
            }
            else if (column === "WEAPONTYPE") {
                if (gunList[0][1].weaponType > gunList[gunList.length - 1][1].weaponType) {
                    const newCart = [...gunList].sort((a, b) => (a[1].weaponType > b[1].weaponType) ? 1 : (b[1].weaponType > a[1].weaponType) ? -1 : 0);
                    setGunList(newCart);
                }
                else {
                    const newCart = [...gunList].sort((a, b) => (a[1].weaponType < b[1].weaponType) ? 1 : (b[1].weaponType < a[1].weaponType) ? -1 : 0);
                    setGunList(newCart);
                }
            }
            else if (column === "MANUFACTURER") {
                if (gunList[0][1].manufacturer > gunList[gunList.length - 1][1].manufacturer) {
                    const newCart = [...gunList].sort((a, b) => (a[1].manufacturer > b[1].manufacturer) ? 1 : (b[1].manufacturer > a[1].manufacturer) ? -1 : 0);
                    setGunList(newCart);
                }
                else {
                    const newCart = [...gunList].sort((a, b) => (a[1].manufacturer < b[1].manufacturer) ? 1 : (b[1].manufacturer < a[1].manufacturer) ? -1 : 0);
                    setGunList(newCart);
                }
            }
        }
    }

    return (
        <div>
            <h1 className="text-center my-6 font-bold underline">BUY WEAPONS</h1>
            <div className="flex justify-between w-[1000px]">
                <div className="ml-12 flex gap-2 items-center">
                    <label htmlFor="cars">Choose a view:</label>
                    <select onChange={changeView} name="cars" id="cars">
                        <option key={"list"} value="list">List</option>
                        <option key={"grid"} value="grid">Grid</option>
                    </select>
                </div>
                <div className="flex gap-6 mr-28">
                    <ShoppingCart key={seed} />
                    <button className="bg-gray-600 p-1 rounded" onClick={clearCart}>Clear Cart</button>
                </div>
            </div>
            <br />
            <div>
                {gunList && view == "list" &&
                    <table className="table min-w-[1000px] px-10 mt-5">
                        {/* head */}
                        <thead>
                            <tr>
                                <th
                                    onClick={(e) => { sortTable("NAME") }}
                                    className="select-none cursor-pointer uppercase text-base">
                                    <div className="inline-flex">
                                        NAME
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                                        </svg>
                                    </div>
                                </th>
                                <th
                                    className="select-none cursor-pointer uppercase text-base">
                                    IMAGE
                                </th>
                                <th
                                    onClick={(e) => { sortTable("WEAPONTYPE") }}
                                    className="select-none cursor-pointer uppercase text-base">
                                    <div className="inline-flex">
                                        WEAPONTYPE
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                                        </svg>
                                    </div>
                                </th>
                                <th
                                    onClick={(e) => { sortTable("MANUFACTURER") }}
                                    className="select-none cursor-pointer uppercase text-base">
                                    <div className="inline-flex">
                                        MANUFACTURER
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                                        </svg>
                                    </div>
                                </th>
                                <th
                                    className="select-none cursor-pointer uppercase text-base">
                                    ELEMENTS
                                </th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {gunList.map((item: { [x: string]: any; }[], index) => (
                                <tr className="hover cursor-pointer" key={index}>
                                    <td className="font-semibold">{item[1]["name"]}</td>
                                    <td>
                                        <img src={item[1]["image"]} height={20} />
                                    </td>
                                    <td className="font-semibold">{item[1]["weaponType"]}</td>
                                    <td className="font-semibold">{item[1]["manufacturer"]}</td>
                                    <td>
                                        <div className="flex flex-wrap w-[100px] justify-center">
                                            {item[1]["elements"].map((element: any, index: number) => (<img key={index} src={element} width={30} />))}
                                        </div>
                                    </td>
                                    <td>
                                        <button onClick={(e) => { addToCart(e, item) }} className="btn btn-sm">Add to cart</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                }
                {gunList && view == "grid" &&
                    <div className="grid grid-cols-2 justify-items-center gap-5 p-10">
                        {gunList.map((item: { [x: string]: any; }[], index) => (
                            <div key={index} className="card card-compact w-96 bg-secondary shadow-xl py-2">
                                <figure><img src={item[1]["image"]} alt={item[1]["name"]} /></figure>
                                <div className="card-body">
                                    <h2 className="card-title">
                                        {item[1]["name"]}
                                    </h2>
                                    <div className="card-actions justify-start py-2">
                                        <div className="badge badge-outline">{item[1]["weaponType"]}</div>
                                        <div className="badge badge-outline">{item[1]["manufacturer"]}</div>
                                    </div>
                                    <div className="card-actions justify-end">
                                        <button onClick={(e) => { addToCart(e, item) }} className="btn btn-sm">Add to cart</button>
                                        <button className="btn btn-primary btn-sm">Buy Now</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                }
            </div>
        </div>
    );
}

export default GunStorePage;