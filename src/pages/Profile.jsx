import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../Context/Context";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import moment from "moment";
import { getAuth, updateEmail } from "firebase/auth";
import { Toaster, toast } from "react-hot-toast";

const Profile = () => {
  const [newEmail, setNewEmail] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { state } = useContext(GlobalContext);
  const [userPosts, setUserPosts] = useState([]);

  const db = getFirestore();

  useEffect(() => {
    if (!state?.user?.uid) return;

    const q = query(
      collection(db, "posts"),
      where("userID", "==", state.user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUserPosts(postsData);
    });

    return () => {
      unsubscribe(); // safe cleanup
    };
  }, [state?.user]);

  const changeEmail = async (e) => {
    e.preventDefault();
    if (!newEmail) return toast.error("Please enter a valid email.");

    const auth = getAuth();
    setLoading(true);
    try {
      await updateEmail(auth.currentUser, newEmail);
      toast.success("Email updated successfully!");
      setNewEmail("");
    } catch (error) {
      console.error("Error updating email: ", error);
      if (error.code === "auth/requires-recent-login") {
        toast.error("Please re-authenticate and try again.");
      } else {
        toast.error("Failed to update email. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />

      <div className="max-w-3xl mx-auto p-4">
        <div className="flex items-center gap-4 mb-6">
          <img
            src={state?.user?.photoURL}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {state?.user?.displayName}
            </h1>
            <p className="text-gray-600">{state?.user?.email}</p>
          </div>
        </div>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={() => setShowForm((prev) => !prev)}
        >
          {showForm ? "Cancel" : "Change Email"}
        </button>

        {showForm && (
          <form
            className="mt-4 bg-gray-100 p-4 rounded shadow"
            onSubmit={changeEmail}
          >
            <input
              type="email"
              value={newEmail}
              placeholder="Enter new email"
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <button
              type="submit"
              className="mt-3 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              disabled={loading}
            >
              {loading ? "Updating..." : "Submit"}
            </button>
          </form>
        )}

        <h2 className="text-xl font-semibold mt-8 mb-4">My Posts</h2>

        {userPosts.length === 0 ? (
          <p className="text-gray-500">You haven’t posted anything yet.</p>
        ) : (
          <div className="flex flex-col gap-6">
            {userPosts.map((post, i) => (
              <div
                key={i}
                className="bg-white border rounded-lg shadow-md p-4 w-full mx-auto"
              >
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={post?.authorProfile}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h6 className="font-semibold">{post?.authorName}</h6>
                    <p className="text-xs text-gray-500">
                      {moment(post?.postDate).fromNow()}
                    </p>
                  </div>
                </div>
                <p className="text-gray-800 mb-2">{post?.caption}</p>
                {post?.postFile && (
                  <img
                    src={post?.postFile}
                    alt="Post"
                    className="w-full rounded-md border"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
