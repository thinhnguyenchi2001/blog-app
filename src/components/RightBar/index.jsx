import { useEffect, useState } from "react";
import "./rightBar.scss";
import { httpClient } from "../../httpClient.ts";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const RightBar = ({ setTag }) => {
  const [tags, setTags] = useState([]);
  const [dataFriends, setDataFriends] = useState([]);

  useEffect(() => {
    httpClient.get("/tags").then((response) => setTags(response.data.tags));
    getFavoritedFriend();
  }, []);

  const getFavoritedFriend = () => {
    httpClient
      .get(`/articles/feed?limit=100`)
      .then((response) => setDataFriends(response.data.articles));
  };

  let listFriends = [];

  dataFriends.forEach((e) => {
    listFriends.push({ username: e.author.username, image: e.author.image });
  });

  listFriends = listFriends.filter(
    (value, index, self) =>
      index ===
      self.findIndex(
        (t) => t.username === value.username && t.image === value.image
      )
  );

  return (
    <div className="rightBar">
      <div className="container">
        {listFriends.length > 0 ? (
          <div className="item">
            <span>Online Friends</span>

            {listFriends.map((dataFriend, index) => (
              <div key={dataFriend + "dataFriend" + index} className="user">
                <div className="userInfo">
                  <img src={dataFriend.image} alt="" />
                  <div className="online" />
                  <Link
                    state={{ editMode: false }}
                    to={`/profiles/${dataFriend?.username}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <span>{dataFriend.username}</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : null}
        <div className="item">
          <span>Tags List</span>
          {tags.map((tag, index) => (
            <div key={tag + index} className="tag">
              <p onClick={(e) => setTag(e.currentTarget.textContent)}>{tag}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightBar;
