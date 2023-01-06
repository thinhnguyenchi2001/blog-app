import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Modal from "@mui/material/Modal";
import * as React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { httpClient } from "../../httpClient.ts";
import { SnackbarComponent } from "../../components/SnackbarComponent";

const Share = ({ setLoading, loading }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [open, setOpen] = React.useState(false);
  const [severityType, setSeverityType] = useState("warning");

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setTagList([]);
    setTitle("");
    setDescription("");
    setBody("");
  };
  const currentUser = useSelector((state) => state.app.user);
  const [tagList, setTagList] = useState([]);

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

  const CreateArticle = (e) => {
    if (e.key == "Enter") {
      e.preventDefault();
    } else {
      httpClient
        .post(`/articles`, {
          article: {
            title: `${title}`,
            description: `${description}`,
            body: `${body}`,
            tagList: [...tagList],
          },
        })
        .then(() => {
          setSeverityType("success");
          handleClose();
          setLoading(!loading);
        })
        .catch(() => setSeverityType("error"));
    }
  };

  return (
    <>
      {currentUser ? (
        <div className="share">
          <div className="container">
            <div className="top">
              <img alt="" src={currentUser.image} />
              <input
                onClick={handleOpen}
                type="text"
                placeholder={`What's on your mind?`}
              />
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
                    <img src={currentUser.image} alt="" />
                    <div className="details">
                      <Link
                        to={`/profiles/${currentUser.username}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <span className="name">{currentUser.username}</span>
                      </Link>
                    </div>
                  </div>
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
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
                      required
                    ></textarea>
                    <input
                      style={{
                        border: "1px solid #dbdbdb",
                        outline: "none",
                        padding: "10px",
                        marginBottom: "10px",
                      }}
                      type="text"
                      placeholder="Enter Tags"
                      onKeyDown={(e) => {
                        if (e.key == "Enter") {
                          tagList.push(e.target.value);
                          e.target.value = "";
                          setTagList([...tagList]);
                        }
                      }}
                    />
                    <Box component="span" style={{ border: "none" }}>
                      <ul
                        style={{
                          display: "flex",
                          listStyle: "none",
                          flexWrap: "wrap",
                        }}
                      >
                        {tagList.map((tag, index) => (
                          <li
                            key={tag + "tagList" + index}
                            style={{
                              display: "flex",
                              padding: "1px 10px",
                              margin: "2px",
                              backgroundColor: "grey",
                              borderRadius: "6px",
                              color: "white",
                            }}
                          >
                            <div
                              onClick={(e) => {
                                for (var i = 0; i < tagList.length; i++) {
                                  if (
                                    tagList[i] ===
                                    e.target.parentElement.lastChild.textContent
                                  ) {
                                    tagList.splice(i, 1);
                                    setTagList([...tagList]);
                                  }
                                }
                              }}
                              style={{ marginRight: "10px" }}
                            >
                              x
                            </div>{" "}
                            <div>{tag}</div>
                          </li>
                        ))}
                      </ul>
                    </Box>
                    <button
                      style={{ border: "none", backgroundColor: "transparent" }}
                      onClick={(e) => CreateArticle(e)}
                    >
                      <SnackbarComponent
                        severityType={severityType}
                        content="share"
                      />
                    </button>
                  </div>
                </Typography>
              </Box>
            </Modal>

            <hr />
            <div className="bottom">
              <div className="left">
                <input type="file" id="file" style={{ display: "none" }} />
                <label htmlFor="file">
                  <div className="item">
                    <img src={Image} alt="" />
                    <span>Add Image</span>
                  </div>
                </label>
                <div className="item">
                  <img src={Map} alt="" />
                  <span>Add Place</span>
                </div>
                <div className="item">
                  <img src={Friend} alt="" />
                  <span>Tag Friends</span>
                </div>
              </div>
              <div className="right">
                <button>Share</button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Share;
