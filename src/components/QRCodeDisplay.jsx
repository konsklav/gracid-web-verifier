import React from 'react';
import QRCode from 'react-qr-code';

const QRCodeDisplay = ({ qrCodeUri }) => {
  if (!qrCodeUri) return null;

  return (
    <>
      <h2>Scan to Verify</h2>
      <QRCode value={qrCodeUri} size={200} />
      {/* <p>
        <code>{qrCodeUri}</code>
      </p> */}
      <p>Status: Verification Pending . . .</p>
    </>
  );
};

export default QRCodeDisplay
