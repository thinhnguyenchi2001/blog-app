import Stories from "../../components/Stories";
import Posts from "../../components/Posts";
import Share from "../../components/Share";
import { useState, useEffect } from "react";
import { httpClient } from "../../httpClient.ts";
import "./home.scss";
import { useSelector } from "react-redux";

import Pagination from "@mui/material/Pagination";

const Home = ({ tag }) => {
  const [dataArticles, setDataArticles] = useState([]);
  const [dataArticlesFeed, setDataArticlesFeed] = useState([]);
  const [option, setOption] = useState("Global");
  const data = option === "Your" ? dataArticlesFeed : dataArticles;
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const currentUser = useSelector((state) => state.app.user);

  useEffect(() => {
    httpClient.get(`/articles?limit=10&offset=${offset}`).then((response) => {
      setDataArticles(response.data.articles);
    });
    httpClient
      .get(`/articles/feed?limit=10&offset=${offset}`)
      .then((response) => {
        setDataArticlesFeed(response.data.articles);
      });
  }, [loading]);

  const getTagData = () => {
    httpClient
      .get(`/articles?tag=${tag}&limit=10&offset=${offset}`)
      .then((response) => {
        setDataArticles(response.data.articles);
      });
  };

  useEffect(() => {
    getTagData();
  }, [tag]);

  const handleChange = (e, p) => {
    setOffset((p - 1) * 10);
    setLoading(!loading);
  };

  return (
    <div className="home">
      <Stories />
      <Share loading={loading} setLoading={setLoading} />
      <div className="select-type-posts">
        <div
          style={{ padding: "20px", cursor: "pointer" }}
          onClick={() => {
            setOption("Global");
            setLoading(!loading);
          }}
        >
          Global Feed
        </div>
        {currentUser && (
          <div
            style={{ padding: "20px", cursor: "pointer" }}
            onClick={() => {
              setOption("Your");
              setLoading(!loading);
            }}
          >
            {" "}
            My Feed
          </div>
        )}
        {tag ? (
          <div
            style={{ padding: "20px", cursor: "pointer" }}
            onClick={() => {
              setOption("Tag");
              getTagData();
            }}
          >
            {" "}
            #{tag}
          </div>
        ) : null}
      </div>
      <Posts loading={loading} setLoading={setLoading} dataArticles={data} />
      <br />
      <div className="pagination">
        <Pagination
          count={10}
          onChange={handleChange}
          showFirstButton
          showLastButton
        />
      </div>
    </div>
  );
};

export default Home;
