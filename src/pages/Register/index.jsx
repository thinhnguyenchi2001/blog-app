import { Link } from "react-router-dom";
import "./register.scss";
import { httpClient } from "../../httpClient.ts";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const Register = (e) => {
    e.preventDefault();
    httpClient
      .post("/users", {
        user: {
          username: `${userName}`,
          email: `${email}`,
          password: `${password}`,
        },
      })
      .then(() => {
        {
          navigate("/login");
        }
      })
      .catch((error) => console.log(error));
  };
  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>Lama Social.</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cum,
            alias totam numquam ipsa exercitationem dignissimos, error nam,
            consequatur.
          </p>
          <span>Do you have an account?</span>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
        <div className="right">
          <h1>Register</h1>
          <form>
            <input
              type="text"
              placeholder="Enter your username..."
              onChange={(e) => setUserName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Enter your email..."
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Enter your password..."
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={(e) => Register(e)}>Register</button>
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

export default Register;
