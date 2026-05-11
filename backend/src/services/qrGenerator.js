const QRCode = require('qrcode');

async function generateQrBuffer(data, size = 200) {
  return QRCode.toBuffer(data || 'https://example.com', {
    width: size,
    margin: 1,
    color: { dark: '#1A1A1A', light: '#FFFFFF' },
  });
}

module.exports = { generateQrBuffer };
