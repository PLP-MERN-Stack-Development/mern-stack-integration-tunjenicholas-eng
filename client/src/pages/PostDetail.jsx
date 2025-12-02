import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { postService } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const PostDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await postService.getPost(id);
        setPost(data.data);
      } catch (error) {
        console.error("Failed to fetch post", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await postService.deletePost(post._id);
      navigate('/');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      await postService.addComment(post._id, { content: comment });
      // Refresh post data
      const data = await postService.getPost(id);
      setPost(data.data);
      setComment('');
    } catch (error) {
      alert("Failed to post comment");
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!post) return <div className="text-center mt-10">Post not found</div>;

  // Check if current logged-in user is the author
  // We handle both object (populated) and string formats of author ID
  const isAuthor = user && (post.author?._id === user.id || post.author === user.id);

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md mt-6">
      
      {/* Edit/Delete Buttons for Author */}
      {isAuthor && (
        <div className="flex justify-end space-x-4 mb-4">
          <Link 
            to={`/edit-post/${post._id}`} 
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
          >
            Edit
          </Link>
          <button 
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      )}

      {post.image && (
        <img src={post.image} alt={post.title} className="w-full h-64 object-cover rounded-lg mb-6" />
      )}
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <div className="flex items-center text-gray-500 mb-6 text-sm">
        <span className="mr-4">By {post.author?.username || 'Unknown'}</span>
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
      </div>
      
      <div className="prose max-w-none mb-10 text-gray-800 leading-relaxed whitespace-pre-wrap">
        {post.content}
      </div>

      <hr className="my-8" />

      {/* Comments Section */}
      <h3 className="text-2xl font-bold mb-6">Comments ({post.comments?.length || 0})</h3>
      
      <div className="space-y-6 mb-8">
        {post.comments?.map((c, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg">
            <p className="font-bold text-sm text-blue-600 mb-1">{c.user?.username || 'User'}</p>
            <p className="text-gray-700">{c.content}</p>
          </div>
        ))}
        {post.comments?.length === 0 && <p className="text-gray-500">No comments yet.</p>}
      </div>

      {user ? (
        <form onSubmit={handleCommentSubmit} className="mt-6">
          <textarea
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          ></textarea>
          <button type="submit" className="mt-2 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Post Comment
          </button>
        </form>
      ) : (
        <p className="bg-blue-50 p-4 rounded text-blue-800">
          Please <Link to="/login" className="font-bold underline">login</Link> to leave a comment.
        </p>
      )}
    </div>
  );
};

export default PostDetail;