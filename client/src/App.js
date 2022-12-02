import './index.scss'
import "./assets/scss/themes.scss";
import React, {useState, useEffect} from 'react';
import {CssBaseline} from '@material-ui/core';
import {BrowserRouter as Router,  Routes, Route,  Navigate} from 'react-router-dom';
import {Navbar, Cart, Checkout} from './components';
import {Login, Register} from './screens';
import {commerce} from './lib/commerce';
import {isUserAuthenticated} from "./helpers/authUtils";
import LeftSidebarMenu from './components/LeftSidebarMenu/LeftSidebarMenu';
import Dashboard from './screens/Dashboard/index';
import { useLocationEffect } from './hooks/actions';
import ReactGA from 'react-ga'

const Main = () => {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({});
    const [order, setOrder] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useLocationEffect((location) => {
        console.log('changed to ' + location.pathname)
        ReactGA.set({ page: location.pathname })
        ReactGA.pageview(location.pathname)
    })



    useEffect(() => {}, [isAuthenticated]);
    
    const fetchProducts = async () => {
        const {data} = await commerce.products.list();

        setProducts(data);
    };

    const fetchCart = async () => {
        setCart(await commerce.cart.retrieve());
    };

    const handleAddToCart = async (productId, quantity) => {
        const item = await commerce.cart.add(productId, quantity);

        setCart(item.cart);
    };

    const handleUpdateCartQty = async (lineItemId, quantity) => {
        const response = await commerce.cart.update(lineItemId, {quantity});

        setCart(response.cart);
    };

    const handleRemoveFromCart = async (lineItemId) => {
        const response = await commerce.cart.remove(lineItemId);

        setCart(response.cart);
    };

    const handleEmptyCart = async () => {
        const response = await commerce.cart.empty();

        setCart(response.cart);
    };

    const refreshCart = async () => {
        const newCart = await commerce.cart.refresh();

        setCart(newCart);
    };

    const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
        try {
            const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder);

            setOrder(incomingOrder);

            refreshCart();
        } catch (error) {
            setErrorMessage(error.data.error.message);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCart();
    }, []);

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    if (!isUserAuthenticated()) {
        return (
                <div className='flex flex-1'>
                <CssBaseline/>
       
       <Navbar totalItems={
                  cart.total_items
              }
              handleDrawerToggle={handleDrawerToggle}/>

          <div className="w-full layout-wrapper ">
                    <Routes>
                        <Route path="/" element={<Dashboard products={products}
                                    onAddToCart={handleAddToCart}
                                    handleUpdateCartQty/>}/>
                        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />}/>
                        <Route path="/register" element={<Register setIsAuthenticated={setIsAuthenticated} />}/>
                        {isUserAuthenticated() ?   <Route path="*" element={<Navigate to="/dashboard" />}/> :    <Route path="*" element={<Navigate to="/"/>}/>}
                    </Routes>
                </div>
            </div>
        );
    }

    return (
            <div className='flex flex-1'>
                <CssBaseline/>
       
             <Navbar totalItems={
                        cart.total_items
                    }
                    handleDrawerToggle={handleDrawerToggle}/>

                <div className="layout-wrapper d-lg-flex">
                    {isUserAuthenticated() && <LeftSidebarMenu setIsAuthenticated={setIsAuthenticated} />}
                    <div>
                        < Routes>
                        <Route  path="/" element={<Dashboard products={products}
                                    onAddToCart={handleAddToCart}
                                    handleUpdateCartQty/>}/>
                            <Route  path="/dashboard" element={<Dashboard products={products}
                                    onAddToCart={handleAddToCart}
                                    handleUpdateCartQty/>} />
                            <Route  path="/cart" element={<Cart cart={cart}
                                    onUpdateCartQty={handleUpdateCartQty}
                                    onRemoveFromCart={handleRemoveFromCart}
                                    onEmptyCart={handleEmptyCart}/>} />
                            <Route path="/checkout" element={<Checkout cart={cart}
                                    order={order}
                                    onCaptureCheckout={handleCaptureCheckout}
                                    error={errorMessage}/>} />
                            <Route path="/login" element={<Login/>}/>
                            <Route path="/register" element={<Register/>} />
                            {isUserAuthenticated() ?   <Route path="*" element={<Navigate to="/dashboard"/>}/> :    <Route path="*" element={<Navigate to="/"/>}/>}
                        </ Routes>
                    </div>
                </div>
            </div>

    ) 
};

const App = () => {
    return (
       <Router>
         <Main/>
       </Router>
    );
}

export default App;
