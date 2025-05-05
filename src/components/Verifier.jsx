import React, { useState } from 'react';
// Import components
import QRCodeDisplay from './QRCodeDisplay';
import CredentialDisplay from './CredentialDisplay';
// Import hooks
import usePolling from '../hooks/usePolling';
import useCredentialValidation from '../hooks/useCredentialValidation';
import useSessionInitializer from '../hooks/useSessionInitializer';

function Verifier() {
  const [clicked, setClicked] = useState(false);

  const [loading, setLoading] = useState(false);

  const [transactionId, setTransactionId] = useState(null);
  const [clientId, setClientId] = useState(null); 
  const [requestUri, setRequestUri] = useState(null);
  const [requestUriMethod, setRequestUriMethod] = useState(null);

  const [status, setStatus] = useState('pending');

  const [vpToken, setVpToken] = useState(null);
  const [credentials, setCredentials] = useState([]);

  // Use the Session Initializer Hook
  const initializeSession = useSessionInitializer({
    setClicked,
    setLoading,
    setTransactionId,
    setClientId,
    setRequestUri,
    setRequestUriMethod
  });

  // Create QR-Code Uri based on the response from the session initializer
  const qrCodeUri = `eudi-openid4vp://?client_id=${encodeURIComponent(clientId)}&request_uri=${encodeURIComponent(requestUri)}&request_uri_method=${encodeURIComponent(requestUriMethod)}`;

  // Use the Polling Hook
  usePolling(transactionId, status, setVpToken, setStatus);
  
  // Use the Credential Validation Hook
  useCredentialValidation(vpToken, status, setCredentials, setStatus);
  
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Greek Academic ID Verifier</h1>

      {!clicked && (
        <button
          onClick={initializeSession}
          disabled={loading}
          style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}
        >
          {loading ? 'Starting Verification...' : 'Start Verification'}
        </button>
      )}

      {clicked && requestUri && (
        <div>
          {status === 'pending' && (
            <QRCodeDisplay qrCodeUri={qrCodeUri}/>
          )}

          {status === 'received' && (
            <>
              <h2>QR Scanned!</h2>
              <p>Status: Verification in Progress . . .</p>
            </>
          )}

          {status === 'verified' && (
            <CredentialDisplay credentials={credentials} />
          )}
        </div>
      )}
    </div>
  );
}

export default Verifier
