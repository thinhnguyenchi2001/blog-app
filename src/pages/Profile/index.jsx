import "./profile.scss";
import * as React from "react";

import Posts from "../../components/Posts";
import { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useState } from "react";
import { httpClient } from "../../httpClient.ts";
import { useSelector } from "react-redux";
import { setDarkMode, setToken, setCurrentUser } from "../../store";
import { useDispatch } from "react-redux";
import { SnackbarComponent } from "../../components/SnackbarComponent";

const Profile = () => {
  const currentUser = useSelector((state) => state.app.user);
  const currentUserName = useSelector((state) => state.app.user?.username);
  const params = useParams();
  const dispatch = useDispatch();
  const userName = params.username;
  const [articles, setArticles] = useState([]);
  const [user, setUser] = useState(null);
  const [jpg, setJpg] = useState(currentUser?.image || "");
  const [userNameEdit, setUserNameEdit] = useState(currentUser?.username || "");
  const [bio, setBio] = useState(currentUser?.bio || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [newPassword, setNewPassword] = useState("");
  const location = useLocation();
  const [editMode, setEditMode] = useState(location.state.editMode);
  const [severityType, setSeverityType] = useState("warning");

  const EditUser = (e) => {
    e.preventDefault();
    httpClient
      .put(`/user`, {
        user: {
          email: email.trim(),
          password: newPassword.trim(),
          username: userNameEdit.trim(),
          bio: bio.trim(),
          image: jpg.trim(),
        },
      })
      .then((response) => {
        setUser(response.data.user);
        dispatch(setToken(response.data.user.token));
        dispatch(setCurrentUser(response.data.user));
        localStorage.setItem("userToken", response.data.user.token);
        setSeverityType("success");
      })
      .catch(() => setSeverityType("error"));
  };

  const getUser = () => {
    httpClient.get(`/profiles/${userName}`).then((response) => {
      setUser(response.data.profile);
    });
  };

  const MyArticles = () => {
    httpClient.get(`/articles?author=${userName}`).then((response) => {
      setArticles(response.data.articles);
    });
  };

  const FavoritedArticles = () => {
    httpClient.get(`/articles?favorited=${userName}`).then((response) => {
      setArticles(response.data.articles);
    });
  };

  useEffect(() => {
    getUser();
    MyArticles();
    const newLocation = location.state.editMode;
    setEditMode(newLocation);
  }, [params, location.state.editMode]);

  const FollowUser = () => {
    httpClient
      .post(`/profiles/${userName}/follow`)
      .then((response) => setUser(response.data.profile));
  };

  const UnFollowUser = () => {
    httpClient
      .delete(`/profiles/${userName}/follow`)
      .then((response) => setUser(response.data.profile));
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "2%",
  };

  return (
    <div className="profile">
      <div className="images">
        <img
          src="https://www.slashfilm.com/img/gallery/chainsaw-man-trailer-a-new-demon-hunting-blood-soaking-anime-enters-the-ring/l-intro-1659708800.jpg"
          alt=""
          className="cover"
        />
        <img src={user?.image} alt="" className="profilePic" />
      </div>

      <div className="profileContainer">
        <div className="uInfo">
          <div className="center">
            <span>{user?.username}</span>

            {user?.username !== currentUserName ? (
              <>
                {user?.following ? (
                  <button onClick={UnFollowUser}>unfollow</button>
                ) : (
                  <button onClick={FollowUser}>follow</button>
                )}
              </>
            ) : (
              <>
                {editMode ? (
                  <button onClick={() => setEditMode(false)}>
                    See Profile
                  </button>
                ) : (
                  <button onClick={() => setEditMode(true)}>
                    Edit Profile Setting
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {editMode ? (
          <form
            style={{
              display: "flex",
              flexDirection: "column",
              width: "80%",
              margin: "0 auto",
            }}
            action=""
          >
            <label style={{ textAlign: "center", paddingBottom: "20px" }}>
              Setting Profile
            </label>

            <input
              style={{
                border: "1px solid #dbdbdb",
                outline: "none",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "6px",
              }}
              placeholder="jpg"
              type="text"
              onChange={(e) => setJpg(e.target.value)}
              value={jpg}
            />
            <input
              style={{
                border: "1px solid #dbdbdb",
                outline: "none",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "6px",
              }}
              type="text"
              placeholder="Username"
              onChange={(e) => setUserNameEdit(e.target.value)}
              value={userNameEdit}
            />
            <input
              style={{
                border: "1px solid #dbdbdb",
                outline: "none",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "6px",
              }}
              placeholder="Short bio about you"
              onChange={(e) => setBio(e.target.value)}
              value={bio}
            />
            <input
              style={{
                border: "1px solid #dbdbdb",
                outline: "none",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "6px",
              }}
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <input
              style={{
                border: "1px solid #dbdbdb",
                outline: "none",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "6px",
              }}
              type="text"
              placeholder="New Password"
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
            />

            <button
              style={{ border: "none", backgroundColor: "transparent" }}
              onClick={(e) => EditUser(e)}
            >
              <SnackbarComponent severityType={severityType} content="save" />
            </button>
          </form>
        ) : (
          <>
            {" "}
            <div className="select-type-posts">
              <div
                style={{ padding: "20px", cursor: "pointer" }}
                onClick={() => {
                  MyArticles();
                }}
              >
                My Articles
              </div>
              <div
                style={{ padding: "20px", cursor: "pointer" }}
                onClick={() => {
                  FavoritedArticles();
                }}
              >
                {" "}
                Favorited Articles
              </div>
            </div>{" "}
            <Posts dataArticles={articles} />
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
