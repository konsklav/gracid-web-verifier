import React, { useState , useEffect } from 'react';
import QRCode from 'react-qr-code';
import presentationDefinition from '../definitions/gracid-presentation-definition.json';

function generateNonce() {
  return crypto.randomUUID();
}

function Verifier() {
  const [clicked, setClicked] = useState(false);

  const [transactionId, setTransactionId] = useState(null);
  const [clientId, setClientId] = useState(null); 
  const [requestUri, setRequestUri] = useState(null);
  const [requestUriMethod, setRequestUriMethod] = useState("post");

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('pending');

  const [credentials, setCredentials] = useState([]);

  const handleClick = async () => {
    // Set state
    setLoading(true);

    const nonce = generateNonce();
    
    try {
      const response = await fetch('https://dev.verifier-backend.eudiw.dev/ui/presentations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({  // Basic request body
          "type": "vp_token",
          "presentation_definition": presentationDefinition,
          "dcql_query": null,
          "nonce": nonce,
          "response_mode": "direct_post",
          "jar_mode": "by_reference",
          "request_uri_method": requestUriMethod
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create verification session.');
      }

      // Get response data
      const data = await response.json();

      // Set response states
      setTransactionId(data.transaction_id);
      setClientId(data.client_id);
      setRequestUri(data.request_uri);
      setRequestUriMethod(data.request_uri_method);

      setClicked(true);
    } catch (error) {
      console.error('Error creating verification session: ', error);
    } finally {
      setLoading(false);
    }
  };

  // Create QR-Code Uri based on the response
  const qrCodeUri = `eudi-openid4vp://?client_id=${encodeURIComponent(clientId)}&request_uri=${encodeURIComponent(requestUri)}&request_uri_method=${encodeURIComponent(requestUriMethod)}`;

  // Effect for polling the response from the wallet
  useEffect(() => {
    if (!transactionId || status === 'verified') return;
  
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`https://dev.verifier-backend.eudiw.dev/ui/presentations/${transactionId}`);
        const data = await res.json();
  
        if (data?.vp_token) {
          setStatus('verified');
          clearInterval(interval); // Stop polling
          console.log('Verification Success: ', data);
        }
      } catch (err) {
        console.error('Error polling verification result: ', err);
      }
    }, 5000); // Polls every 5 seconds
  
    return () => clearInterval(interval); // Cleanup the interval after unmounting of the component or change in the effects target variables
  }, [transactionId, status]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Greek Academic ID Verifier</h1>

      {!clicked && (
        <button
          onClick={handleClick}
          disabled={loading}
          style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}
        >
          {loading ? 'Starting Verification...' : 'Start Verification'}
        </button>
      )}

      {clicked && requestUri && (
        <div>
          {status !== 'verified' ? (
            <>
              <h2>Scan to Verify</h2>
              <QRCode value={qrCodeUri} size={200} />
              <p><code>{qrCodeUri}</code></p>
              <p>Status: Verification Pending . . .</p>
            </>
          ) : (
            <>
              <h2>Verification Successful!</h2>
              <h3>Retrieved Credentials:</h3>
              <pre style={{ textAlign: 'left', background: '#f4f4f4', padding: '1rem', borderRadius: '8px', overflowX: 'auto' }}>
                {JSON.stringify(credentials, null, 2)} // Temp, I'll see how it's going to get rendered!
              </pre>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Verifier
