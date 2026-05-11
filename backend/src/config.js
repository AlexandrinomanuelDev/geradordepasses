require('dotenv').config();

const CARD_WIDTH = 800;
const CARD_HEIGHT = 1200;

const BRAND = {
  background: '#F5F0EB',
  accent: '#7B4F2E',
  gold: '#C49A3C',
  textPrimary: '#1A1A1A',
  textSecondary: '#6B5B4E',
  white: '#FFFFFF',
};

const CONFIG = {
  PORT: process.env.PORT || 3001,
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  MAX_FILE_BYTES: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024,
  UPLOAD_MIME_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  CARD_WIDTH,
  CARD_HEIGHT,
  BRAND,
};

module.exports = CONFIG;
