import React from 'react';

const CredentialDisplay = ({ credentials }) => {
  if (!credentials || credentials.length === 0) return null;

  return (
    <>
      <h2>Verification Successful!</h2>
      <h3>Retrieved Credentials:</h3>
      <pre
        style={{
          textAlign: 'left',
          background: '#f4f4f4',
          padding: '1rem',
          borderRadius: '8px',
          overflowX: 'auto',
        }}
      >
        {JSON.stringify(credentials, null, 2)}
      </pre>
    </>
  );
};

export default CredentialDisplay
