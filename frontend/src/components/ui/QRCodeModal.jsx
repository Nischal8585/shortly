import React, { useState, useRef } from 'react';
import QRCode from 'react-qr-code';
import Modal from './Modal';
import { getShortUrl } from '../../utils/linkUtils';
import { downloadQrPng } from '../../utils/qrDownload';

/**
 * QRCodeModal — Displays QR code preview and downloads PNG.
 */
function QRCodeModal({ isOpen, onClose, link }) {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadError, setDownloadError] = useState(null);
  const qrRef = useRef(null);

  if (!link) return null;

  const linkCode = link.customAlias || link.shortCode;
  const shortUrl = getShortUrl(linkCode);

  const handleDownload = async () => {
    try {
      setDownloadError(null);
      const svg = qrRef.current ? qrRef.current.querySelector('svg') : null;
      if (!svg) {
        throw new Error("Failed to locate QR SVG element");
      }
      await downloadQrPng(linkCode, svg);

      // Success feedback
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      setDownloadError(err.message || "Failed to download QR code.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="QR Code Preview" size="md">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-md)' }}>
        {/* QR Code Container (White BG for scan safety) */}
        <div
          ref={qrRef}
          style={{
            backgroundColor: '#ffffff',
            padding: 'var(--spacing-md)',
            borderRadius: 'var(--border-radius)',
            border: '1px solid var(--color-border)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <QRCode
            value={shortUrl}
            size={180}
            level="H"
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          />
        </div>

        {/* Metadata Details */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-sm)' }}>
          <div className="report-field">
            <span className="report-field__label">Short URL</span>
            <div className="report-field__url-wrapper" style={{ fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {shortUrl.replace(/^https?:\/\//, '')}
            </div>
          </div>
          <div className="report-field">
            <span className="report-field__label">Original URL</span>
            <div className="report-field__url-wrapper" style={{ maxHeight: '60px', overflowY: 'auto', fontSize: '0.8rem', wordBreak: 'break-all' }} title={link.originalUrl}>
              {link.originalUrl}
            </div>
          </div>
        </div>

        {/* Status Toast Message */}
        {downloadSuccess && (
          <div style={{ color: '#4caf50', fontSize: '0.85rem', fontWeight: '600', marginTop: 'var(--spacing-xs)' }}>
            ✓ QR code PNG downloaded successfully.
          </div>
        )}
        {downloadError && (
          <div style={{ color: '#f44336', fontSize: '0.85rem', fontWeight: '600', marginTop: 'var(--spacing-xs)' }}>
            ✗ {downloadError}
          </div>
        )}

        {/* Action Controls */}
        <div style={{ display: 'flex', width: '100%', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-md)' }}>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleDownload}>
            Download PNG
          </button>
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default QRCodeModal;
