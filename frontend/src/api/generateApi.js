import { jsPDF } from 'jspdf';

const W = 800;
const H = 1200;
const PAT_W = 95;
const CONTENT_X = PAT_W;
const CONTENT_W = W - PAT_W * 2;
const CENTER_X = W / 2;
const BRAND = '#b98039';

function loadImg(src) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });
}

function fitText(ctx, text, maxWidth, font) {
  const m = font.match(/^(.*?)(\d+)px(.*)$/);
  if (!m) return;
  let size = parseInt(m[2]);
  ctx.font = font;
  while (ctx.measureText(text).width > maxWidth && size > 18) {
    size -= 1;
    ctx.font = `${m[1]}${size}px${m[3]}`;
  }
}

async function renderFull(state) {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, W, H);

  try {
    const pat = await loadImg('/pattern.png');
    ctx.drawImage(pat, 0, 0, PAT_W, H);
  } catch (_) {}

  try {
    const logo = await loadImg('/LOGO.png');
    const LOGO_ZONE_H = 320;
    const LOGO_MAX_W = 460;
    const r = Math.min(LOGO_MAX_W / logo.width, LOGO_ZONE_H / logo.height);
    const lw = logo.width * r, lh = logo.height * r;
    ctx.drawImage(logo, CONTENT_X + (CONTENT_W - lw) / 2, 50 + (LOGO_ZONE_H - lh) / 2, lw, lh);
  } catch (_) {}

  const PHOTO_Y = 390, PHOTO_H = 400, PHOTO_W = 490;
  const PHOTO_X = CONTENT_X + (CONTENT_W - PHOTO_W) / 2;

  if (state.photoUrl) {
    try {
      const photo = await loadImg(state.photoUrl);
      ctx.save();
      ctx.beginPath();
      ctx.rect(PHOTO_X, PHOTO_Y, PHOTO_W, PHOTO_H);
      ctx.clip();
      const sa = photo.width / photo.height;
      const da = PHOTO_W / PHOTO_H;
      let dw, dh, dx, dy;
      if (sa > da) {
        dh = PHOTO_H; dw = PHOTO_H * sa;
        dx = PHOTO_X - (dw - PHOTO_W) / 2; dy = PHOTO_Y;
      } else {
        dw = PHOTO_W; dh = PHOTO_W / sa;
        dx = PHOTO_X; dy = PHOTO_Y - (dh - PHOTO_H) / 2;
      }
      ctx.drawImage(photo, dx, dy, dw, dh);
      ctx.restore();
    } catch (_) {}
  } else {
    ctx.fillStyle = '#D0C5BB';
    ctx.fillRect(PHOTO_X, PHOTO_Y, PHOTO_W, PHOTO_H);
  }

  const name = state.name || 'Nome do Colaborador';
  fitText(ctx, name, CONTENT_W - 40, `bold 52px "VAG Rounded", sans-serif`);
  ctx.fillStyle = BRAND;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(name, CENTER_X, 845);

  const job = state.jobTitle || '';
  if (job) {
    fitText(ctx, job, CONTENT_W - 40, `300 34px "VAG Rounded", sans-serif`);
    ctx.fillStyle = BRAND;
    ctx.textAlign = 'center';
    ctx.fillText(job, CENTER_X, 892);
  }

  ctx.font = `bold 40px "VAG Rounded", sans-serif`;
  ctx.fillStyle = BRAND;
  ctx.textAlign = 'left';
  ctx.fillText(`Nº ${state.employeeId || ''}`, CONTENT_X + 20, 975);

  ctx.font = `300 28px "VAG Rounded", sans-serif`;
  ctx.fillText('Data de admissão', CONTENT_X + 20, 1025);

  ctx.font = `bold 32px "VAG Rounded", sans-serif`;
  ctx.fillText(state.admissionDate || '', CONTENT_X + 20, 1072);

  const QR_SIZE = 190;
  const QR_X = W - PAT_W - QR_SIZE - 20;
  const QR_Y = 940;
  try {
    const qrImg = await loadImg('/qrcode.png');
    ctx.drawImage(qrImg, QR_X, QR_Y, QR_SIZE, QR_SIZE);
  } catch (_) {}

  return canvas;
}

export async function generatePng(state) {
  const canvas = await renderFull(state);
  return new Promise((res) => canvas.toBlob(res, 'image/png'));
}

export async function generatePdf(state) {
  const canvas = await renderFull(state);
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [W / 2, H / 2] });
  pdf.addImage(imgData, 'PNG', 0, 0, W / 2, H / 2);
  return pdf.output('blob');
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
