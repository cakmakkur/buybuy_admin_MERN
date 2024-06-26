import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import toastConfigs from "../config/toastConfig";
import background_img from "../assets/logo12.png";

interface ReqOptionsType {
  method: string;
  headers: {
    "Content-Type": string;
  };
  credentials: RequestCredentials;
  body: string;
}

export default function Login() {
  const [isFocused, setIsFocused] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { setAuth } = useAuthContext();

  const LOGIN_URL: string = import.meta.env.VITE_URL_ADMIN_LOGIN;

  if (!LOGIN_URL) {
    throw new Error("Environment variable VITE_URL_LOGIN is not defined");
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (username === "" || password === "")
      return toast.error("All fields must be filled", toastConfigs);

    const creds = {
      username,
      password,
    };
    const reqOptions: ReqOptionsType = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(creds),
    };
    try {
      if (username && password) {
        const response = await fetch(LOGIN_URL, reqOptions);
        const data = await response.json();
        if (response.status === 403)
          return toast.error("No such user found!", toastConfigs);
        if (response.status === 401)
          return toast.error("Wrong password!", toastConfigs);
        if (!response.ok) return toast.error("An error occured", toastConfigs);
        setAuth(data);
      }
    } catch (err) {
      toast.error("An error occured", toastConfigs);
      console.log(err);
    }
  };

  const handleFocus = (param: string) => {
    setIsFocused(param);
  };

  const handleBlur = () => {
    setIsFocused("");
  };

  function handleUsernameInput(username: string) {
    setUsername(username);
  }
  function handlePasswordInput(password: string) {
    setPassword(password);
  }

  return (
    <div className="form_box">
      <div className="bckg_logo_div">
        <img src={background_img} alt="" />
      </div>
      <form className="user_form" action="">
        <h1>Login to your account</h1>
        <div className="username_div">
          <label
            className={
              isFocused === "username" || username !== ""
                ? "label_disappear"
                : ""
            }
            htmlFor="username"
          >
            Username
          </label>
          <input
            onFocus={() => handleFocus("username")}
            onBlur={handleBlur}
            name="username"
            type="text"
            onChange={(e) => handleUsernameInput(e.target.value)}
            value={username}
          />
        </div>
        <div className="password_div">
          <label
            className={
              isFocused === "password" || password !== ""
                ? "label_disappear"
                : ""
            }
            htmlFor="password"
          >
            Password
          </label>
          <input
            onFocus={() => handleFocus("password")}
            onBlur={handleBlur}
            onChange={(e) => handlePasswordInput(e.target.value)}
            name="password"
            type="password"
            value={password}
          />
        </div>
        <button onClick={handleSubmit} className="submit_button" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}
