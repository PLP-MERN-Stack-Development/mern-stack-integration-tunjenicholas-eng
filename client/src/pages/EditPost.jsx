import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postService } from '../services/api';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    // 1. Fetch the existing post data
    const fetchPost = async () => {
      try {
        const response = await postService.getPost(id);
        setTitle(response.data.title);
        setContent(response.data.content);
      } catch (err) {
        console.error("Could not fetch post");
      }
    };
    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 2. Send the update
      await postService.updatePost(id, { title, content });
      navigate(`/posts/${id}`);
    } catch (err) {
      alert("Failed to update post");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-bold mb-2">Title</label>
          <input
            type="text"
            className="w-full p-3 border rounded-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-bold mb-2">Content</label>
          <textarea
            className="w-full p-3 border rounded-lg h-64"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditPost;