import { useEffect } from 'react';

const usePolling = (transactionId, status, setVpToken, setStatus) => {
  // Effect for polling the response from the wallet
  useEffect(() => {
    if (!transactionId || status === 'received' || status === 'verified') return;
  
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`https://dev.verifier-backend.eudiw.dev/ui/presentations/${transactionId}`);
        const data = await res.json();
  
        if (data?.vp_token?.[0]) {
          setVpToken(data.vp_token[0]);
          clearInterval(interval); // Stop polling
          setStatus('received');
          console.log('Received Wallets Response (vp_token): ', data.vp_token[0]);
        }
      } catch (err) {
        console.error('Error polling verification result: ', err);
      }
    }, 5000); // Polls every 5 seconds
  
    return () => clearInterval(interval); // Cleanup the interval after unmounting of the component or change in the effects target variables
  }, [transactionId, status, setVpToken, setStatus]);
};

export default usePolling
