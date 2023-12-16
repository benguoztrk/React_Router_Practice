import Layout from "./Layout";
import Home from "./Home";
import NewPost from "./NewPost";
import EditPost from "./EditPost";
import PostPage from "./PostPage";
import About from "./About";
import Missing from "./Missing";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import api from "./api/posts";
import useWindowSize from "./hooks/useWindowsSize";
import useAxiosFetch from "./hooks/useAxiosFetch";

function App() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const { data, fetchError, isLoading } = useAxiosFetch(
    "http://localhost:3500/posts"
  );

  useEffect(() => {
    setPosts(data);
  }, [data]);

  //This is the useEffect that I use before implementing the custom hook useAxiosFetch.
  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     try {
  //       const response = await api.get("/posts");

  //       setPosts(response.data);
  //     } catch (error) {
  //       if (error.response) {
  // The request was made and the server responded with a status code
  // that falls out of the range of 2xx
  //         console.log(error.response.data);
  //         console.log(error.response.status);
  //         console.log(error.response.headers);
  //       } else if (error.request) {
  // The request was made but no response was received
  // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
  // http.ClientRequest in node.js
  //         console.log(error.request);
  //       } else {
  // Something happened in setting up the request that triggered an Error
  //         console.log("Error", error.message);
  //       }
  //     }
  //   };
  //   fetchPosts();
  // }, []);

  useEffect(() => {
    const filteredResults = posts.filter(
      (post) =>
        post.body.toLowerCase().includes(search.toLowerCase()) ||
        post.title.toLowerCase().includes(search.toLowerCase())
    );

    setSearchResults(filteredResults.reverse());
  }, [posts, search]);

  const handleSubmit = async (e) => {
    //prevent the default behavior of the form, which is to reload the page when submitted.
    e.preventDefault();
    //calculate the ID for the new post. If there are any posts, it will use the ID of the last post and increment it by 1. If there are no posts, it will assign the ID as 1.
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
    // create a timestamp for the current date and time.
    const datetime = format(new Date(), "MMMM dd, yyyy pp");
    //create a new post object using the values provided by the user in the form.
    const newPost = { id, title: postTitle, datetime, body: postBody };
    try {
      //combine the existing posts with the new post.
      //const allPosts = [...posts, newPost];
      const response = await api.post("/posts", newPost);
      const allPosts = [...posts, response.data];
      // update the state of the posts array to include the new post.
      setPosts(allPosts);
      //reset the state of the postTitle and postBody fields
      setPostTitle("");
      setPostBody("");
      navigate("/");
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  };

  const handleEdit = async (id) => {
    const datetime = format(new Date(), "MMMM dd, yyyy pp");
    const updatedPost = { id, title: editTitle, datetime, body: editBody };
    try {
      const response = await api.put(`/posts/${id}`, updatedPost);
      setPosts(
        posts.map((post) => (post.id === id ? { ...response.data } : post))
      );
      setEditTitle("");
      setEditBody("");
      navigate("/");
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/posts/${id}`);
      const postsList = posts.filter((post) => post.id !== id);
      setPosts(postsList);
      navigate("/");
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  };

  return (
    <Routes>
      <Route
        path="/"
        element={<Layout width={width} search={search} setSearch={setSearch} />}
      >
        <Route
          index
          element={
            <Home
              posts={searchResults}
              fetchError={fetchError}
              isLoading={isLoading}
            />
          }
        />
        <Route path="post">
          <Route
            index
            element={
              <NewPost
                handleSubmit={handleSubmit}
                postTitle={postTitle}
                setPostTitle={setPostTitle}
                postBody={postBody}
                setPostBody={setPostBody}
              />
            }
          />
          <Route
            path=":id"
            element={<PostPage posts={posts} handleDelete={handleDelete} />}
          />
          <Route path="edit/:id">
            <Route
              index
              element={
                <EditPost
                  posts={posts}
                  handleEdit={handleEdit}
                  editTitle={editTitle}
                  setEditTitle={setEditTitle}
                  editBody={editBody}
                  setEditBody={setEditBody}
                />
              }
            />
            {/* <Route path=":id" element={<PostPage posts={posts} />} /> */}
          </Route>
        </Route>

        <Route path="about" element={<About />} />
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;
