import { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  GithubAuthProvider,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const auth = getAuth();
  const Githubprovider = new GithubAuthProvider();
  const Googleprovider = new GoogleAuthProvider();
  const Facebookprovider = new FacebookAuthProvider();

  const signupWithFacebook = () => {
    signInWithPopup(auth, Facebookprovider)
      .then((result) => {
        const user = result.user;
        console.log("Facebook login:", user);
      })
      .catch((error) => {
        console.log("Facebook login error:", error);
      });
  };

  const signupWithGoogle = () => {
    signInWithPopup(auth, Googleprovider)
      .then((result) => {
        const user = result.user;
        console.log("Google login:", user);
      })
      .catch((error) => {
        console.log("Google login error:", error);
      });
  };

  const signupWithGithub = () => {
    signInWithPopup(auth, Githubprovider)
      .then((result) => {
        const user = result.user;
        console.log("GitHub login:", user);
      })
      .catch((error) => {
        console.log("GitHub login error:", error);
      });
  };

  const LoginUser = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("Login successful:", userCredential.user);
      })
      .catch((error) => {
        console.log("Login error:", error);
      });
  };

  const forgetPassword = () => {
    if (!userEmail) return alert("Please enter your email first.");
    sendPasswordResetEmail(auth, userEmail)
      .then(() => {
        alert("Password reset email sent!");
      })
      .catch((error) => {
        console.log("Password reset error:", error);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={LoginUser}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Login
        </h1>

        <input
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition mb-4"
        >
          Login
        </button>

        <input
          className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          type="email"
          placeholder="Enter email for password reset"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />

        <button
          type="button"
          onClick={forgetPassword}
          className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition mb-6"
        >
          Forget Password
        </button>

        <div className="flex flex-col space-y-2">
          <button
            type="button"
            onClick={signupWithGithub}
            className="bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition"
          >
            Login with GitHub
          </button>

          <button
            type="button"
            onClick={signupWithGoogle}
            className="bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
          >
            Login with Google
          </button>

          <button
            type="button"
            onClick={signupWithFacebook}
            className="bg-blue-800 text-white py-2 rounded-lg hover:bg-blue-900 transition"
          >
            Login with Facebook
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
