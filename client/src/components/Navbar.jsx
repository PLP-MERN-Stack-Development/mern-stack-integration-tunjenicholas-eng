import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-blue-600">WebBlog</Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* NEW: Button to create a post */}
                <Link 
                  to="/create-post" 
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 font-medium transition"
                >
                  + New Post
                </Link>
                
                <span className="text-gray-600 hidden md:block">Hello, {user.username}</span>
                <button 
                  onClick={logout} 
                  className="text-red-500 hover:text-red-700 font-medium ml-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-blue-500 hover:text-blue-700 font-medium">
                  Login
                </Link>
                {/* NEW: Link to the register page */}
                <Link 
                  to="/register" 
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;