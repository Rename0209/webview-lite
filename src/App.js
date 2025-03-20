import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [decryptedToken, setDecryptedToken] = useState('');
  const [securityWarning, setSecurityWarning] = useState('');
  const [originalToken, setOriginalToken] = useState('');
  
  useEffect(() => {
    try {
      // Get token from URL
      const urlParams = new URLSearchParams(window.location.search);
      const encodedToken = urlParams.get('token');
      
      if (!encodedToken) {
        setError('No token found in URL parameters');
        return;
      }

      // Store the original token
      setOriginalToken(encodedToken);

      // Decode the URL-encoded token
      const decodedToken = decodeURIComponent(encodedToken);
      
      // Check for potential security issues
      if (window.location.href.includes('facebook.com')) {
        setSecurityWarning('Warning: This application cannot load Facebook content due to security restrictions.');
        return;
      }

      // Decrypt token
      const secretKey = 'superkeyahafood1';
      
      // Convert base64 token to bytes
      const tokenBytes = CryptoJS.enc.Base64.parse(decodedToken);
      
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
      
      if (!decryptedText) {
        throw new Error('Decryption resulted in empty string');
      }
      
      setDecryptedToken(decryptedText);
      setError('');
    } catch (err) {
      setError('Error decrypting token: ' + err.message);
      console.error('Decryption error:', err);
    }
  }, []);

  const getRequestInfo = () => {
    return {
      'URL parameters:': window.location.search,
      'Original Token:': originalToken || 'Not available',
      'Decoded Token:': originalToken ? decodeURIComponent(originalToken) : 'Not available',
      'Origin:': window.location.origin,
      'Referrer:': document.referrer,
      'User Agent:': navigator.userAgent,
      'Decrypted Token:': decryptedToken || 'Not available',
      'Security Status:': securityWarning || 'No security issues detected'
    };
  };

  return (
    <div className="App">
      <div className="error-container">
        {error && <div className="error-message">Error: {error}</div>}
        {securityWarning && (
          <div className="security-warning">
            {securityWarning}
            <p className="security-note">
              Note: For security reasons, certain websites (like Facebook) cannot be loaded in this viewer.
            </p>
          </div>
        )}
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