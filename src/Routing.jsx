import React from 'react'
import { Route, Routes, Navigate } from "react-router-dom"
import HomePage from './Components/HomePage'
import BookReader from "./Pages/BookReader"
import About from './Pages/About'
import Contact from './Pages/Contact'
import Register from "./Components/Auth/Register"
import Login from './Components/Auth/Login'
import PdfQualityTest from './Pages/PdfQualifyText'
import AdminLogin from './Components/Auth/AdminLogin'
import AdminDashboard from './Components/Admin/AdminDashboard'
import AdminLayout from './Components/Admin/AdminLayout'
import AdminProducts from './Components/Admin/AdminProducts'
import AdminReferEarn from './Components/Admin/AdminReferEarn'
import AdminMyNetwork from './Components/Admin/AdminMyNetwork'
import AdminMyWallet from './Components/Admin/AdminMyWallet'
import AdminPaymentGetway from './Components/Admin/AdminPaymentGetway'
import AdminPayoutFunds from './Components/Admin/AdminPayoutFunds'
import AdminReferralTree from './Components/Admin/AdminReferralTree'
import AdminAllOrders from './Components/Admin/AdminAllOrders'
import AdminBackDetails from './Components/Admin/AdminBankDetails'
import AdminForgotPassword from './Components/Admin/AdminForgotPassword'
import AdminPayoutBatchDetails from './Components/Admin/AdminPayoutBatchDetails'
import DocxExtractionTest from './Test/DocxExtractionTest'


import UserLayout from "./Components/Users/UserLayout"
import Dashboard from "./Components/Users/dashboard"
import ReferEarn from "./Components/Users/ReferEarn";
import MyNetworkuser from "./Components/Users/MyNetworkuser";
import MyOrders from "./Components/Users/MyOrders";
import MyWallet from "./Components/Users/MyWallet";
import BankDetails from "./Components/Users/BankDetails";
import Chant from "./Components/Users/Chant";

import PrivacyPolicy from "./Pages/PrivacyPolicy";
import SecurityPolicy from "./Pages/SecurityPolicy";
import TermsConditions from "./Pages/TermsConditions";
import PaymentPolicy from "./Pages/PaymentPolicy";
import FAQ from "./Pages/FAQ";
import OrderCancellation from "./Pages/OrderCancellation";

// import BookReaderrs from "./Pages/BookReaderrs"

export default function Routing() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/reader/:id" element={<BookReader />} />
        {/* <Route path="/reader/:id" element={<BookReaderrs />} /> */}
        {/* <Route path="/reader/:id" element={<PdfQualityTest />} /> */}
        <Route path="/about" element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Routes  */}

        <Route path="/admin" element={<AdminLayout />} >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="refer-earn" element={<AdminReferEarn />} />
          <Route path="my-network" element={<AdminMyNetwork />} />
          <Route path="my-wallet" element={<AdminMyWallet />} />
          <Route path="payouts" element={<AdminPayoutFunds />} />
          <Route path="payouts/:batchId" element={<AdminPayoutBatchDetails />} />
          <Route path="orders" element={<AdminAllOrders />} />
          <Route path="payment-gateway" element={<AdminPaymentGetway />} />
          <Route path="referral-tree" element={<AdminReferralTree />} />
          <Route path="bank-details" element={<AdminBackDetails />} />
          <Route path="forgot-password" element={<AdminForgotPassword />} />

        </Route>

        {/* User ROutes  */}
        <Route path="/user" element={<UserLayout />} >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="referearn" element={<ReferEarn />} />
          <Route path="mynetwork" element={<MyNetworkuser />} />
          <Route path="myorders" element={<MyOrders />} />
          <Route path="mywallet" element={<MyWallet />} />
          <Route path="bankdetails" element={<BankDetails />} />
          <Route path="chant" element={<Chant />} />


        </Route>


        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/security-policy" element={<SecurityPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsConditions />} />
        <Route path="/payment-policy" element={<PaymentPolicy />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/order-cancellation" element={<OrderCancellation />} />





        <Route path="/doc-test" element={<DocxExtractionTest />} />
      </Routes>


    </div>
  )
}
