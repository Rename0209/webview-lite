import React, { useState } from 'react';
import './App.css';

function App() {
  const [url, setUrl] = useState('https://www.google.com');

  const handleUrlChange = (e) => {
    e.preventDefault();
    setUrl(e.target.url.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={handleUrlChange}>
          <input
            type="text"
            name="url"
            defaultValue={url}
            style={{ width: '80%', padding: '8px' }}
          />
          <button type="submit">Go</button>
        </form>
      </header>
      <webview
        src={url}
        style={{ width: '100%', height: 'calc(100vh - 60px)' }}
      />
    </div>
  );
}

export default App; 