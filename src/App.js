import Login from "./pages/Login";
import Register from "./pages/Register";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import LeftBar from "./components/LeftBar";
import RightBar from "./components/RightBar";
import Home from "./pages/Home";
import { Private } from "./components/Private";
import Profile from "./pages/Profile";
import { useSelector, useDispatch } from "react-redux";
import Post from "./components/Post";

import "./style.scss";
import { Detail } from "./pages/Detail";
import { useState } from "react";

function App() {
  const darkMode = useSelector((state) => state.app.darkMode);
  const [tag, setTag] = useState(null);

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <div className={`theme-${darkMode ? "dark" : "light"}`}>
          <Navbar />
          <div style={{ display: "flex" }}>
            <LeftBar />
            <div className="home-page" style={{ flex: 6 }}>
              <Home tag={tag} />
            </div>
            <RightBar tag={tag} setTag={setTag} />
          </div>
        </div>
      ),
    },
    {
      path: "/profiles/:username",
      element: (
        <div className={`theme-${darkMode ? "dark" : "light"}`}>
          <Navbar />
          <div style={{ display: "flex" }}>
            <LeftBar />
            <div className="home-page" style={{ flex: 6 }}>
              <Profile />
            </div>
            <RightBar />
          </div>
        </div>
      ),
    },
    {
      path: "/articles/:slug",
      element: (
        <div className={`theme-${darkMode ? "dark" : "light"}`}>
          <Navbar />
          <div style={{ display: "flex" }}>
            <LeftBar />
            <div className="home-page" style={{ flex: 6 }}>
              <Detail />
            </div>
            <RightBar />
          </div>
        </div>
      ),
    },
    // {
    //   path: "",
    //   element: <Private />,
    //   children: [
    //     {
    //       path: "settings",
    //       element: "",
    //     },
    //   ],
    // },
    {
      path: "login",
      element: <Login />,
    },
    {
      path: "register",
      element: <Register />,
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
