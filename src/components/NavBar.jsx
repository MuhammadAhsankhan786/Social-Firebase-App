import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">My Social App</h1>
      <div className="space-x-4">
        <Link to="/" className="text-blue-600 hover:underline">
          Home
        </Link>
        <Link to="/profile" className="text-blue-600 hover:underline">
          Profile
        </Link>
      </div>
    </nav>
  );
};
export default Navbar;
