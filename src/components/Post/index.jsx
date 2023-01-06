import "./post.scss";
import moment from "moment/moment";

import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../Comments";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { httpClient } from "../../httpClient.ts";
import { useSelector } from "react-redux";
import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { SnackbarComponent } from "../../components/SnackbarComponent";

const ITEM_HEIGHT = 48;

const Post = ({ dataArticle, loading, setLoading }) => {
  const [countComments, setCountComments] = useState([]);
  const [postData, setPostData] = useState(dataArticle);
  const currentUser = useSelector((state) => state.app.user);
  const [comment, setComment] = useState(false);
  const currentUserName = useSelector((state) => state.app.user?.username);
  const [title, setTitle] = useState(postData.title);
  const [description, setDescription] = useState(postData.description);
  const [body, setBody] = useState(postData.body);
  const [severityType, setSeverityType] = useState("success");

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);

  const [anchorEl, setAnchorEl] = useState(null);
  const openMore = anchorEl ? true : false;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const Delete = () => {
    httpClient
      .delete(`/articles/${dataArticle?.slug}`)
      .then((response) => setLoading(!loading));
    handleClose();
  };

  const SaveEdit = (e) => {
    e.preventDefault();
    httpClient
      .put(`/articles/${dataArticle?.slug}`, {
        article: {
          title: title,
          description: description,
          body: body,
          // tagList: [...postData.tagList],
        },
      })
      .then((response) => {
        {
          setSeverityType("success");
          setPostData(response.data.article);
          handleClose();
          setLoading(!loading);
        }
      })
      .catch(() => setSeverityType("error"));
  };

  const getCountComment = () => {
    httpClient
      .get(`/articles/${dataArticle?.slug}/comments`)
      .then((response) => {
        setCountComments(response.data.comments?.length);
      });
  };

  useEffect(() => getCountComment(), []);

  const LikeArticle = () => {
    if (currentUser) {
      if (postData?.favorited) {
        httpClient
          .delete(`/articles/${dataArticle?.slug}/favorite`)
          .then((response) => setPostData(response.data.article));
      } else {
        httpClient
          .post(`/articles/${dataArticle?.slug}/favorite`)
          .then((response) => setPostData(response.data.article));
      }
    } else {
      navigate("/login");
    }
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
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={dataArticle.author?.image} alt="" />
            <div className="details">
              <Link
                state={{ editMode: false }}
                to={`/profiles/${dataArticle.author?.username}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{dataArticle.author.username}</span>
              </Link>
              <span className="date">
                {moment(`${dataArticle.createdAt}`).format("MMMM Do YYYY")}
              </span>
            </div>
          </div>
          <div className="more-icon">
            <MoreHorizIcon
              style={{ cursor: "pointer", padding: "10px" }}
              id="basic-button"
              aria-controls={openMore ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openMore ? "true" : undefined}
              onClick={handleClick}
            />
          </div>
          <Menu
            className="menu"
            id="long-menu"
            MenuListProps={{
              "aria-labelledby": "long-button",
            }}
            anchorEl={anchorEl}
            open={openMore}
            onClose={handleClose}
            PaperProps={{
              style: {
                maxHeight: ITEM_HEIGHT * 4.5,
                width: "20ch",
              },
            }}
          >
            <MenuItem
              key="more"
              selected={"more" === "Pyxis"}
              onClick={handleClose}
            >
              <Link
                style={{ color: "black" }}
                className="link-menu"
                to={`/articles/${dataArticle.slug}`}
              >
                More
              </Link>
            </MenuItem>
            {dataArticle.author?.username === currentUserName ? (
              <MenuItem
                key="edit"
                selected={"edit" === "Pyxis"}
                onClick={handleOpen}
              >
                Edit
              </MenuItem>
            ) : null}
            {dataArticle.author?.username === currentUserName ? (
              <MenuItem
                key="delete"
                selected={"delete" === "Pyxis"}
                onClick={Delete}
              >
                Delete
              </MenuItem>
            ) : null}
          </Menu>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Edit Post
                <div className="userInfo">
                  <img src={currentUser?.image} alt="" />
                  <div className="details">
                    <Link
                      to={`/profiles/${currentUser?.username}`}
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                      }}
                    >
                      <span className="name">{currentUser?.username}</span>
                    </Link>
                  </div>
                </div>
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <div
                  style={{ display: "flex", flexDirection: "column" }}
                  action=""
                >
                  <input
                    style={{
                      border: "1px solid #dbdbdb",
                      outline: "none",
                      padding: "10px",
                      marginBottom: "10px",
                    }}
                    placeholder="Article Title"
                    type="text"
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    required
                  />
                  <input
                    style={{
                      border: "1px solid #dbdbdb",
                      outline: "none",
                      padding: "10px",
                      marginBottom: "10px",
                    }}
                    type="text"
                    placeholder="What's this article about?"
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    required
                  />
                  <textarea
                    style={{
                      border: "1px solid #dbdbdb",
                      outline: "none",
                      padding: "10px",
                      marginBottom: "10px",
                    }}
                    placeholder="Write your article "
                    name=""
                    id=""
                    rows="5"
                    onChange={(e) => setBody(e.target.value)}
                    value={body}
                    required
                  ></textarea>

                  <ul
                    style={{
                      display: "flex",
                      listStyle: "none",
                      flexWrap: "wrap",
                    }}
                  >
                    {postData.tagList.map((tag, index) => (
                      <li
                        key={tag + "tagList"}
                        style={{
                          display: "flex",
                          padding: "1px 10px",
                          margin: "2px",
                          backgroundColor: "grey",
                          borderRadius: "6px",
                          color: "white",
                        }}
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>

                  <button
                    style={{ border: "none", backgroundColor: "transparent" }}
                    onClick={(e) => SaveEdit(e)}
                  >
                    <SnackbarComponent
                      severityType={severityType}
                      content="save"
                    />
                  </button>
                </div>
              </Typography>
            </Box>
          </Modal>
        </div>
        <div className="content">
          <h4 style={{ marginBottom: "10px" }}>{dataArticle.title}</h4>
          <p>{dataArticle.description}</p>
          <ul
            style={{
              display: "flex",
              columnGap: "10px",
              marginTop: "10px",
              fontSize: "12px",
              justifyContent: "end",
            }}
          >
            {dataArticle.tagList.map((tag) => (
              <li key={tag + "tagArticle"}>{tag}</li>
            ))}
          </ul>
          {/* <img src={dataArticle.author?.image} alt="" /> */}
        </div>
        <div className="info">
          <div className="item">
            {postData.favorited ? (
              <FavoriteOutlinedIcon onClick={LikeArticle} />
            ) : (
              <FavoriteBorderOutlinedIcon onClick={LikeArticle} />
            )}
            {postData.favoritesCount} Likes
          </div>
          <div className="item" onClick={() => setComment(!comment)}>
            <TextsmsOutlinedIcon />
            {countComments} Comments
          </div>
          <Link to={`/articles/${postData.slug}`}>
            <div className="item">...See more</div>
          </Link>
        </div>
        {comment && (
          <Comments setCountComments={setCountComments} article={postData} />
        )}
      </div>
    </div>
  );
};

export default Post;
