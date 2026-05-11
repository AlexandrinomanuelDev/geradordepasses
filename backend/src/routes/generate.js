const { Router } = require('express');
const { uploadMiddleware } = require('../middleware/upload');
const { renderCard } = require('../services/cardRenderer');
const { pngToPdf } = require('../services/pdfExporter');

const router = Router();

async function generatePngHandler(req, res, next) {
  try {
    const canvas = await renderCard(req.files, req.body);
    const buffer = canvas.toBuffer('image/png');
    res.set('Content-Type', 'image/png');
    res.set('Content-Disposition', 'attachment; filename="passe.png"');
    res.send(buffer);
  } catch (err) {
    next(err);
  }
}

async function generatePdfHandler(req, res, next) {
  try {
    const canvas = await renderCard(req.files, req.body);
    const pngBuffer = canvas.toBuffer('image/png');
    const pdfBuffer = await pngToPdf(pngBuffer);
    res.set('Content-Type', 'application/pdf');
    res.set('Content-Disposition', 'attachment; filename="passe.pdf"');
    res.send(pdfBuffer);
  } catch (err) {
    next(err);
  }
}

router.post('/png', uploadMiddleware, generatePngHandler);
router.post('/pdf', uploadMiddleware, generatePdfHandler);

module.exports = router;
