import { useEffect, useState, useContext } from "react";
import { ProductWithId } from "../models/product";
import { GlobalContext } from "../components/GlobalContext";
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
        // fetch("https://fakestoreapi.com/products")
        //     .then((res) => res.json())
        //     .then((json) => console.log(json));

        //     fetch('https://dummyjson.com/products')
        //         .then(res => res.json())
        //         .then(function (data) {
        //             const products = data.products;
        //             products.map((product: { id: any; }) => delete product.id);
        //         });
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
        <div className="flex flex-col w-full items-center gap-5 mt-10">
            <div>
                <select onChange={filterProducts} name="category" defaultValue="all" className="select w-full max-w-xs">
                    <option key="0" value="all">ALL</option>
                    {!!categories.length && categories.map((category, index) => (
                        <option key={index} value={category}>{category.toUpperCase()}</option>
                    ))}
                </select>
            </div>
            <div className="bg-white">
                <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                    <h2 className="sr-only">Products</h2>

                    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                        {filteredProducts.map((product, index) => (
                            <a key={index} onClick={() => { setOpenedProduct(product); setShowProductQuickview(true); }} className="group cursor-pointer">
                                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                                    <img
                                        src={product.images[0]}
                                        alt={product.title}
                                        className="h-full w-full object-cover object-center group-hover:opacity-75"
                                    />
                                </div>
                                <h3 className="mt-4 text-sm text-gray-700">{product.title}</h3>
                                <p className="mt-1 text-lg font-medium text-gray-900">{product.price}</p>
                            </a>
                        ))}
                        {openedProduct && 
                            <ProductQuickview {...openedProduct} />
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StorePage;