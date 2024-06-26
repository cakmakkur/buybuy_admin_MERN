import useAxiosPrivate from "./useAxiosPrivate";
import toast from "react-hot-toast";
import toastConfigs from "./toastConfig";

const useLogout = () => {
  const axiosPrivate = useAxiosPrivate();
  const LOGOUT_URL = import.meta.env.VITE_LOGOUT_URL

  const logout = async () => {
    try {
      const response = await axiosPrivate.get(LOGOUT_URL);
      toast.success("Logged out successfully", toastConfigs);
      console.log(response);
    } catch (err) {
      toast.error("Error occured", toastConfigs);
      console.log(err);
    }
  }
  return logout
};
export default useLogout