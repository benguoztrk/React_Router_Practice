import Feed from "./Feed";

const Home = ({ posts }) => {
  return (
    <main className="Home">
      {/* check the posts length with ternary. If they have length display feed component. This feed component receives the posts as prop. If does not have length, display a paragraf saying "No posts to display" with inline css */}
      {posts.length ? (
        <Feed posts={posts} />
      ) : (
        <p style={{ marginTop: "2rem" }}>No posts to display.</p>
      )}
    </main>
  );
};

export default Home;
