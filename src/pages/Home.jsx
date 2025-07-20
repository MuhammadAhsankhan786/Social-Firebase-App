import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { GlobalContext } from "../context/Context";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  orderBy,
} from "firebase/firestore";
import moment from "moment";
import toast from "react-hot-toast";

const Home = () => {
  const [postCaption, setPostCaption] = useState("");
  const [posts, setPosts] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [currentCaption, setCurrentCaption] = useState("");
  const [currentPostId, setCurrentPostId] = useState("");
  const { state } = useContext(GlobalContext);
  const db = getFirestore();
  const fileInputRef = useRef(null);
  const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const addPost = async (e) => {
    e.preventDefault();
    if (!postCaption && !file) {
      toast.error("Write something or select an image");
      return;
    }

    setLoading(true);
    try {
      let imageUrl = "";
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET); // ✅ use from env

        const res = await axios.post(CLOUDINARY_URL, formData); // ✅ use from env
        imageUrl = res.data.url;
      }

      await addDoc(collection(db, "posts"), {
        userID: state?.user?.uid,
        caption: postCaption,
        authorName: state?.user?.displayName,
        authorProfile: state?.user?.photoURL,
        postDate: new Date().getTime(),
        postFile: imageUrl,
      });

      toast.success("Post submitted!");
      setPostCaption("");
      setFile(null);
      fileInputRef.current.value = null;
    } catch (error) {
      console.error("Error uploading post:", error);
      toast.error("Failed to post. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id) => {
    try {
      await deleteDoc(doc(db, "posts", id));
      toast.success("Post deleted");
    } catch (error) {
      console.log("here is error of deleting post", error);
      toast.error("Failed to delete post");
    }
  };

  const updatePost = async () => {
    if (!currentCaption) return toast.error("Caption can't be empty");

    try {
      await updateDoc(doc(db, "posts", currentPostId), {
        caption: currentCaption,
      });
      toast.success("Post updated");
      setShow(false);
      setCurrentCaption("");
      setCurrentPostId("");
    } catch (error) {
      console.log("here is error", error);
      toast.error("Update failed");
    }
  };

  const handleShow = (val, id) => {
    setShow(true);
    setCurrentCaption(val);
    setCurrentPostId(id);
  };

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("postDate", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const realTimePosts = [];
      querySnapshot.forEach((doc) => {
        realTimePosts.push({ ...doc.data(), id: doc.id });
      });
      setPosts(realTimePosts);
    });
    return () => unsubscribe();
  }, [db]);

  return (
    <>
      <form
        className="bg-white shadow-md rounded-lg p-4 mb-6"
        onSubmit={addPost}
      >
        <h2 className="text-xl font-semibold mb-3">Create Post</h2>
        <textarea
          value={postCaption}
          placeholder="What's on your mind?"
          onChange={(e) => setPostCaption(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded resize-none mb-3"
        ></textarea>
        <label className="block mb-3">
          <span className="block text-sm font-medium text-gray-700 mb-1">
            Upload Image
          </span>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-sm text-gray-500
               file:mr-4 file:py-2 file:px-4
               file:rounded-full file:border-0
               file:text-sm file:font-semibold
               file:bg-indigo-50 file:text-indigo-700
               hover:file:bg-indigo-100
               cursor-pointer"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </form>

      <div className="max-w-4xl mx-auto space-y-6">
        {posts.map((post, i) => (
          <div key={i} className="bg-white shadow-md rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <img
                  src={post?.authorProfile}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h6 className="font-semibold">{post?.authorName}</h6>
                  <p className="text-sm text-gray-500">
                    {moment(post?.postDate).fromNow()}
                  </p>
                </div>
              </div>
              {state?.user?.uid === post?.userID && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleShow(post?.caption, post?.id)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deletePost(post?.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
            <div>
              <p className="text-gray-800">{post?.caption}</p>
              {post?.postFile && (
                <img
                  src={post?.postFile}
                  alt="Post"
                  className="w-full mt-3 rounded"
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Update Post</h2>
            <input
              type="text"
              value={currentCaption}
              onChange={(e) => setCurrentCaption(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShow(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={updatePost}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
