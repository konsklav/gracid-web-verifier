import presentationDefinition from '../definitions/gracid-presentation-definition.json';
import React, { useState } from 'react';

function Verifier() {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    console.log("Button clicked!");
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Greek Academic ID Verifier</h1>
      {/* This is just to check that the presentation definition can be rendered and used by React/JS */}
      {/* <p><strong>Definition ID:</strong> {presentationDefinition.presentation_definition.id}</p> */}
      {/* <pre>{JSON.stringify(presentationDefinition, null, 2)}</pre> */}
      <button onClick={handleClick} style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>
        Start Verification
      </button>

      {/* This appears after click */}
      {clicked && <p>QR code coming soon...</p>}
    </div>
  );
}

export default Verifier
