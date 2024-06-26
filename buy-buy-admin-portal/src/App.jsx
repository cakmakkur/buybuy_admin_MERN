import { useState } from "react";
import Menubar from "./components/Menubar";
import ManageProd from "./pages/ManageProd";
import AddProd from "./pages/AddProd";
import { Toaster } from "react-hot-toast";
import logo from "./assets/logo12.png";
import RequireAuth from "./utils/RequireAuth";
import { AuthContextProvider } from "./context/AuthContext";
import { Route, Routes } from "react-router-dom";

export default function App() {
  const [activeTab, setActiveTab] = useState("");
  return (
    <AuthContextProvider>
      <Routes>
        <Route element={<RequireAuth allowedRoles={[5151]} />}>
          <Route
            path="/"
            element={
              <>
                <Menubar setActiveTab={setActiveTab} />
                <Toaster
                  containerStyle={{
                    top: 100,
                    left: 20,
                    bottom: 0,
                    // right: 20,
                  }}
                />
                <div className="main">
                  {activeTab === "manage" ? (
                    <ManageProd />
                  ) : activeTab === "add" ? (
                    <AddProd />
                  ) : (
                    <div className="bckg_logo_div">
                      <img src={logo} alt="" />
                    </div>
                  )}
                </div>
              </>
            }
          />
        </Route>
      </Routes>
    </AuthContextProvider>
  );
}
