import { useSelector } from "react-redux";
import "./comments.scss";
import { httpClient } from "../../httpClient.ts";
import { useEffect, useState } from "react";
import moment from "moment/moment";
import { Navigate } from "react-router";
const Comments = ({ article, setCountComments }) => {
  const currentUser = useSelector((state) => state.app.user);
  const currentUserName = useSelector((state) => state.app.user?.username);
  const [comments, setComments] = useState([]);
  const [yourComment, setYourComment] = useState([]);

  const getComments = () => {
    httpClient.get(`/articles/${article.slug}/comments`).then((response) => {
      setComments(response.data.comments);
      setCountComments(response.data.comments.length);
    });
  };

  useEffect(() => {
    getComments();
  }, []);

  const CommentArt = () => {
    httpClient
      .post(`/articles/${article.slug}/comments`, {
        comment: {
          body: `${yourComment}`,
        },
      })
      .then(() => getComments())
      .then(() => setYourComment(""));
  };

  const DeleteArt = (id) => {
    httpClient
      .delete(`/articles/${article.slug}/comments/${id}`)
      .then(() => getComments());
  };

  return (
    <>
      <div className="comments">
        {comments.map((comment, index) => (
          <div key={comment + "comment" + index} className="comment">
            <img src={comment.author.image} alt="" />
            <div className="info">
              <span>{comment.author.username}</span>
              <p>{comment.body}</p>
            </div>
            <span className="date">
              {moment(`${comment.createdAt}`).format("MMMM Do YYYY")}
            </span>
            {comment?.author?.username === currentUserName && (
              <div
                onClick={() => DeleteArt(comment.id)}
                className="delete-comment"
              >
                <i className="fa-solid fa-trash-can"></i>
              </div>
            )}
          </div>
        ))}
        {currentUser ? (
          <div className="write">
            <img alt="" src={currentUser.image} />
            <input
              type="text"
              value={yourComment}
              placeholder="write a comment"
              onChange={(e) => {
                setYourComment(e.target.value);
              }}
            />
            <button onClick={CommentArt}>Send</button>
          </div>
        ) : (
          <div
            style={{
              marginTop: "10px",
              padding: "10px",
            }}
          >
            No comments here !
          </div>
        )}
      </div>
    </>
  );
};

export default Comments;
