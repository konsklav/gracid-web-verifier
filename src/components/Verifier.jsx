import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import presentationDefinition from '../definitions/gracid-presentation-definition.json';

function generateNonce() {
    return crypto.randomUUID();
  }  

function Verifier() {
  const [nonce] = useState(generateNonce());

 {/* Temp, it will change when we have set the correct api backend and have its link */}
  const verificationUrl = `https://your-verifier-backend.com/verify?nonce=${nonce}`;

  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    console.log("Button clicked!");
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Greek Academic ID Verifier</h1>

      <button onClick={handleClick} style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>
        Start Verification
      </button>

      {/* This appears after click */}
      {clicked && <p>QR code coming soon...</p>}
      
      <div>
        <h2>Scan to Verify</h2>
        <QRCode value={verificationUrl} size={200} />
        <p><code>{verificationUrl}</code></p>
      </div>
    </div>
  );
}

export default Verifier
