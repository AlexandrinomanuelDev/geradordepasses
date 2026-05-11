const PDFDocument = require('pdfkit');

function pngToPdf(pngBuffer) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    // Card at 72dpi: 400px wide ≈ 400pt, 600px tall ≈ 600pt
    const doc = new PDFDocument({ size: [400, 600], margin: 0 });
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    doc.image(pngBuffer, 0, 0, { fit: [400, 600], align: 'center', valign: 'center' });
    doc.end();
  });
}

module.exports = { pngToPdf };
