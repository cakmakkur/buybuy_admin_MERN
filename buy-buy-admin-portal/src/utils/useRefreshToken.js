import { useAuthContext } from "../context/AuthContext";

const REFRESH_URL = import.meta.env.VITE_URL_REFRESH;

const useRefreshToken = () => {
  const { setAuth } = useAuthContext();

  const reqOptions = {
    // added this line
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };

  const refresh = async () => {
    console.log("Refreshing access token");
    const response = await fetch(REFRESH_URL, reqOptions);
    const data = await response.json();
    setAuth(data);
    return data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
