import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../components/Providers/GlobalContext";
import { UserContext } from "../components/Providers/UserContext";
import { Cart } from "../models/cart";
import { ProductWithId } from "../models/product";

const StorePage = () => {
    const [filteredProducts, setFilteredProducts] = useState<ProductWithId[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [category, setCategory] = useState<string>("all");
    const { products } = useContext(GlobalContext);
    const { cart, setCart } = useContext(UserContext);
    const [selectedTab, setSelectedTab] = useState("tab-all");

    useEffect(() => {
        if (products.length > 0) {

            if (categories.length == 0) {
                const temp: string[] = []
                for (const product of products) {
                    temp.push(product.category);
                }
                setCategories([...new Set(temp)]);
            }
            else {
                if (category == "all") {
                    setFilteredProducts(products);
                }
                else {
                    const temp = products.filter(product => product.category === category);
                    if (JSON.stringify(temp) !== JSON.stringify(filteredProducts)) {
                        setFilteredProducts(products.filter(product => product.category == category));
                    }
                }

                // category has changed, switch tab class
                if (!selectedTab.includes(category)) {
                    document.getElementById(selectedTab)?.classList.remove("tab-active");
                    document.getElementById(`tab-${category}`)?.classList.add("tab-active");
                    setSelectedTab(`tab-${category}`);
                }
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [products, filteredProducts, categories, category]);

    async function addToCart(e: React.MouseEvent<HTMLButtonElement>, id: string) {
        e.preventDefault();
        // Just increase cart counter while cart is being updated
        if (cart && cart.products["total"].count) {
            cart.products["total"].count += 1;
            setCart({ ...cart });
        }
        const { data } = await axios.put<Cart>('/sales/cart/add', { item: id });
        setCart(data);
    }

    function closeImageModal(e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement, MouseEvent>) {
        const modal = document.getElementById("image-modal");
        const modalImg = document.getElementById("modal-image");

        if (e.target !== modalImg) {
            if (modal) modal.classList.add('hidden');
        }
    }

    function showImageModal(src: string) {
        const modal = document.getElementById("image-modal");
        const modalImg = document.getElementById("modal-image");
        if (modal) modal.classList.remove('hidden');
        if (modalImg) {
            modalImg.setAttribute("src", src);
        }
    }

    return (
        <div className="flex flex-col w-full items-center gap-5 mt-2">
            <div id="shopping-categories-tabs" className="tabs">
                <a onClick={() => setCategory("all")} id={`tab-all`} key={0} className="tab tab-lg tab-lifted tab-active">All categories</a>
                {!!categories.length && categories.map((category, index) => (
                    <a onClick={() => setCategory(category)} id={`tab-${category}`} key={index} className="tab tab-lg tab-lifted capitalize">{category}</a>
                ))}

            </div>
            <div className="mx-auto min-h-[44rem]">
                <h2 className="sr-only">Products</h2>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredProducts.map((product, index) => (
                        <div key={index}
                            className="w-80 card card-compact bg-base-100 dark:bg-gray-800 shadow-sm transition-shadow hover:shadow-md">
                            <figure className="h-48" onClick={() => { showImageModal(product.images[0]) }}>
                                <img src={product.images[0]} alt="Shoes" className="cursor-pointer" />
                            </figure>
                            <div className="card-body">
                                <h2 className="card-title font-normal">{product.title}</h2>
                                <p>{product.description}</p>
                                {/* If a dog chews shoes whose shoes does he choose? */}
                                <div className="card-actions justify-between items-center">
                                    <div className="badge bg-transparent dark:text-neutral-content">
                                        {product.price.toLocaleString("en-US", {
                                            style: "currency",
                                            currency: "USD",
                                        })}
                                    </div>
                                    <button onClick={(e) => addToCart(e, product._id)} className="btn btn-outline btn-accent btn-xs">
                                        Add to cart
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div id="image-modal"
                        onClick={(e) => { closeImageModal(e) }}
                        className="hidden fixed top-0 left-0 z-40 w-screen bg-black/70">
                        <div className="flex justify-center items-center h-screen">
                            <a onClick={(e) => closeImageModal(e)} className="fixed z-50 top-10 right-20 text-white text-5xl font-bold cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </a>
                            <img id="modal-image" className="max-w-[50rem] max-h-[37.5rem] object-cover" />
                        </div>
                    </div>
                </div>
            </div>
            <footer className="w-full bg-transparent my-4">
                <div className="w-full pl-12 md:flex md:items-center md:justify-end md:gap-6">
                    <span className="text-xs text-neutral sm:text-center dark:text-neutral-content/90">
                        © 2023 Samuel Oluwade
                    </span>
                    <ul className="flex flex-wrap items-center mt-3 text-xs font-medium text-neutral/60 dark:text-neutral-content/90 sm:mt-0">
                        <li>
                            <a target="_blank" href="https://github.com/s-oluwade" className="mr-4 hover:underline md:mr-6 flex items-center">
                                Github
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                </svg>
                            </a>
                        </li>
                        <li>
                            <a target="_blank" href="https://www.cookiepolicygenerator.com/live.php?token=13A7pWhd9KInJXDPINssDYTkGQ2Q5ghI" className="mr-4 hover:underline md:mr-6 flex items-center">
                                Cookie Policy
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                </svg>
                            </a>
                        </li>
                    </ul>
                </div>
            </footer>
        </div>
    );
}

export default StorePage;