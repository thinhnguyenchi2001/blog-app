import Post from "../Post";
import "./posts.scss";

const Posts = ({ dataArticles, loading, setLoading }) => {
  return (
    <>
      {dataArticles.length > 0 ? (
        <div className="posts">
          {dataArticles.map((dataArticle) => (
            <Post
              loading={loading}
              setLoading={setLoading}
              dataArticle={dataArticle}
              key={dataArticle?.slug}
            />
          ))}
        </div>
      ) : (
        <div className="text-nodata">No articles are here... yet.</div>
      )}
    </>
  );
};

export default Posts;
