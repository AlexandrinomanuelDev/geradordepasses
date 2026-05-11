const { loadImage } = require('@napi-rs/canvas');

async function loadImageFromBuffer(buffer) {
  return loadImage(buffer);
}

function drawRoundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function fitText(ctx, text, maxWidth, fontSize, fontStyle) {
  let size = fontSize;
  ctx.font = `${fontStyle} ${size}px Georgia, serif`;
  while (ctx.measureText(text).width > maxWidth && size > 20) {
    size -= 2;
    ctx.font = `${fontStyle} ${size}px Georgia, serif`;
  }
  return size;
}

module.exports = { loadImageFromBuffer, drawRoundedRect, fitText };
