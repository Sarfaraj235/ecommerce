import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from '../customer/components/pages/homePage/HomePage'
import Cart from '../customer/components/carts/Cart'
import Navigation from '../customer/components/navigation/Navigation'
import Product from '../customer/components/product/Product'
import ProductDetails from '../customer/components/productDetail/ProductDetails'
import CheckOut from '../customer/components/checkouts/CheckOut'
import OrdersPage from '../customer/components/orders/OrdersPage'
import OrdersDetails from '../customer/components/orders/OrderDetails'
import PaymentsPage from '../customer/components/payments/PaymentsPage'
import Footer from '../customer/components/footer/Footer'

const CustomerRouters = () => {
    return (
        <div>
            <div>
                <Navigation />
            </div>

            <Routes>
                <Route path="/login" element={<HomePage />} />
                <Route path="/register" element={<HomePage />} />
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<Product />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/:levelOne/:levelTwo/:levelThree" element={<Product />} />
                <Route path="/product/:productId" element={<ProductDetails />} />
                <Route path="/checkout" element={<CheckOut />} />
                <Route path="account/profile" element={<HomePage />} />
                <Route path="account/order" element={<OrdersPage />} />
                <Route path="account/order/:orderId" element={<OrdersDetails />} />
                <Route path="account/payments" element={<PaymentsPage />} />


            </Routes>

            <div>
                <Footer />
            </div>


        </div>
    )
}

export default CustomerRouters
