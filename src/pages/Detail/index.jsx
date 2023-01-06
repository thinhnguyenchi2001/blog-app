import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "@mui/icons-material/Edit";
import { Link, useParams } from "react-router-dom";
import Comments from "../../components/Comments";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { httpClient } from "../../httpClient.ts";
import { useSelector } from "react-redux";
import moment from "moment/moment";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { SnackbarComponent } from "../../components/SnackbarComponent";

export const Detail = () => {
  const params = useParams();
  const slug = params.slug;
  const [postData, setPostData] = useState([]);
  const currentUser = useSelector((state) => state.app.user);
  const [comment, setComment] = useState(false);
  const [countComments, setCountComments] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [severityType, setSeverityType] = useState("success");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
    setLoading(!loading);
  };

  const handleClose = () => {
    setOpen(false);
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

  const SaveEdit = (e) => {
    e.preventDefault();
    httpClient
      .put(`/articles/${postData?.slug}`, {
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
        }
      })
      .catch(() => setSeverityType("error"));
  };

  useEffect(() => {
    httpClient.get(`/articles/${slug}/comments`).then((response) => {
      setCountComments(response.data.comments.length);
    });
  }, []);

  useEffect(() => {
    httpClient
      .get(`/articles/${slug}`)
      .then((response) => {
        setPostData(response.data.article);
      })
      .then(() => {
        setBody(postData.body);
        setTitle(postData.title);
        setDescription(postData.description);
      });
  }, [loading]);

  const LikeArticle = () => {
    if (currentUser) {
      if (postData?.favorited) {
        httpClient
          .delete(`/articles/${slug}/favorite`)
          .then((response) => setPostData(response.data.article));
      } else {
        httpClient
          .post(`/articles/${slug}/favorite`)
          .then((response) => setPostData(response.data.article));
      }
      console.log("a");
    } else {
      navigate("/login");
    }
  };
  return (
    <div style={{ padding: "20px 70px" }}>
      {" "}
      <div className="post">
        <div className="container">
          <div className="user">
            <div className="userInfo">
              <img src={postData?.author?.image} alt="" />
              <div className="details">
                <Link
                  state={{ editMode: false }}
                  to={`/profiles/${postData?.author?.username}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <span className="name">{postData?.author?.username}</span>
                </Link>
                <span className="date">
                  {moment(`${postData?.createdAt}`).format("MMMM Do YYYY")}
                </span>
              </div>
            </div>
          </div>
          <div className="content">
            <h3>{postData.title}</h3>
            <br />
            <p>{postData.body}</p>
            <ul
              style={{
                display: "flex",
                columnGap: "10px",
                marginTop: "10px",
                fontSize: "12px",
                justifyContent: "end",
              }}
            >
              {postData.tagList?.map((tag) => (
                <li>{tag}</li>
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
            {currentUser?.username === postData.author?.username ? (
              <div onClick={handleOpen} className="item">
                <EditIcon />
                Edit
              </div>
            ) : null}
          </div>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Creat Post
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
                  ></textarea>

                  <ul
                    style={{
                      display: "flex",
                      listStyle: "none",
                      flexWrap: "wrap",
                    }}
                  >
                    {postData.tagList?.map((tag, index) => (
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
          {comment && (
            <Comments setCountComments={setCountComments} article={postData} />
          )}
        </div>
      </div>
    </div>
  );
};
