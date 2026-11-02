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
          <Route path="payment-gateway" element={<AdminPaymentGetway/>} />
          <Route path="referral-tree" element={<AdminReferralTree/>} />
          <Route path="bank-details" element={<AdminBackDetails />} />
          <Route path="forgot-password" element={<AdminForgotPassword />} />

        </Route>

        <Route path="/doc-test" element={<DocxExtractionTest />} />
      </Routes>

      
    </div>
  )
}
