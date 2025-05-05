import { useEffect } from 'react';

const useCredentialValidation = (vpToken, status, setCredentials, setStatus) => {
  // Effect for validating DeviceResponse (retreiving verified credentials)
useEffect(() => {
    if (!vpToken || status === 'verified') return;

    const validateCredential = async () => {
        try {
        const validationRes = await fetch('https://dev.verifier-backend.eudiw.dev/utilities/validations/msoMdoc/deviceResponse', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `device_response=${encodeURIComponent(vpToken)}`

        });

        if (!validationRes.ok) {
            throw new Error('Credential validation failed.');
        }

        const credentialData = await validationRes.json();
        setCredentials(credentialData);
        setStatus('verified');
        console.log('Credential Data:', credentialData);
        } catch (err) {
        console.error('Error during credential validation: ', err);
        }
    };

    validateCredential();
  }, [vpToken, status, setCredentials, setStatus]);
};

export default useCredentialValidation