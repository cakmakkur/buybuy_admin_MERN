import { Outlet } from "react-router-dom";
import Login from "../components/Login";
import { useAuthContext } from "../context/AuthContext";

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuthContext();
  return auth?.roles?.find((role) => allowedRoles?.includes(role)) ? (
    <Outlet />
  ) : (
    <>
      <Login />
    </>
  );
};

export default RequireAuth;
