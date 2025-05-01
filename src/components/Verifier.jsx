import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import presentationDefinition from '../definitions/gracid-presentation-definition.json';

function generateNonce() {
    return crypto.randomUUID();
  }  

function Verifier() {
  const [clicked, setClicked] = useState(false);

  const [nonce, setNonce] = useState(null);

  const [definition, setDefinition] = useState(null);

  const handleClick = () => {
    const newNonce = generateNonce();

    // Deep clone the JSON object (presentation definition) to avoid mutating the imported default
    const clonedDefinition = JSON.parse(JSON.stringify(presentationDefinition));
    // Inject the new nonce
    clonedDefinition.nonce = newNonce;

    // Set states
    setNonce(newNonce);
    setDefinition(clonedDefinition);
    setClicked(true);
  };

  // Temp, it will change when we have set the correct api backend and have its link
  const verificationUrl = nonce ? `https://your-verifier-backend.com/verify?nonce=${nonce}`  : ''; // Only gets a value if nonce is not null

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Greek Academic ID Verifier</h1>

      <button onClick={handleClick} style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>
        Start Verification
      </button>

      {clicked && definition && (
        <div>
          <h2>Scan to Verify</h2>
          <QRCode value={verificationUrl} size={200} />
          <p><code>{verificationUrl}</code></p>
        </div>
      )}
    </div>
  );
}

export default Verifier
