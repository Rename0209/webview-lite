import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [decryptedToken, setDecryptedToken] = useState('');
  
  useEffect(() => {
    try {
      // Get token from URL
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      
      if (!token) {
        setError('No token found in URL parameters');
        return;
      }

      // Decrypt token
      const secretKey = 'superkeyahafood1';
      // Convert base64 token to bytes
      const tokenBytes = CryptoJS.enc.Base64.parse(token);
      
      // Decrypt using AES-ECB with PKCS5Padding
      const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: tokenBytes },
        CryptoJS.enc.Utf8.parse(secretKey),
        {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7
        }
      );
      
      const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
      setDecryptedToken(decryptedText);
      setError('');
    } catch (err) {
      setError('Error decrypting token: ' + err.message);
    }
  }, []);

  const getRequestInfo = () => {
    return {
      'URL parameters:': window.location.search,
      'Origin:': window.location.origin,
      'Referrer:': document.referrer,
      'User Agent:': navigator.userAgent,
      'Decrypted Token:': decryptedToken || 'Not available'
    };
  };

  return (
    <div className="App">
      <div className="error-container">
        {error && <div className="error-message">Error: {error}</div>}
        <div className="request-info">
          {Object.entries(getRequestInfo()).map(([key, value]) => (
            <div key={key} className="info-row">
              <span className="info-label">{key}</span>
              <span className="info-value">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App; 