import { useEffect, useState, useContext } from "react";
import { ProductWithId } from "../models/product";
import { GlobalContext } from "../components/Providers/GlobalContext";
import ProductQuickview from "../components/ProductQuickview";
import axios from "axios";

const StorePage = () => {
    const [products, setProducts] = useState<ProductWithId[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<ProductWithId[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [category, setCategory] = useState<string>("all");
    const { setShowProductQuickview } = useContext(GlobalContext);
    const [openedProduct, setOpenedProduct] = useState<ProductWithId | null>(null);

    useEffect(() => {
        async function add() {
            const { data } = await axios.get<ProductWithId[]>("/products");
            setProducts(data);
        }
        if (products.length == 0) {
            add();
        }
        else {
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
            }
        }

    }, [products, filteredProducts, categories, category]);

    function filterProducts(e: React.ChangeEvent<HTMLSelectElement>) {
        setCategory(e.currentTarget.value);
    }

    return (
        <div className="flex flex-col w-full items-center gap-5 mt-2">
            <div>
                <select onChange={filterProducts} name="category" defaultValue="all" className="select font-normal">
                    <option key="0" value="all">ALL</option>
                    {!!categories.length && categories.map((category, index) => (
                        <option key={index} value={category}>{category.toUpperCase()}</option>
                    ))}
                </select>
            </div>
            <div className="mx-auto mt-8">
                <h2 className="sr-only">Products</h2>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredProducts.map((product, index) => (
                        <div key={index} onClick={() => { setOpenedProduct(product); setShowProductQuickview(true); }}
                            className="w-80 card card-compact bg-base-100 shadow-sm cursor-pointer transition-shadow hover:shadow-md">
                            <figure><img src={product.images[0]} alt="Shoes"
                                className="h-48 object-cover"
                            /></figure>
                            <div className="card-body">
                                <h2 className="card-title font-normal">{product.title}</h2>
                                <p>If a dog chews shoes whose shoes does he choose?</p>
                                <div className="card-actions justify-between items-center my-2">
                                    <div className="badge badge-outline">${product.price}</div>
                                    <button className="btn btn-outline btn-accent btn-xs">
                                        Add to cart
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {openedProduct &&
                        <ProductQuickview {...openedProduct} />
                    }
                </div>
            </div>
        </div>
    );
}

export default StorePage;