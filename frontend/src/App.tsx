import { Route, Routes, useLocation } from "react-router-dom";
// ====Pages===
import { Home } from "./pages/Home/Home";
import { Signin } from "./pages/Signin/Signin";
import { Signup } from "./pages/Signup/Signup";
import { ProductByCategory } from "./pages/ProductByCategory/ProductByCategory";
import { ProductByName } from "./pages/ProductByName/ProductByName";
import { SingleProduct } from "./pages/SingleProduct/SingleProduct";
import { Cart } from "./pages/Cart/Cart";
import { SingleOrder } from "./pages/SingleOrder/SingleOrder";
import { PlaceOrder } from "./pages/PlaceOrder/PlaceOrder";
import OrderPlaced from "./pages/OrderPlaced/OrderPlaced";
import AccountMain from "./pages/Account/Account/AccountMain";
import AccountProfile from "./pages/Account/Profile/Profile";
import AccountPassword from "./pages/Account/Password/Password";
import AccountOrderHistory from "./pages/Account/OrderHistory/OrderHistory";
import AccountAddress from "./pages/Account/Address/Address";
import PasswordForgotMail from "./pages/PasswordForgot/PasswordForgotMail/PasswordForgotMail";
import PasswordForgotReset from "./pages/PasswordForgot/PasswordForgotReset/PasswordForgotReset";
import ChatApp from "./pages/ChatBot/ChatBot";
import PageNotFound404 from "./pages/ErrorPages/PageNotFound404/PageNotFound404";
import ServerError500 from "./pages/ErrorPages/ServerError500/ServerError500";
import ServerMaintaince503 from "./pages/ErrorPages/ServerMaintaince503/ServerMaintaince503";
import Forbidden403 from "./pages/ErrorPages/Forbidden403/Forbidden403";
import BadRequest400 from "./pages/ErrorPages/BadRequest400/BadRequest400";
// Components
import { NavBar } from "./components/layout/NavBar/NavBar";
import { Footer } from "./components/layout/Footer/Footer";
import ChatBotNavigator from "./components/layout/ChatBotNavigator/ChatBotNavigator";
import StoreProvider from "./context/store";
//
import { useStore } from "./context/store";
import { useEffect } from "react";

import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Slideshow } from "./pages/ImageSlideShow";
import ErrorPageWithBack from "./components/HOC/ErrorPageWithBack";
import { AdminDashboard } from "./pages/AdminPanel/AdminDashboard/AdminDashboard";
import AdminChatContact from "./pages/AdminPanel/AdminChatContact/AdminChatContact";
import AdminChatMessage from "./pages/AdminPanel/AdminChatMessage/AdminChatMessage";
import AdminPanel from "./pages/AdminPanel/AdminPanel/AdminPanel";
import { AdminProtectedRoute } from "./components/auth/AdminProtectedRout";

function App() {
  const { pathname } = useLocation();
  const { userDetails } = useStore();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <div className="App">
      <NavBar />
      <ChatBotNavigator />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/products/category/:categoryId/page/:pageNumber"
            element={<ProductByCategory />}
          />
          <Route
            path="/products/search/:productName/page/:pageNumber"
            element={<ProductByName />}
          />
          <Route path="/products/:productId" element={<SingleProduct />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:orderId"
            element={
              <ProtectedRoute>
                <SingleOrder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/placeorder"
            element={
              <ProtectedRoute>
                <PlaceOrder />
              </ProtectedRoute>
            }
          />

          <Route
            path="/order-placed"
            element={
              <ProtectedRoute>
                <OrderPlaced />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountMain />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/profile"
            element={
              <ProtectedRoute>
                <AccountProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/password"
            element={
              <ProtectedRoute>
                <AccountPassword />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/address"
            element={
              <ProtectedRoute>
                <AccountAddress />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/orders/page/:pageNumber"
            element={
              <ProtectedRoute>
                <AccountOrderHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forgot-password/mail"
            element={<PasswordForgotMail />}
          />
          <Route
            path="/forgot-password/reset"
            element={<PasswordForgotReset />}
          />
          <Route
            path="user/chat/:roomName/"
            element={
              <ProtectedRoute>
                <ChatApp />
              </ProtectedRoute>
            }
          />
          {/* Error pages */}
          <Route path="/*" element={<PageNotFound404 />} />
          <Route
            path="/error/500"
            element={
              <ErrorPageWithBack>
                <ServerError500 />
              </ErrorPageWithBack>
            }
          />
          <Route
            path="/error/403"
            element={
              <ErrorPageWithBack>
                <Forbidden403 />
              </ErrorPageWithBack>
            }
          />
          <Route
            path="/error/503"
            element={
              <ErrorPageWithBack>
                <ServerMaintaince503 />
              </ErrorPageWithBack>
            }
          />
          <Route
            path="/error/400"
            element={
              <ErrorPageWithBack>
                <BadRequest400 />
              </ErrorPageWithBack>
            }
          />
          <Route path="/image-slide-show" element={<Slideshow />} />

          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminPanel />
              </AdminProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="chat/message/:roomName/:username" element={<AdminChatMessage />} />
            <Route path="chat/contact" element={<AdminChatContact />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function Root() {
  return (
    <StoreProvider>
      <App />
    </StoreProvider>
  );
}
export default Root;
