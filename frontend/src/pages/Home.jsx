import React, { useState } from 'react';
import AddBookmarkForm from '../components/AddBookmarkForm';
import BookmarkList from '../components/BookmarkList';

export default function Home() {
  const [refresh, setRefresh] = useState(false);

  return (
    <div style={{ padding: '1rem' }}>
      <AddBookmarkForm onAdd={() => setRefresh(!refresh)} />
      <BookmarkList key={refresh} />
    </div>
  );
}
