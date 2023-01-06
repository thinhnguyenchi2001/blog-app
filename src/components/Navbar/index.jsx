import "./navbar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  toggle,
  setToken,
  setDarkMode,
  setCurrentUser,
} from "../../store/index";

const Navbar = () => {
  const darkMode = useSelector((state) => state.app.darkMode);
  const currentUser = useSelector((state) => state.app.user);

  const navigate = useNavigate();
  const [drop, setDrop] = useState(false);
  const dispatch = useDispatch();
  const DropMenu = () => {
    setDrop(!drop);
  };
  const LogOut = () => {
    localStorage.removeItem("userToken");
    dispatch(setToken());
    dispatch(setDarkMode());
    dispatch(setCurrentUser(null));
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span>lamasocial</span>
        </Link>
        <div className="icon-navbar">
          {darkMode ? (
            <WbSunnyOutlinedIcon
              style={{ cursor: "pointer" }}
              onClick={() => dispatch(toggle())}
            />
          ) : (
            <DarkModeOutlinedIcon
              style={{ cursor: "pointer" }}
              onClick={() => dispatch(toggle())}
            />
          )}
        </div>
        {currentUser ? (
          <Link
            state={{ editMode: false }}
            to={`/profiles/${currentUser?.username}`}
          >
            <div className="icon-navbar">
              <PersonOutlinedIcon />
            </div>
          </Link>
        ) : null}
      </div>

      <div className="right">
        <div className="icon-navbar">
          <GridViewOutlinedIcon />
        </div>
        <div className="icon-navbar">
          <EmailOutlinedIcon />
        </div>
        <div className="icon-navbar">
          <NotificationsOutlinedIcon />
        </div>
        {currentUser ? (
          <div onClick={DropMenu} className="user ">
            <img alt="" src={currentUser.image} />
            <span>{currentUser.username}</span>
            <ul className={drop ? "nav-drop-menu active" : "nav-drop-menu"}>
              <Link
                state={{ editMode: false }}
                to={`/profiles/${currentUser.username}`}
              >
                <li>See all profile</li>
              </Link>
              <Link
                state={{ editMode: true }}
                to={`/profiles/${currentUser.username}`}
              >
                <li>Setting</li>
              </Link>
              <li onClick={LogOut}>Log Out</li>
            </ul>
          </div>
        ) : (
          <>
            <div className="icon-navbar" onClick={() => navigate("/login")}>
              Login
            </div>
            <div className="icon-navbar" onClick={() => navigate("/register")}>
              Register
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
