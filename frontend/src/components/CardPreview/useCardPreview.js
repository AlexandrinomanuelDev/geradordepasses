import { useEffect, useRef } from 'react';

const W = 400;
const H = 600;
const PAT_W = 47;  // preview at 0.5x scale
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
  if (!m) return font;
  let size = parseInt(m[2]);
  ctx.font = font;
  while (ctx.measureText(text).width > maxWidth && size > 9) {
    size -= 1;
    ctx.font = `${m[1]}${size}px${m[3]}`;
  }
}

export function useCardPreview(canvasRef, state) {
  const drawId = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const id = ++drawId.current;
    const ctx = canvas.getContext('2d');
    canvas.width = W;
    canvas.height = H;

    async function draw() {
      if (drawId.current !== id) return;

      // 1 — Fundo
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, W, H);

      // 2 — Pattern esquerdo
      try {
        const pat = await loadImg('/pattern.png');
        if (drawId.current !== id) return;
        ctx.drawImage(pat, 0, 0, PAT_W, H);
      } catch (_) {}

      // 4 — Logo
      try {
        const logo = await loadImg('/LOGO.png');
        if (drawId.current !== id) return;
        const LOGO_ZONE_H = 160;
        const LOGO_MAX_W = 230;
        const r = Math.min(LOGO_MAX_W / logo.width, LOGO_ZONE_H / logo.height);
        const lw = logo.width * r, lh = logo.height * r;
        ctx.drawImage(logo, CONTENT_X + (CONTENT_W - lw) / 2, 25 + (LOGO_ZONE_H - lh) / 2, lw, lh);
      } catch (_) {}

      // 5 — Foto
      const PHOTO_Y = 195;
      const PHOTO_H = 200;
      const PHOTO_W = 245;
      const PHOTO_X = CONTENT_X + (CONTENT_W - PHOTO_W) / 2;

      if (state.photoUrl) {
        try {
          const photo = await loadImg(state.photoUrl);
          if (drawId.current !== id) return;
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

      // 6 — Nome
      if (drawId.current !== id) return;
      const name = state.name || 'Nome do Colaborador';
      fitText(ctx, name, CONTENT_W - 20, `bold 26px "VAG Rounded", "VAGRounded", sans-serif`);
      ctx.fillStyle = BRAND;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(name, CENTER_X, 422);

      // 7 — Cargo
      const job = state.jobTitle || '';
      if (job) {
        fitText(ctx, job, CONTENT_W - 20, `300 17px "VAG Rounded", "VAGRounded", sans-serif`);
        ctx.fillStyle = BRAND;
        ctx.textAlign = 'center';
        ctx.fillText(job, CENTER_X, 446);
      }

      // 8 — Nº
      ctx.font = `bold 20px "VAG Rounded", "VAGRounded", sans-serif`;
      ctx.fillStyle = BRAND;
      ctx.textAlign = 'left';
      ctx.fillText(`Nº ${state.employeeId || ''}`, CONTENT_X + 10, 487);

      // 9 — Data de admissão
      ctx.font = `300 14px "VAG Rounded", "VAGRounded", sans-serif`;
      ctx.fillText('Data de admissão', CONTENT_X + 10, 510);

      ctx.font = `bold 16px "VAG Rounded", "VAGRounded", sans-serif`;
      ctx.fillText(state.admissionDate || '', CONTENT_X + 10, 532);

      // 10 — QR
      if (drawId.current !== id) return;
      const QR_SIZE = 95;
      const QR_X = W - PAT_W - QR_SIZE - 10;
      const QR_Y = 470;
      try {
        const qrImg = await loadImg('/qrcode.png');
        if (drawId.current !== id) return;
        ctx.drawImage(qrImg, QR_X, QR_Y, QR_SIZE, QR_SIZE);
      } catch (_) {}
    }

    draw();
  }, [
    state.name, state.jobTitle, state.employeeId, state.admissionDate,
    state.qrData, state.photoUrl,
  ]);
}
