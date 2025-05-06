import { useCallback } from 'react';
import presentationDefinition from '../queries/gracid-presentation-definition.json';
import dcqlQuery from '../queries/gracid-dcql.json';

const useSessionInitializer = ({ setClicked, setLoading, setTransactionId, setClientId, setRequestUri, setRequestUriMethod }) => {
  const initializeSession = useCallback(async () => {
    // Set loading state
    setLoading(true);

    const nonce = crypto.randomUUID();

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
            "request_uri_method": "post"
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

        // Set clicked state
        setClicked(true);
    } catch (error) {
        console.error('Error creating verification session: ', error);
    } finally {
        setLoading(false);
    }
  }, [setClicked, setLoading, setTransactionId, setClientId, setRequestUri, setRequestUriMethod]);

  return initializeSession;
};

export default useSessionInitializer
