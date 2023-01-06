import { useSelector } from "react-redux";
import "./stories.scss";
import { httpClient } from "../../httpClient.ts";
import { useEffect, useState } from "react";

const Stories = () => {
  const currentUser = useSelector((state) => state.app.user);
  const [dataFriends, setDataFriends] = useState([]);

  useEffect(() => getFavoritedFriend(), []);

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
  //TEMPORARY

  return (
    <>
      {" "}
      {currentUser ? (
        <div className="stories">
          <div className="story">
            <img alt="" src={currentUser.image} />
            <span></span>
            <button>+</button>
          </div>
          {listFriends.map((story, index) => (
            <div key={story + "story" + index} className="story">
              <img src={story.image} alt="" />
              <span>{story.username}</span>
            </div>
          ))}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Stories;
