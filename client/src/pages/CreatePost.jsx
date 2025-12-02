import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postService } from '../services/api';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await postService.createPost({ 
        title, 
        content,
        image: 'https://via.placeholder.com/600x400' 
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create post');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">Write a New Post</h1>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-bold mb-2">Title</label>
          <input
            type="text"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title..."
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-bold mb-2">Content</label>
          <textarea
            className="w-full p-3 border rounded-lg h-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your article here..."
            required
          ></textarea>
        </div>
        <button type="submit" className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700">
          Publish Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;