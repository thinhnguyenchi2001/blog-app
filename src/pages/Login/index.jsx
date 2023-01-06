import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import "./login.scss";
import { httpClient } from "../../httpClient.ts";
import { setDarkMode, setToken, setCurrentUser } from "../../store";
import { useDispatch } from "react-redux";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const Login = (e) => {
    e.preventDefault();
    httpClient
      .post("/users/login", {
        user: {
          email: `${email}`,
          password: `${password}`,
        },
      })
      .then((response) => {
        localStorage.setItem("userToken", response.data.user.token);
        dispatch(setToken(response.data.user.token));
        dispatch(setCurrentUser(response.data.user));
        dispatch(setDarkMode());
        navigate("/");
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <h1>Hello World.</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cum,
            alias totam numquam ipsa exercitationem dignissimos, error nam,
            consequatur.
          </p>
          <span>Don't you have an account?</span>
          <Link to="/register">
            <button>Register</button>
          </Link>
        </div>
        <div className="right">
          <h1>Login</h1>
          <form>
            <input
              type="text"
              placeholder="Username"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <button onClick={(e) => Login(e)}>Login</button>
            <span style={{ fontSize: "0.8rem" }}>
              Back to
              <Link
                to="/"
                style={{
                  textDecoration: "none",
                  paddingLeft: "0.2rem",
                  fontSize: "1rem",
                  textDecoration: "underline",
                }}
              >
                Home
              </Link>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
