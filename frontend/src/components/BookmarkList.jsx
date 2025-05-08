import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './common.css';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function BookmarkList() {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    axios
      .get(`${backendUrl}/api/bookmarks`, { withCredentials: true })
      .then((res) => setBookmarks(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="bookmark-container">
      <h1>Your Bookmarks</h1>

      {Array.isArray(bookmarks) && bookmarks.length > 0 ? (
        <div className="bookmark-grid">
          {bookmarks.map((b) => (
            <div key={b._id} className="bookmark-card">
              <h2 style={{ display: 'flex', alignItems: 'center' }}>
                {b.favicon ? (
                  <img
                    src={b.favicon}
                    alt="favicon"
                    width="20"
                    height="20"
                    style={{ marginRight: '0.5rem' }}
                    onError={(e) => (e.target.style.display = 'none')} // hide if image fails
                  />
                ) : null}
                {b.title || '(No Title)'}
              </h2>

              <div className="bookmark-summary">
                <br />
                <strong>Summary:</strong>
                <ReactMarkdown
                  components={{
                    img: () => null, // ⛔ ignore all images inside markdown
                  }}
                >
                  {b.summary || '(No summary provided)'}
                </ReactMarkdown>
              </div>

              <a href={b.url} target="_blank" rel="noreferrer">
                Visit Site
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p>No bookmarks found.</p>
      )}
    </div>
  );
}
