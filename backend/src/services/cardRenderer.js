const { createCanvas, GlobalFonts, loadImage } = require('@napi-rs/canvas');
const path = require('path');

const ASSETS = path.join(__dirname, '../../../frontend/public');

// Registo de fontes (executado uma vez no require)
GlobalFonts.registerFromPath(path.join(ASSETS, 'VAGRounded-Bold.otf'), 'VAGRounded');
GlobalFonts.registerFromPath(path.join(ASSETS, 'VAGRounded Light.otf'), 'VAGRoundedLight');
GlobalFonts.registerFromPath(path.join(ASSETS, 'VAGRounded-Black.otf'), 'VAGRoundedBlack');

const W = 800;
const H = 1200;
const BRAND_COLOR = '#a47d48';

// Pattern strips: 95px cada lado
const PAT_W = 95;
const CONTENT_X = PAT_W;           // 95
const CONTENT_W = W - PAT_W * 2;   // 610
const CENTER_X = W / 2;            // 400

function fitText(ctx, text, maxWidth, font) {
  const parts = font.match(/^(.*?)(\d+)px(.*)$/);
  if (!parts) return font;
  let size = parseInt(parts[2]);
  ctx.font = font;
  while (ctx.measureText(text).width > maxWidth && size > 18) {
    size -= 1;
    ctx.font = `${parts[1]}${size}px${parts[3]}`;
  }
  return ctx.font;
}

async function renderCard(files, body) {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  // 1 — Fundo branco
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, W, H);

  // 2 — Pattern lateral esquerdo
  const patternImg = await loadImage(path.join(ASSETS, 'pattern.png'));
  ctx.drawImage(patternImg, 0, 0, PAT_W, H);

  // 4 — Logo Fazenda Filomena (fixo)
  const logoImg = await loadImage(path.join(ASSETS, 'LOGO.png'));
  const LOGO_ZONE_Y = 50;
  const LOGO_ZONE_H = 320;
  const LOGO_MAX_W = 460;
  const logoRatio = Math.min(LOGO_MAX_W / logoImg.width, LOGO_ZONE_H / logoImg.height);
  const logoW = logoImg.width * logoRatio;
  const logoH = logoImg.height * logoRatio;
  const logoX = CONTENT_X + (CONTENT_W - logoW) / 2;
  const logoY = LOGO_ZONE_Y + (LOGO_ZONE_H - logoH) / 2;
  ctx.drawImage(logoImg, logoX, logoY, logoW, logoH);

  // 5 — Foto do colaborador
  const PHOTO_Y = 390;
  const PHOTO_H = 400;
  const PHOTO_W = 490;
  const PHOTO_X = CONTENT_X + (CONTENT_W - PHOTO_W) / 2;

  if (files && files.photo && files.photo[0]) {
    const photoImg = await loadImage(files.photo[0].buffer);
    ctx.save();
    ctx.beginPath();
    ctx.rect(PHOTO_X, PHOTO_Y, PHOTO_W, PHOTO_H);
    ctx.clip();
    // Cover fit
    const srcAspect = photoImg.width / photoImg.height;
    const dstAspect = PHOTO_W / PHOTO_H;
    let drawW, drawH, drawX, drawY;
    if (srcAspect > dstAspect) {
      drawH = PHOTO_H;
      drawW = PHOTO_H * srcAspect;
      drawX = PHOTO_X - (drawW - PHOTO_W) / 2;
      drawY = PHOTO_Y;
    } else {
      drawW = PHOTO_W;
      drawH = PHOTO_W / srcAspect;
      drawX = PHOTO_X;
      drawY = PHOTO_Y - (drawH - PHOTO_H) / 2;
    }
    ctx.drawImage(photoImg, drawX, drawY, drawW, drawH);
    ctx.restore();
  } else {
    ctx.fillStyle = '#D0C5BB';
    ctx.fillRect(PHOTO_X, PHOTO_Y, PHOTO_W, PHOTO_H);
    ctx.fillStyle = '#B0A898';
    ctx.font = '200 28px "VAG Rounded"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Foto do colaborador', CENTER_X, PHOTO_Y + PHOTO_H / 2);
  }

  // 6 — Nome
  const nameY = 845;
  const name = body.name || 'Nome do Colaborador';
  fitText(ctx, name, CONTENT_W - 40, `bold 52px "VAG Rounded"`);
  ctx.fillStyle = BRAND_COLOR;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(name, CENTER_X, nameY);

  // 7 — Cargo
  const jobTitle = body.jobTitle || '';
  if (jobTitle) {
    fitText(ctx, jobTitle, CONTENT_W - 40, `300 34px "VAG Rounded"`);
    ctx.fillStyle = BRAND_COLOR;
    ctx.textAlign = 'center';
    ctx.fillText(jobTitle, CENTER_X, 892);
  }

  // 8 — "Nº X" (inferior esquerdo)
  const numY = 975;
  ctx.font = `bold 40px "VAG Rounded"`;
  ctx.fillStyle = BRAND_COLOR;
  ctx.textAlign = 'left';
  ctx.fillText(`Nº ${body.employeeId || ''}`, CONTENT_X + 20, numY);

  // 9 — "Data de admissão" (label) + data
  ctx.font = `300 28px "VAG Rounded"`;
  ctx.fillStyle = BRAND_COLOR;
  ctx.fillText('Data de admissão', CONTENT_X + 20, 1025);

  ctx.font = `bold 32px "VAG Rounded"`;
  ctx.fillText(body.admissionDate || '', CONTENT_X + 20, 1072);

  // 10 — QR Code (inferior direito)
  const QR_SIZE = 190;
  const QR_X = W - PAT_W - QR_SIZE - 20;
  const QR_Y = 940;

  try {
    const qrImg = await loadImage(path.join(ASSETS, 'qrcode.png'));
    ctx.drawImage(qrImg, QR_X, QR_Y, QR_SIZE, QR_SIZE);
  } catch (_) {}

  return canvas;
}

module.exports = { renderCard };
