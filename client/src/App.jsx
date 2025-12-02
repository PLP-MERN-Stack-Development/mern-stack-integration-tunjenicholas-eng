import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register'; // <--- Import
import CreatePost from './pages/CreatePost'; // <--- Import
import PostDetail from './pages/PostDetail';
import EditPost from './pages/EditPost';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} /> 
              <Route path="/create-post" element={<CreatePost />} /> 
              <Route path="/posts/:id" element={<PostDetail />} />
              <Route path="/edit-post/:id" element={<EditPost />} /> 
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;