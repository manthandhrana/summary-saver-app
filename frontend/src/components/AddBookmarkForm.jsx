import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useState } from 'react';
import './common.css';

const backendUrl = import.meta.env.VITE_BACKEND_URL;


export default function AddBookmarkForm({ onAdd }) {
  const [url, setUrl] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = Cookies.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${backendUrl}/api/bookmarks`,
        { url },
        { withCredentials: true }
      );

      const { data } = res;

      // Check if the image is valid
      if (data.image && data.image.startsWith('http')) {
        onAdd({
          siteName: data.siteName || 'Unknown Site',
          summary: data.summary || '',
          image: data.image
        });
      } else {
        onAdd({
          siteName: data.siteName || 'Unknown Site',
          summary: data.summary || '',
          image: null // tell frontend no image to show
        });
      }
      setUrl('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-bookmark-container">
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          placeholder="Paste URL here"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? <div className="spinner"></div> : 'Save Bookmark'}
        </button>
      </form>

      {showPopup && (
        <div className="popup-alert">
          <span className="close-btn" onClick={() => setShowPopup(false)}>×</span>
          Please login to continue.
        </div>
      )}
    </div>
  );
}
