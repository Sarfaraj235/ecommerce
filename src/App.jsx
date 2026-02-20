import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Navigation from './customer/components/navigation/Navigation';
import HomePage from './customer/components/pages/homePage/HomePage';
import Footer from './customer/components/footer/Footer';
import Product from './customer/components/product/Product';
import ProductDetails from './customer/components/productDetail/ProductDetails';
import Cart from './customer/components/carts/Cart';
import CheckOut from './customer/components/checkouts/CheckOut';
import OrdersPage from './customer/components/orders/OrdersPage';
import OrderDetails from './customer/components/orders/OrderDetails';
import { Route, Routes } from 'react-router-dom';
import CustomerRouters from './rounters/CustomerRouters';



function App() {

  return (
    <>

    <Routes>

    <Route path='/*' element={<CustomerRouters/>}></Route>

    </Routes>
  


    </>
  )
}

export default App
