import { useState, useEffect } from 'react';
import { postService } from '../services/api';
import { Link } from 'react-router-dom';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await postService.getAllPosts();
        setPosts(response.data); 
      } catch (err) {
        setError('Failed to fetch posts. Make sure server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading posts...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-8">Latest Posts</h1>
      
      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts yet. Be the first to write one!</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div key={post._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col">
              {/* Image Section */}
              {post.image ? (
                <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}

              {/* Content Section */}
              <div className="p-6 flex-1 flex flex-col">
                {/* Clickable Title */}
                <Link to={`/posts/${post._id}`}>
                  <h2 className="text-xl font-bold mb-2 hover:text-blue-600 transition-colors cursor-pointer">
                    {post.title}
                  </h2>
                </Link>

                <p className="text-gray-600 mb-4 flex-1">
                  {post.content ? post.content.substring(0, 100) : ''}...
                </p>
                
                <div className="flex justify-between items-center text-sm text-gray-500 mt-auto pt-4 border-t">
                  <span className="font-medium text-blue-600">
                    {post.author?.username || 'Unknown'}
                  </span>
                  <span>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;