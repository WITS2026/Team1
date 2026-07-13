import { Routes, Route } from "react-router-dom";
import { Authenticator } from "@aws-amplify/ui-react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/cart"
          element={
            <Authenticator>
              {({ signOut, user }) => (
                <>
                  <div className="flex justify-between items-center px-8 py-2 bg-gray-100">
                    <span>Welcome, {user?.signInDetails?.loginId}</span>
                    <button onClick={signOut} className="text-red-500 hover:underline">
                      Sign out
                    </button>
                  </div>
                  <Cart />
                </>
              )}
            </Authenticator>
          }
        />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
