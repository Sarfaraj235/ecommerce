import React from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
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

const RequireCustomerAuth = ({ children }) => {
    const location = useLocation()
    const { jwt } = useSelector((state) => state.auth)

    if (!jwt) {
        const redirect = encodeURIComponent(`${location.pathname}${location.search}`)
        return <Navigate to={`/login?redirect=${redirect}`} replace />
    }

    return children
}

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
                <Route path="/cart" element={<RequireCustomerAuth><Cart /></RequireCustomerAuth>} />
                <Route path="/:levelOne/:levelTwo/:levelThree" element={<Product />} />
                <Route path="/product/:productId" element={<ProductDetails />} />
                <Route path="/checkout" element={<RequireCustomerAuth><CheckOut /></RequireCustomerAuth>} />
                <Route path="account/profile" element={<RequireCustomerAuth><HomePage /></RequireCustomerAuth>} />
                <Route path="account/order" element={<RequireCustomerAuth><OrdersPage /></RequireCustomerAuth>} />
                <Route path="account/order/:orderId" element={<RequireCustomerAuth><OrdersDetails /></RequireCustomerAuth>} />
                <Route path="account/payments" element={<RequireCustomerAuth><PaymentsPage /></RequireCustomerAuth>} />


            </Routes>

            <div>
                <Footer />
            </div>


        </div>
    )
}

export default CustomerRouters
