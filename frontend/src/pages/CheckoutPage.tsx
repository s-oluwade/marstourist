import { useContext } from "react";
import { GlobalContext } from "../components/GlobalContext";
import { redirect } from "react-router-dom";

const CheckoutPage = () => {

    const { cartItems, setCartItems, cartCounter, setCartCounter } = useContext(GlobalContext);
    
    function processpayment() {
        console.log("Processing");
        redirect('/payment');
    }

    function removeItem(product: any) {
        const newCart = [...cartItems].filter(item => item[1].name !== product[1].name);
        localStorage.setItem('cart', JSON.stringify(newCart));
        localStorage.setItem('cart_counter', JSON.stringify(cartCounter - product[1].qty));
        setCartCounter(cartCounter - product[1].qty);
        setCartItems(newCart);
    }

    return (
        <div className="mt-10 flex flex-col gap-10">
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            <div>
                <ol>
                    {cartItems.map((product, index) =>
                    (
                        <>
                            <li key={index} className="grid grid-cols-2 py-3">
                                <div><img src={product[1].image} /></div>
                                <div className="col-start-2 justify-self-center self-center">
                                    <button onClick={() => {removeItem(product)} } className="btn btn-sm btn-outline btn-error">Remove</button>
                                </div>

                            </li>
                            <hr />
                        </>
                    ))}
                </ol>
            </div>
            <button onClick={processpayment} className="btn btn-info w-full">Checkout</button>
        </div>
    );
}

export default CheckoutPage;